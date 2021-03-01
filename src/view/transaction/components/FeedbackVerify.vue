<template lang="pug">
  Modal(v-model='visible')
    header(slot='header')
      h3 反馈审核
    Form(:model='verifyInfo', :label-width='80')
      FormItem(label='审核状态')
        RadioGroup(v-model='verifyInfo.status')
          Radio(label='resolved') 已处理
          Radio(label='rejected') 无法处理
      FormItem(label='审核备注')
        Input(v-model='verifyInfo.comment', type='textarea', :rows='3', placeholder='请输入审核备注')
    div(slot='footer')
      Button(type='primary', :disabled='!verifyInfo.status', @click='submit') 确认
      Button(@click='show(false)') 取消
</template>

<script lang="ts">
import { setVerifyContent } from '@/store/api/transaction';
import { Watch } from 'vue-property-decorator';
import Component, { mixins } from 'vue-class-component';
import { Getter } from 'vuex-class';
import TransactionDetailsParseMixin from '@/view/transaction/detailsParseMixin';

@Component
export default class FeedbackVerify extends mixins(
  TransactionDetailsParseMixin
) {
  @Getter('transaction/transactionDetails') transactionDetails!: any;
  @Watch('transactionDetails', { immediate: true })
  transactionDetailsChange(data: any) {
    this.state = data;
  }

  visible: boolean = false;
  verifyInfo: any = { status: '', comment: '' };

  get reportId() {
    if (this.isEmpty) {
      return null;
    }
    const {
      detailInfo: { report_info: reportInfo }
    }: any = this;
    return reportInfo ? reportInfo.id : null;
  }

  get trxSn() {
    if (this.isEmpty) {
      return null;
    }
    const {
      detailInfo: { trx_sn: trxSn }
    } = this;
    return trxSn;
  }

  show(visible: any) {
    this.visible = visible;
  }

  submit() {
    const {
      verifyInfo: { status, comment },
      reportId,
      trxSn
    }: any = this;
    setVerifyContent(reportId, { status, comment, trx_sn: trxSn })
      .then(() => {
        this.$Message.success('提交审核内容成功！');
        this.$emit('exit');
        this.show(false);
      })
      .catch(() => {
        this.$Message.error('提交审核内容失败！');
      });
  }
}
</script>

<style type="text/less" lang="less" scoped>
</style>
