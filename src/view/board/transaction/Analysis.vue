<template>
  <div class="p-wrapper">
    <section class="playground">
      <aside class="playground-history ">
        <div class="toolbar">
          <GoBackBtn></GoBackBtn>
          <Alert v-if="!isEmpty">
            <ul slot="desc" style="list-style-type:none; word-break: break-all; width: 100%;">
              <li><Highlight text="商户ID:"></Highlight> {{transaction.customerId}} {{transaction.customerName}}</li>
              <li><Highlight text="货柜ID:"></Highlight> {{transaction.cabinetId}} {{transaction.managerCabinetId}}</li>
              <li><Highlight text="模型ID:"></Highlight> {{transaction.modelId}}</li>
              <li><Highlight text="交易ID及类型:"></Highlight> {{transaction.tid}} {{transaction.trxType}}</li>
              <li><Highlight text="交易SN:"></Highlight> {{transaction.trxSn}}</li>
              <li><Highlight text="交易开始时间:"></Highlight> {{transaction.start | fmtLocalTime}}</li>
              <li><Highlight text="交易结束时间:"></Highlight> {{transaction.end | fmtLocalTime}}</li>
              <li><Highlight text="交易时长:"></Highlight> {{transaction.costTime}}</li>
              <li><Highlight text="交易状态及Code:"></Highlight> {{transaction.status}} {{transaction.trxCode}}</li>
              <li v-if="transaction.status==='exceptional'"><Highlight text="异常原因:"></Highlight> {{transaction.exceptionInfo}}</li>
            </ul>
          </Alert>
          <Alert v-if="!isEmpty && transaction.reportInfo">
            <ul slot="desc" class="ulss" style="list-style-type:none; word-break: break-all; width: 100%;height: 120px;overflow-y: auto">
              <li><Highlight text="反馈类型:"></Highlight> {{transferToText("reportType", transaction.reportInfo.report_type)}} <span v-if="transaction.reportInfo.report_type === 'error'">[{{transaction.reportInfo.error_code | getReportLabelByErrorCode}}]</span></li>
              <li v-if="transaction.reportInfo.report_type === 'error'"><Highlight text="反馈描述:"></Highlight> {{transaction.reportInfo.error_desc}}</li>
              <li><Highlight text="反馈时间:"></Highlight> {{transaction.reportInfo.report_at | fmtLocalTime}}</li>
              <li><Highlight text="反馈人员:"></Highlight> {{transaction.reportInfo.operator_name}}</li>
              <li><Highlight text="反馈来源:"></Highlight> {{transaction.reportInfo.report_from}}</li>
              <template v-if="shouldShowVerifyStatus">
                <li><Highlight text="审核状态:"></Highlight> {{transferToText("verifyStatus", transaction.reportInfo.verify_status)}}</li>
                <li><Highlight text="审核备注:"></Highlight> {{transaction.reportInfo.comment}}</li>
                <li><Highlight text="审核人员:"></Highlight> {{transaction.reportInfo.verifier_id}} {{transaction.reportInfo.verifier_name}}</li>
                <li><Highlight text="审核时间:"></Highlight> {{transaction.reportInfo.verify_at | fmtLocalTime}}</li>
              </template>
            </ul>
          </Alert>
          <Row type="flex" justify="space-between" align="middle">
            <Col> <h6>交易起止快照</h6> </Col>
            <Col v-if="!isEmpty && transaction.layerIndex"> 当前选中第{{transaction.layerIndex}}层 </Col>
          </Row>
        </div>

        <ImageLayer></ImageLayer>
        <!--<ImageLayer class="playground-history-content"></ImageLayer>-->
      </aside>

      <div class="playground-content">
        <Demo @exit="load" v-if="transaction" :dealerId="transaction.customerId" :trxSn="transaction.trxSn"
              :trxReportInfo="transaction.reportInfo"></Demo>
      </div>
      <div v-if="shouldShowVerifyBtn" class="feedback-verify">
        <Tooltip content="反馈审核，快捷键v" placement="left">
          <Button type="primary" shape="circle" icon="ios-happy" size="large" @click="showVerify"></Button>
        </Tooltip>
      </div>
      <FeedbackVerify ref="feedbackVerify" @exit="load"></FeedbackVerify>
    </section>
  </div>
