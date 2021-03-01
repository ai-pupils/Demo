<template lang="pug">
  section
    Card
      h6(slot='title') 准确率统计
      Form.search
        FormItem.form-item
          span.bold 搜索条件：
          AppDatePicker.ml5(v-model='queryDateRange', placeholder='查询时间')
          Select.ml5(v-model="searchSchema.dealer_id", style='width: 200px', placeholder="商户ID", clearable, filterable)
            Option(v-for="(item,index) in dealer_list", :key="item.id", :value="item.id",
              :label="item.label")
          Select.ml5(v-model="searchSchema.cabinet_type_id", style='width: 200px', placeholder="柜体ID", clearable, filterable)
            Option(v-for="(item,index) in cabinet_type_list", :key="item.id", :value="item.id",
              :label="item.label")
          Input.ml5(v-model='searchSchema.cabinet_serial', placeholder='箱体编号', style='width: 100px', clearable)
          Input.ml5(v-model='searchSchema.bundle_id', placeholder='商品组ID', style='width: 100px', clearable)
          Input.ml5(v-model='searchSchema.model_id', placeholder='模型ID', style='width: 100px', clearable)
          Button.fr(type='default', html-type='submit', @click.prevent='exportCsv', icon='md-download', :loading="loadingCsv") 导出
        FormItem.form-item
          span.bold 统计方式：
          radio-group.ml5(v-model="searchSchema.aggregate_field", type="button", @on-change="radioChange")
            radio(v-for="aggregate in aggregateList", :label="aggregate.id", :key="aggregate.id") {{aggregate.label}}
          Button.query-btn.ml20(type='primary', html-type='submit', @click.prevent='doSearch', icon='ios-search') 查询
          Button.query-btn.ml5(type='primary', html-type='submit', @click.prevent='reSearch', icon='ios-refresh') 重置
      recognition-list(:state="state", @sortChanged="sortChanged")
      PaginationBox(ref="paginationBox", :total='dataTotal', :isFetching='state.isFetching')
</template>

<script lang="ts">
import Component, { mixins } from 'vue-class-component';
import LoadPageMixin, { LoadPageMixinInstance } from '@/mixins/loadPage';
import SearchMixin, { SearchMixinInstance } from '@/mixins/search';
import { parseDateRange } from '@/utils/misc';
import { DefaultApiType } from '@/interface';
import {
  exportRecognitionData$,
  getRecognitions$,
  GetRecognitionsParams
} from '@/api/monitor';
import AppDatePicker from '@/components/shared/AppDatePicker.vue';
import RecognitionList from '@/view/monitor/recognition/components/RecognitionList.vue';
import _ from 'lodash';
import PaginationBox from '@/components/shared/PaginationBox.vue';
import { getCustomers$ } from '@/api/v2/users';
import { getCabinetTypes$ } from '@/api/cabinet';
import { RecognitionAggregateList } from '@/const/data/monitor';
import downloadCsv from '@/utils/downloadCsv';

@Component({
  components: { AppDatePicker, RecognitionList, PaginationBox }
})
export default class App extends mixins(LoadPageMixin, SearchMixin)
  implements LoadPageMixinInstance, SearchMixinInstance {
  queryDateRange: Date[] = parseDateRange('last week', false)();
  dealer_list: any[] = [];
  cabinet_type_list: any[] = [];
  aggregateList = RecognitionAggregateList;
  loadingCsv = false;

  defaultApi: DefaultApiType = getRecognitions$;
  defaultParams: any = {
    keyword: undefined,
    dealer_id: undefined,
    cabinet_id: undefined,
    cabinet_serial: undefined,
    cabinet_type_id: undefined,
    bundle_id: undefined,
    model_id: undefined,
    aggregate_field: 'dealer_id',
    from: undefined,
    to: undefined,
    pageIndex: 1,
    pageSize: Number(process.env.PAGE_SIZE),
    sortBy: 'dealer_id desc',
    sortDirection: 'down'
  };

  searchSchema: any = {
    ...this.defaultParams
  };

  transformParams(params: any) {
    return params;
  }

  mounted() {
    this.getDealerList();
    this.getCabinetTypeList();
  }

  radioChange(v: string) {
    this.searchSchema.aggregate_field = v;
    this.searchSchema.sortBy = `${v} asc`;
    this.doSearch();
  }

  sortChanged(params: any) {
    if (!_.isEmpty(params)) {
      const { sortBy, sortDirection } = params;
      if (sortBy && sortDirection) {
        const direction = sortDirection === 'down' ? 'desc' : 'asc';
        this.searchSchema.sortBy = `${sortBy} ${direction}`;
        // 排序时，页码调整为1
        (this.$refs.paginationBox as any).init();
      } else {
        this.searchSchema.sortBy = undefined;
      }
    }
    this.doSearch();
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

  getCabinetTypeList() {
    getCabinetTypes$({}).subscribe(state => {
      if (state.isFulfill) {
        const {
          payload: {
            data: { results }
          }
        } = state as any;
        this.cabinet_type_list = results.map((r: any) => {
          return {
            id: r.id.toString(),
            name: r.name,
            // note: select列表必须转成字符串，否则有bug
            label: r.name ? r.id + ' - ' + r.name : r.id.toString()
          };
        });
      }
    });
  }

  reSearch() {
    const queryData = parseDateRange('last week', false)();
    this.queryDateRange = queryData;
    this.searchSchema = { ...this.defaultParams };
    this.doSearch();
  }

  exportCsv() {
    this.loadingCsv = true;
    exportRecognitionData$({ ...this.searchSchema }).subscribe({
      next: ({ payload, isError }): any => {
        if (!isError && payload) {
          downloadCsv({
            file: (payload as any).file,
            filename: 'recognition_accurary_report'
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
