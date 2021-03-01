<template lang="pug">
  .table-wrapper
    TableBox(ref="tableBox", :state='state', :default-sort='defaultSort', style='min-height:250px', @sortChange='sortChanged')
      Column(prop='id', align='center', label='报警编号', :width='120', :show-overflow-tooltip='true')
      Column(prop='serial', align='center', label='箱体编号', :min-width='200', :show-overflow-tooltip='true', sortable='custom')
      Column(prop='error_code', align='center', label='异常编码', :width='120', :show-overflow-tooltip='true', sortable='custom')
      Column(prop='priority', align='center', label='异常等级', :width='120', :show-overflow-tooltip='true', sortable="custom")
        template(slot-scope='{row}')
          span(:style="{color: getPrioritiesColor(row.priority)}")
            | {{row.priority | getExceptionPrioritiesLabelFilter}}
      Column(prop='name', align='center', label='异常信息', :width='200', :show-overflow-tooltip='true')
        template(slot-scope='{row}')
          | {{row.name | emptyText}}
      Column(prop='started_at', align='center', label='报警时间', :width='200', :show-overflow-tooltip='true', sortable="custom")
        template(slot-scope='{row}')
          | {{row.started_at | fmtLocalTime | emptyText}}
      Column(prop='status', align='center', label='状态', :width='120', :show-overflow-tooltip='true')
        template(slot-scope='{row}')
          Tag(:color='exceptionStatus[row.status].color') {{exceptionStatus[row.status].label}}
      Column(prop='name', align='center', label='是否已恢复', :width='120', :show-overflow-tooltip='true')
        template(slot-scope='{row}')
          | {{row.is_deleted ? '已恢复': '未恢复'}}
      Column(v-if="type!=='tab'", prop='trx_sn', align='center', label='交易SN', :width='200', :show-overflow-tooltip='true')
        template(slot-scope='{row}')
          router-link(v-if="row.trx_sn", :to="{name:'transaction-detail',params:{id: row.trx_id}}") {{row.trx_sn}}
          span(v-else) {{''| empty('--')}}
      Column(align='center', label='操作', :width='200', :show-overflow-tooltip='true', fixed="right")
        template(slot-scope="{row}")
          a(v-if="row.status !== exceptionStatus.HANDLING.id", @click="makedHandle(row.id, exceptionStatus.HANDLING.id)")
            | 开始解决
          a.ml5(v-if="row.status !== exceptionStatus.PENDING.id", @click="makedHandle(row.id, exceptionStatus.PENDING.id)")
            | 未解决
          a.ml5(v-if="row.status !== exceptionStatus.RESOLVED.id", @click="makedHandle(row.id, exceptionStatus.RESOLVED.id)")
            | 已解决
          a.ml5(v-if="row.status !== exceptionStatus.FALSE_ALARM.id", @click="makedHandle(row.id, exceptionStatus.FALSE_ALARM.id)")
            | 误报
</template>

<script lang="ts">
import Component, { mixins } from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import { DataListResponse, DefaultApiType } from '@/interface';
import TableBox from '@/components/shared/TableBox.vue';
import {
  GetExceptionParams,
  getExceptions$,
  GetExceptionsData,
  updateExceptionStatus$
} from '@/api/monitor';
import SearchMixin, { SearchMixinInstance } from '@/mixins/search';
import LoadPageMixin, { LoadPageMixinInstance } from '@/mixins/loadPage';
import moment from 'moment';
import { parseDateRange } from '@/utils/misc';
import { getExceptionPrioritiesColorFilter } from '@/filters';
import { ExceptionPriorities, ExceptionStatus } from '@/const/data/monitor';
import _ from 'lodash';
import PaginationBox from '@/components/shared/PaginationBox.vue';

@Component({
  components: {
    TableBox,
    PaginationBox
  }
})
export default class ExceptionList extends mixins(LoadPageMixin, SearchMixin)
  implements LoadPageMixinInstance, SearchMixinInstance {
  @Prop() faultCodes!: any;
  @Prop() type!: any;
  @Prop() trx_sn!: any;
  @Prop() params!: any;
  exceptionStatus: any = ExceptionStatus;
  queryDateRange: Date[] = parseDateRange('last week', false)();
  defaultApi: DefaultApiType = getExceptions$;
  defaultParams: any = {
    ...this.params,
    codes: this.faultCodes
  };

  internalSearch = true;

  defaultSort: any = {};

  transformParams(params: any) {
    if (this.type === 'tab') {
      return { pageIndex: 1, trx_sn: this.trx_sn };
    }
    return params;
  }

  @Watch('state', { immediate: true })
  stateChanged(state: any) {
    this.$emit('getState', state);
  }

  searchSchema: any = {};

  public search(searchSchema: any) {
    this.searchSchema = { ...searchSchema, codes: this.faultCodes };
    this.doSearch();
  }

  // 使用参数调用接口获取数据
  public loadPageData(searchSchema: any) {
    // doSearch会默认pageIndex=1,使用loadDefaultApi
    this.loadDefaultApi({ ...searchSchema, codes: this.faultCodes });
  }

  getPrioritiesColor(priority: string) {
    const p = _.find(ExceptionPriorities, { id: priority }) as any;
    return p ? p.color : '';
  }

  reSort() {
    (this.$refs['tableBox'] as any).clearSort();
  }

  sortChanged(params: any) {
    this.$emit('sortChanged', params);
  }

  makedHandle(exception_id: number, status: string) {
    updateExceptionStatus$({ exception_id, status }).subscribe(state => {
      if (!state.isError && state.payload) {
        this.$Message.success('标记成功');
        const queryDate = this.$route.query;
        this.loadDefaultApi(queryDate);
      }
    });
  }

  pageChange(page: any) {
    this.loadDefaultApi({ ...page });
  }
}
</script>

<style scoped></style>
