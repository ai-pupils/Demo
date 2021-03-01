<template lang="pug">
  section
    Row.info-box
      Form(inline, :label-width='90', label-position='left')
        Col(span='4')
          FormItem(label='当前状态：')
            span.important-text {{getStatus(ticket_info)}}
        Col(span='4')
          FormItem(label='问题分类：') {{ticket_info.type_name | empty}}
        Col(span='4')
          FormItem(label='商户邮箱：') {{ticket_info.reporter_email | empty}}
        Col(span='4')
          FormItem(label='工单编号：') {{ticket_info.id}}
    Row.info-box
      Form(inline, :label-width='90', label-position='left')
        Col(span='4')
          FormItem(label='是否紧急：')
            span.important-text {{ticket_info.is_urgent ? '是': '否'}}
        Col(span='4')
          FormItem(label='商户ID：') {{ticket_info.reporter_id | empty}}
        Col(span='4')
          FormItem(label='商户手机号：') {{ticket_info.reporter_phone | empty}}
        Col(span='4')
          FormItem(label='提交时间：') {{ticket_info.created_at | fmtLocalTime}}
</template>

<script lang="ts">
import Vue from 'vue';
import { Prop, Watch } from 'vue-property-decorator';
import { DataResponse, MetaType } from '@/interface';
import { GetTicketsData } from '@/api/ticket';
import Component from 'vue-class-component';

@Component({
  components: {}
})
export default class TicketInfo extends Vue {
  @Prop() state!: any;
  ticket_info = {};

  @Watch('state', { immediate: true })
  stateChanged(state: MetaType<DataResponse<GetTicketsData>>) {
    if (state.isFulfill) {
      this.ticket_info = state.payload!.data;
    }
  }

  getStatus(row: any) {
    switch (row.status) {
      case 'PENDING':
        return '待处理';
      case 'PROCESSING':
        const logs = row.work_order_logs;
        const person_type = (logs[logs.length - 1]).person_type;
        if (person_type === 'DEALER') {
          return '待处理';
        } else {
          return '待商户反馈';
        }
      case 'DONE':
        return '已结单';
      default:
        return '待处理';
    }
  }
}
</script>

<style scoped>
.important-text {
  color: #fa9d11;
}
</style>
