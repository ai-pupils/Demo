<template lang="pug">
  section
    Card
      h6(slot='title') 异常监控
      Form.search
        FormItem.form-item
          AppDatePicker(v-model='queryDateRange', placeholder='查询时间', :options="datePickerOption")
          Input.ml5(v-model='searchSchema.cabinet_serial', placeholder='箱体编号', style='width: 200px', clearable)
          Select.ml5(v-model="searchSchema.priority", style='width: 200px', placeholder="异常等级", clearable)
            Option(v-for="item in exceptionPriorities", :value="item.id", :key="item.id") {{item.label}}
          Select.ml5(v-model="searchSchema.cabinet_type_id", style='width: 200px', placeholder="柜体ID", clearable)
            Option(v-for="item in cabinet_type_list", :value="item.id", :key="item.id", :label="`${item.id}（${item.name}）`")
          Select.ml5(v-model="searchSchema.dealer_id", style='width: 200px', placeholder="商户ID", clearable)
            Option(v-for="item in dealer_list", :value="item.id", :key="item.id", :label="`${item.id}（${item.name}）`")
          Select.ml5(v-model="searchSchema.status", style='width: 200px', placeholder="状态", clearable)
            Option(v-for="item in exceptionStatus", :value="item.id", :key="item.id", :label="`${item.label}`")
          Button.query-btn.ml5(type='primary', html-type='submit', @click.prevent='search', icon='ios-search') 查询
          Button.query-btn.ml5(type='primary', html-type='submit', @click.prevent='reSearch', icon='ios-refresh') 重置
          Button.fr(type='default', html-type='submit', @click.prevent='exportCsv', icon='md-download', :loading="loadingCsv") 导出
      TabsBox(v-model="currentTab", :tabs="tabs", @change="tabChanged")
        template(v-for="type in exceptionTypes", :slot="type.name")
          exception-list(ref="exceptionList", v-if="currentTab === type.name", :faultCodes="type.codes",
            :params="searchSchema", @getState="getState", @sortChanged="sortChanged")
      PaginationInnerBox(ref="paginationBox", :total='dataCount', :isFetching='stateInfo.isFetching',
        @pageChange="pageChange", @sizeChange="pageChange")
</template>

<script lang="ts">
import Vue from 'vue';
import { parseDateRange, parseDaterangepickerOption } from '@/utils/misc';
import Component, { mixins } from 'vue-class-component';
import AppDatePicker from '@/components/shared/AppDatePicker.vue';
import TabsBox, { TabPaneType } from '@/components/shared/TabsBox.vue';
import {
  ExceptionPriorities,
  ExceptionStatus,
  ExceptionTypes
} from '@/const/data/monitor';
import ExceptionList from '@/view/monitor/exception/components/ExceptionList.vue';
import { exportExceptionData$ } from '@/api/monitor';
import moment from 'moment';
import { Watch } from 'vue-property-decorator';
import LoadPageMixin, { LoadPageMixinInstance } from '@/mixins/loadPage';
import SearchMixin, { SearchMixinInstance } from '@/mixins/search';
import { getCabinetTypes$, GetCabinetTypesData } from '@/api/cabinet';
import { DataResponse, DefaultApiType, StateListData } from '@/interface';
import { getCustomers$ } from '@/api/v2/users';
import _ from 'lodash';
import PaginationInnerBox from '@/components/shared/PaginationInnerBox.vue';
import { downloadFiles } from '@/utils/downloadCsv';

