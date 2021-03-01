<template lang="pug">
  .table-wrapper
    TableBox(:state='state', :default-sort='defaultSort', @sortChange='sortChange')
      Column(prop='trx_sn', align='center', label='交易SN', :min-width='200', :show-overflow-tooltip='true', sortable="custom")
      Column(prop='cabinet_id', align='center', label='货柜ID', sortable="custom")
      Column(prop='serial', align='center', label='箱体编号', :min-width='180', sortable="custom")
        template(slot-scope='scope')
          router-link(v-if="scope.row.serial",
            :to="{name: 'cabinet-detail', params: {id: scope.row.cabinet_id}}") {{scope.row.serial}}
          span(v-else) --
      Column(prop='status', align='center', label='交易状态', :min-width='90', sortable="custom")
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
      Column(prop='type', align='center', label='交易类型', :min-width='90', sortable="custom")
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
      Column(prop='time_cost', align='center', label='交易时长', :min-width='90', sortable="custom")
      Column(prop='report_type', align='center', label='反馈类型')
        template(slot-scope='scope')
          Tooltip(v-if='getReportType(scope.row)', :content='getReportErrorLabel(scope.row)', placement='left')
            Tag(:color='getReportType(scope.row).tagColor') {{getReportType(scope.row).text}}
          span(v-else) --
      <!--      Column(prop='verify_status', align='center', label='审核状态')-->
      <!--        template(slot-scope='scope')-->
      <!--          Tag(v-if='getVerifyStatus(scope.row)', :color='getVerifyStatus(scope.row).tagColor') {{getVerifyStatus(scope.row).text}}-->
      <!--          span(v-else) &#45;&#45;-->
      Column(label="是否放回", align='center', show-overflow-tooltip)
        template(slot-scope="{row}")
          | {{row.added ? "是" : "否"}}
      Column(align='center', label='操作', :width='100', fixed='right')
        template(slot-scope='{row, $index}')
          Button(type="primary", size="small", @click="viewDetail(row, $index + 1)") 查看详情
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import * as _ from 'lodash';
import { Tooltip } from 'element-ui';
import StatusBox from '@/components/shared/StatusBox.vue';
import TableBox from '@/components/shared/TableBox.vue';
import { reportType, tags, verifyStatus } from '@/const/data/transactionReport';
import { Prop } from 'vue-property-decorator';
import { MetaType } from '@/interface';
import moment from 'moment';
import fmt from '@/const/fmt';

@Component({
  components: { StatusBox, ElToolTip: Tooltip, TableBox }
})
export default class ListTable extends Vue {
  @Prop() state!: MetaType;
  @Prop() sortChange!: any;
  @Prop() defaultSort!: any;
  @Prop() isShowTime!: boolean;

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
    const paging: any = this.state.payload.data.paging;
    const pageIndex: number = paging.page_index;
    const pageSize: number = paging.page_size;

    this.$router.push({
      path: '/transaction/detail/' + row.id,
      params: { id: row.id },
      query: {
        index: String(pageIndex * pageSize + index),
        ...this.$route.query,
        timestamp: String(Date.now())
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
