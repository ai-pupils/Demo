<template>
  <Modal v-model="visible">
    <header slot="header">
      <h3>反馈审核</h3>
    </header>
    <Form :model="verifyInfo" :label-width="80">
      <FormItem label="审核状态">
        <RadioGroup v-model="verifyInfo.status">
          <Radio label="resolved">已处理</Radio>
          <Radio label="rejected">无法处理</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="审核备注">
        <Input v-model="verifyInfo.comment" type="textarea" :rows="3" placeholder="请输入审核备注"/>
      </FormItem>
    </Form>
    <div slot="footer">
      <Button type="primary" :disabled="!verifyInfo.status" @click="submit">确认</Button>
      <Button @click="show(false)">取消</Button>
    </div>
  </Modal>
</template>

<script type="text/ecmascript-6">
import { mapGetters } from 'vuex';
import stateParseMixin from '../../../mixins/commonStateParseMixin';
import transDetailsParseMixin from '../../../mixins/transactionDetailsParseMixin';
import { setVerifyContent } from '../../../store/api/transaction';

export default {
  mixins: [stateParseMixin, transDetailsParseMixin],
  data() {
    return {
      visible: false,
      verifyInfo: { status: '', comment: '' }
    };
  },
  computed: {
    ...mapGetters('transaction', { state: 'transactionDetails' }),
    reportId() {
      if (this.isEmpty) {
        return null;
      }
      const {
        data: { report_info: reportInfo }
      } = this;
      return reportInfo ? reportInfo.id : null;
    },
    trxSn() {
      if (this.isEmpty) {
        return null;
      }
      const {
        data: { trx_sn: trxSn }
      } = this;
      return trxSn;
    }
  },
  methods: {
    show(visible) {
      this.visible = visible;
    },
    submit() {
      const {
        verifyInfo: { status, comment },
        reportId,
        trxSn
      } = this;
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
};
</script>

<style type="text/less" lang="less" scoped>
</style>