@Component({
  components: {
    TabsBox,
    AppDatePicker,
    ExceptionList,
    PaginationInnerBox
  }
})
export default class App extends mixins(LoadPageMixin, SearchMixin)
  implements LoadPageMixinInstance, SearchMixinInstance {
  queryDateRange: Date[] = parseDateRange('last week', false)();
  currentTab: string = 'all';
  exceptionTypes: any[] = ExceptionTypes;
  exceptionPriorities: any[] = ExceptionPriorities;
  exceptionStatus: any[] = ExceptionStatus;
  tabs: TabPaneType[] = this.exceptionTypes;
  cabinet_type_list: any[] = [];
  dealer_list: any[] = [];
  stateInfo: any = {};
  dataCount: number = 0;
  loadingCsv = false;

  defaultApi: DefaultApiType = getCabinetTypes$;
  defaultParams: any = {
    trx_sn: undefined,
    keyword: undefined,
    dealer_id: undefined,
    cabinet_serial: undefined,
    cabinet_type_id: undefined,
    priority: undefined,
    from: this.queryDateRange[0],
    to: this.queryDateRange[1],
    status: undefined,
    pageIndex: 1,
    pageSize: Number(process.env.PAGE_SIZE),
    sortBy: 'started_at desc',
    sortDirection: 'down'
  };

  searchSchema: any = {
    ...this.defaultParams
  };

  getState(state: any) {
    if (state.isFulfill) {
      this.stateInfo = state;
      this.dataCount = state.payload.data.total_count;
    }
  }

  @Watch('queryDateRange', { immediate: true })
  queryDateRangeChanged(val: any[]) {
    this.searchSchema.from = val[0];
    this.searchSchema.to = val[1];
  }

  @Watch('state', { immediate: true })
  stateChanged(state: StateListData<GetCabinetTypesData>) {
    if (state.isFulfill) {
      this.cabinet_type_list = state.payload!.data.results.map(type => {
        return { id: type.id, name: type.name };
      });
    }
  }

  tabChanged() {
    this.searchSchema.pageIndex = 1;
    this.searchSchema.sortBy = 'started_at desc';
    this.searchSchema.sortDirection = 'down';
    (this.$refs.paginationBox as any).init();
  }

  sortChanged(params: any) {
    if (!_.isEmpty(params)) {
      const { sortBy, sortDirection } = params;
      if (sortBy && sortDirection) {
        let direction = sortDirection === 'down' ? 'desc' : 'asc';
        if (sortBy === 'priority') {
          direction = sortDirection === 'down' ? 'asc' : 'desc';
        }
        this.searchSchema.sortBy = `${sortBy} ${direction}`;
        // 排序时，页码调整为1
        (this.$refs.paginationBox as any).init();
      } else {
        this.searchSchema.sortBy = undefined;
      }
    }
    this.search();
  }

  mounted() {
    this.getDealerList();
  }

  getDealerList() {
    getCustomers$({ pageIndex: 1, pageSize: 99999 }).subscribe(state => {
      if (state.isFulfill) {
        const {
          payload: {
            data: { results }
          }
        } = state as any;
        this.dealer_list = results.map((r: any) => {
          return {
            id: r.user_id.toString(),
            name: r.name,
            // note: select列表必须转成字符串，否则有bug
            label: r.name ? r.user_id + ' - ' + r.name : r.user_id.toString()
          };
        });
      }
    });
  }

  search() {
    (this.$refs.paginationBox as any).init();
    ((this.$refs['exceptionList'] as any)[0] as ExceptionList).search(
      this.searchSchema
    );
  }

  loadPageData(params: any) {
    ((this.$refs['exceptionList'] as any)[0] as ExceptionList).loadPageData(
      params
    );
  }

  pageChange(page: any) {
    this.searchSchema.pageIndex = page.pageIndex;
    this.searchSchema.pageSize = page.pageSize;
    this.loadPageData(this.searchSchema);
  }

  reSearch() {
    // 重置排序
    ((this.$refs['exceptionList'] as any)[0] as ExceptionList).reSort();
    // 重置时间组件
    this.queryDateRange = parseDateRange('last week', false)();
    // 重置搜索参数
    this.searchSchema = { ...this.defaultParams };
    this.loadPageData(this.defaultParams);
  }

  transformParams(params: any) {
    return params;
  }

  get datePickerOption() {
    return parseDaterangepickerOption(
      [
        { text: '昨天', distance: 'last day' },
        { text: '最近一周', distance: 'last week' },
        { text: '最近一个月', distance: 'last month' },
        { text: '最近三个月', distance: 'three month' }
      ],
      false
    );
  }

  exportCsv() {
    this.loadingCsv = true;
    exportExceptionData$({ ...this.searchSchema }).subscribe({
      next: (state): any => {
        const start = moment(this.searchSchema.from).format('YYYY-MM-DD');
        const end = moment(this.searchSchema.to).format('YYYY-MM-DD');
        if (!state.isError && state.payload) {
          downloadFiles({
            file: (state.payload as any).file,
            filename: `exceptions_${start}_${end}`,
            type: 'xlsx'
          });
          this.$Message.success('导出成功');
        } else {
          this.loadingCsv = false;
        }
      },
      error: () => {
        this.loadingCsv = false;
        this.$Message.error('导出失败');
      },
      complete: () => {
        this.loadingCsv = false;
      }
    });
  }
}
</script>

<style scoped></style>