</template>

<script type="text/ecmascript-6">
import { mapActions, mapGetters } from 'vuex';
import stateParseMixin from '@/mixins/commonStateParseMixin';
import transDetailsParseMixin from '@/mixins/transactionDetailsParseMixin';
import { reportType, verifyStatus, tags } from '@/const/data/transactionReport';
import Demo from '@/view/board/transaction/demo/Index';
import ImageLayer from './ImageLayer';
import FeedbackVerify from './FeedbackVerify';

const Highlight = {
  template: '<font color="#2f4f4f"><B>{{text}}</B></font>',
  props: {
    text: { type: String, required: true }
  }
};

export default {
  mixins: [stateParseMixin, transDetailsParseMixin],
  components: { ImageLayer, Demo, FeedbackVerify, Highlight },
  computed: {
    ...mapGetters('transaction', { state: 'transactionDetails' }),
    clientHeight() {
      console.log(window.screen.height);
      return window.screen.height - 280 + 'px';
    },
    transaction() {
      if (this.isEmpty) {
        return null;
      }
      const {
        data: {
          id,
          trx_sn,
          trx_code,
          trx_type,
          start_at,
          end_at,
          time_cost,
          status,
          exception_info,
          manager_cabinet_id,
          cabinet_id,
          model_id,
          customer_id,
          customer_name,
          report_info
        }
      } = this;
      const {
        $route: {
          query: { layerIndex }
        }
      } = this;
      return {
        tid: id,
        trxSn: trx_sn,
        trxCode: trx_code,
        trxType: trx_type,
        start: start_at,
        end: end_at,
        costTime: time_cost,
        cabinetId: cabinet_id,
        modelId: model_id,
        managerCabinetId: manager_cabinet_id,
        customerId: customer_id,
        customerName: customer_name,
        status,
        exceptionInfo: exception_info,
        layerIndex,
        reportInfo: report_info
      };
    },
    shouldShowVerifyBtn() {
      return (
        !this.isEmpty &&
        this.transaction.reportInfo &&
        this.transaction.reportInfo.verify_status === 'waiting'
      );
    },
    shouldShowVerifyStatus() {
      return (
        !this.isEmpty &&
        this.transaction.reportInfo &&
        this.transaction.reportInfo.report_type === 'error'
      );
    }
  },
  methods: {
    ...mapActions('transaction', ['getTransactionDetails']),
    load() {
      const {
        $route: {
          params: { tid }
        }
      } = this;

      this.getTransactionDetails({
        serialId: tid
      });
    },
    showVerify() {
      this.$refs.feedbackVerify.show(true);
    },
    transferToText(type, key) {
      if (!key) {
        return '';
      }
      if (type === 'reportType') {
        return reportType[key].text;
      } else if (type === 'verifyStatus') {
        return verifyStatus[key].text;
      }
      return '';
    }
  },
  mounted() {
    this.load();
  },
  created() {
    document.onkeyup = e => {
      if (e.key.toLowerCase() === 'v' && this.shouldShowVerifyBtn) {
        this.showVerify();
      }
    };
  },
  filters: {
    getReportLabelByErrorCode(errorCode) {
      if (!errorCode) return '';
      const obj = tags.filter(t => t.errorCode === Number(errorCode))[0];
      if (obj) {
        return obj.label;
      }
      return '';
    }
  }
};
</script>

<style type="text/less" lang="less" scoped>
@import (less) '~@/css/vars.less';

.toolbar {
  padding: 0 0 14px;
}

@bar-width: 320px;
.playground {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  font-size: 0;
  padding: 12px 12px 24px;

  &-history {
    padding: 0 12px 12px;
    height: 100%;
    width: @bar-width;
    display: flex;
    flex-direction: column;
    position: absolute;
    left: 0;
    font-size: 12px;
    &-content {
      overflow-y: auto;
      padding-right: 12px;
    }
  }

  &-content {
    font-size: 12px;
    width: 100%;
    padding-left: @bar-width - 12;
    box-sizing: border-box;
    height: 100%;
  }
}

h6 {
  font-size: 14px;
}

.feedback-verify {
  position: fixed;
  bottom: 2%;
  right: 2%;
  z-index: 999;
}
.p-wrapper {
  position: relative;
}
</style>
