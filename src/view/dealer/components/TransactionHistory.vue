<template lang="pug">
  section
    Row
      span.bold 交易数:
      span.ml20 {{trxCount}}
      span.bold.ml-50 失败交易数:
      span.ml20 {{anomalyTrxCount}}
      span.bold.ml-50 错误交易数:
      span.ml20 {{errorTrxCount}}
      .fr(style="font-size: 14px")
          span 展示开关门时间
          i-switch.ml10(v-model='isShowTime')
            span(slot='open') 是
            span(slot='close') 否
    Row
      TableBox(:state='state')
        Column(prop='trx_sn', align='center', label='交易SN', :width='200', :show-overflow-tooltip='true')
        Column(prop='cabinet_id', align='center', label='货柜ID', :width='80')
        Column(prop='serial', align='center', label='箱体编号', :min-width='160')
        Column(prop='status', align='center', label='交易状态', :width='120')
          template(slot-scope='{row}')
            Tooltip.item(v-if="row.status === 'exceptional' || row.status === 'invalid'", effect='dark', placement='right')
              div(slot='content')
                div(v-for='(error,index) in row.exception_info', :key='index')
                  div error_code: {{error.error_code}}
                  div message: {{error.message}}
                  div stage: {{error.stage}}
                  br(v-if='index !== row.exception_info.length - 1')
                div(v-if='row.exception_info.length === 0') 暂无exception_info
              .hover {{row.status}}
            div(v-else='')
              | {{row.status}}
        Column(prop='type', align='center', label='交易类型', :width='120')
        Column(prop='created_at', align='center', :min-width='120', label='交易开始时间', sortable="custom")
          template(slot-scope='scope')
            .show(v-if="scope.row.created_at")
              p {{fixDateTime(scope.row.created_at).date}}
              p {{fixDateTime(scope.row.created_at).time}}
            span(v-else) --
        Column(v-if="isShowTime", prop='door_opened_at', align='center', :min-width='120', label='开门时间', sortable="custom")
          template(slot-scope='scope')
            .show(v-if="scope.row.door_opened_at")
              p {{fixDateTime(scope.row.door_opened_at).date}}
              p {{fixDateTime(scope.row.door_opened_at).time}}
            span(v-else) --
        Column(v-if="isShowTime", prop='closed_at', align='center', :min-width='120', label='关门时间', sortable="custom")
          template(slot-scope='scope')
            .show(v-if="scope.row.door_closed_at")
              p {{fixDateTime(scope.row.door_closed_at).date}}
              p {{fixDateTime(scope.row.door_closed_at).time}}
            span(v-else) --
        Column(prop='closed_at', align='center', :min-width='120', label='交易结束时间', sortable="custom")
          template(slot-scope='scope')
            .show(v-if="scope.row.closed_at")
              p {{fixDateTime(scope.row.closed_at).date}}
              p {{fixDateTime(scope.row.closed_at).time}}
            span(v-else) --
        Column(prop='time_cost', align='center', label='交易时长', :width='90')
        Column(prop='report_type', align='center', label='反馈类型', :width='90')
          template(slot-scope='scope')
            Tooltip(v-if='getReportType(scope.row)', :content='getReportErrorLabel(scope.row)', max-width='200', placement='left')
              Tag(:color='getReportType(scope.row).tagColor') {{getReportType(scope.row).text}}
            span(v-else) --
        Column(prop='verify_status', align='center', label='审核状态', :width='90')
          template(slot-scope='scope')
            Tag(v-if='getVerifyStatus(scope.row)', :color='getVerifyStatus(scope.row).tagColor') {{getVerifyStatus(scope.row).text}}
            span(v-else) --
        Column(align='center', label='操作', :width='100', fixed='right')
          template(slot-scope='{row, $index}')
            Button(type="primary", size="small", @click="viewDetail(row, $index + 1)") 查看详情
      PaginationInnerBox(:total="dataTotal", :isFetching="isFetching", @pageChange="pageChange", @sizeChange="pageChange")
</template>


<script lang="ts">
import _ from 'lodash';
import Component, { mixins } from 'vue-class-component';
import TableBox from '@/components/shared/TableBox.vue';
import LoadPageMixin, { LoadPageMixinInstance } from '@/mixins/loadPage';
import { DefaultApiType } from '@/interface';
import PaginationInnerBox from '@/components/shared/PaginationInnerBox.vue';
import { Prop } from 'vue-property-decorator';
import {
  getTransactions$,
  getTransactionStatus$,
  TransactionParams
} from '@/api/transaction';
import { reportType, tags, verifyStatus } from '@/const/data/transactionReport';
import moment from 'moment';

@Component({
  components: { PaginationInnerBox, TableBox }
})
export default class CabinetInfo extends mixins(LoadPageMixin)
  implements LoadPageMixinInstance {
  @Prop() id!: string;
  fetchOnce: boolean = true;
  defaultApi: DefaultApiType = getTransactions$;
  defaultParams: TransactionParams = {
    pageIndex: 1,
    pageSize: Number(process.env.PAGE_SIZE),
    dealerId: this.id,
    from: 'all',
    to: 'all'
  };
  trxCount: number = 0;
  anomalyTrxCount: number = 0;
  errorTrxCount: number = 0;
  isShowTime = false;

  created() {
    getTransactionStatus$({ dealerId: this.id }).subscribe(state => {
      const data = state.payload!.data;
      const errorTrxCountObject = data.results.filter(
        e => e.trx_status === 'finished'
      )[0];
      const anomalyTrxCountObject = data.results.filter(
        e => e.trx_status === 'exceptional' || e.trx_status === 'invalid'
      )[0];
      this.trxCount = data.total_count;
      this.anomalyTrxCount =
        anomalyTrxCountObject && anomalyTrxCountObject.trx_status_count || 0;
      let errorTrxCount = errorTrxCountObject &&
        errorTrxCountObject.trx_report_type &&
        errorTrxCountObject.trx_report_type.filter(
          e => e.report_type === 'error'
        )[0];
      this.errorTrxCount = errorTrxCount ? errorTrxCount.count : 0;
    });
  }

  transformParams(params: any) {
    return params;
  }

  pageChange(page: any) {
    this.loadDefaultApi({ ...page });
  }

  getReportType(row: any): any {
    const types: any = reportType;
    return _.has(row, 'report_info')
      ? types[row.report_info.report_type]
      : null;
  }

  getVerifyStatus(row: any): any {
    const verifyStatusMap: any = verifyStatus;
    return _.has(row, 'report_info')
      ? verifyStatusMap[row.report_info.verify_status]
      : null;
  }

  getReportErrorLabel(row: any): any {
    if (_.has(row, 'report_info')) {
      if (row.report_info.error_code) {
        const obj: any = (tags as any).filter(
          (t: any) => t.errorCode === Number(row.report_info.error_code)
        )[0];
        if (obj) {
          return obj.label;
        }
      }
    }
    return null;
  }

  viewDetail(row: any, index: number) {
    const paging: any = (this.state.payload as any).data.paging;
    const pageIndex: number = paging.page_index;
    const pageSize: number = paging.page_size;

    this.$router.push({
      path: '/transaction/detail/' + row.id,
      params: { id: row.id },
      query: {
        index: String(pageIndex * pageSize + index),
        dealerId: this.id,
        from: 'all',
        to: 'all'
      }
    });
  }

  fixDateTime(dateTime: string) {
    const dateSp = moment(`${dateTime}Z`)
      .format('MM-DD|HH:mm:ss')
      .split('|');
    const date = dateSp[0];
    const time = dateSp[1];
    return {
      date,
      time
    };
  }
}
</script>
