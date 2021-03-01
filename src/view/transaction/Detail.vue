<template lang="pug">
  .p-wrapper
    Spin(fix v-if="isFetching")
    section.playground(v-if="isFulfill")
      aside.playground-history
        .toolbar
          GoBackBtn
          Alert(v-if='!isEmpty')
            ul(slot='desc', style='list-style-type:none; word-break: break-all; width: 100%;')
              li
                Highlight(text='商户ID:')
                |  {{transaction.customerId}} {{transaction.customerName}}
              li
                Highlight(text='货柜ID:')
                span.ml5 {{transaction.cabinetId}}
                router-link.ml5(:to="{name: 'cabinet-detail', params:{id: transaction.cabinetId}}")
                  | {{transaction.managerCabinetId}}
              li
                Highlight(text='模型ID:')
                |  {{transaction.modelId}}
              li
                Highlight(text='商品组ID:')
                router-link.ml5(:to="{name: 'v2-sku-bundle-list', query:{pageIndex: 1, keyword: transaction.bundleId}}")
                  | {{transaction.bundleId}}
              li
                Highlight(text='交易ID及类型:')
                |  {{transaction.tid}} {{transaction.trxType}}
              li
                Highlight(text='交易SN:')
                |  {{transaction.trxSn}}
              li
                Highlight(text='交易开始时间:')
                |  {{transaction.start | fmtLocalTime}}
              li
                Highlight(text='开门时间:')
                |  {{transaction.door_opened_at | fmtLocalTime}}
              li
                Highlight(text='关门时间:')
                |  {{transaction.door_closed_at | fmtLocalTime}}
              li
                Highlight(text='交易结束时间:')
                |  {{transaction.end | fmtLocalTime}}
              li
                Highlight(text='交易时长:')
                |  {{transaction.costTime}}
              li
                Highlight(text='交易状态及Code:')
                |  {{transaction.status}} {{transaction.trxCode}}
              li.flex-box(v-if="transaction.status==='exceptional' || transaction.status === 'invalid'")
                Highlight(text='异常原因:')
                .info
                  tooltip(placement='right', :max-width="300", transfer)
                    .rows-ellipsis {{transaction.exceptionInfo}}
                    template(slot="content")
                      .text-content {{transaction.exceptionInfo}}
              li
                Highlight(text="是否放回:")
                | {{transaction.added ? "是" : "否"}}
          Alert(v-if='!isEmpty && transaction.reportInfo')
            ul.ulss(slot='desc', style='list-style-type:none; word-break: break-all; width: 100%;height: 120px;overflow-y: auto')
              li
                Highlight(text='反馈类型:')
                |  {{transferToText("reportType", transaction.reportInfo.report_type)}}
                span(v-if="transaction.reportInfo.report_type === 'error'") [{{transaction.reportInfo.error_code | getReportLabelByErrorCode}}]
              li(v-if="transaction.reportInfo.report_type === 'error'")
                Highlight(text='反馈描述:')
                |  {{transaction.reportInfo.error_desc}}
              li
                Highlight(text='反馈时间:')
                |  {{transaction.reportInfo.report_at | fmtLocalTime}}
              li
                Highlight(text='反馈人员:')
                |  {{transaction.reportInfo.operator_name}}
              li
                Highlight(text='反馈来源:')
                |  {{transaction.reportInfo.report_from}}
              template(v-if='shouldShowVerifyStatus')
                li
                  Highlight(text='审核状态:')
                  |  {{transferToText("verifyStatus", transaction.reportInfo.verify_status)}}
                li
                  Highlight(text='审核备注:')
                  |  {{transaction.reportInfo.comment}}
                li
                  Highlight(text='审核人员:')
                  |  {{transaction.reportInfo.verifier_id}} {{transaction.reportInfo.verifier_name}}
                li
                  Highlight(text='审核时间:')
                  |  {{transaction.reportInfo.verify_at | fmtLocalTime}}
          Row(type='flex', justify='space-between', align='middle')
            Col(v-if="!isEmpty")
              h6 交易起止快照
            Col(v-if="!isEmpty && transaction.layerIndex") 当前选中第{{transaction.layerIndex}}层
        ImageLayer(v-if="!isEmpty", :layerInfo="transaction.layerInfo")
        // <ImageLayer class="playground-history-content"></ImageLayer>
      .playground-content
        Demo(@exit='load', v-if='transaction', :dealerId='transaction.customerId', :trxSn='transaction.trxSn', :trxReportInfo='transaction.reportInfo')
      .feedback-verify(v-if='shouldShowVerifyBtn')
        Tooltip(content='反馈审核，快捷键v', placement='left')
          Button(type='primary', shape='circle', icon='ios-happy', size='large', @click='showVerify')
      FeedbackVerify(ref='feedbackVerify', @exit='load')
    PaginationPin(@load="load")
</template>

<script lang="ts">
import _ from 'lodash';
import Component, { mixins } from 'vue-class-component';
import { reportType, verifyStatus, tags } from '@/const/data/transactionReport';
import Demo from './components/Demo.vue';
import FeedbackVerify from './components/FeedbackVerify.vue';
import ImageLayer from './components/ImageLayer.vue';
import LoadPageMixin, { LoadPageMixinInstance } from '@/mixins/loadPage';
import { getTransactionBySn$ } from '@/api/transaction';
import { Prop, Watch } from 'vue-property-decorator';
import { Mutation } from 'vuex-class';
import PaginationPin from '@/view/transaction/components/PaginationPin.vue';

const Highlight = {
  template: '<font color="#2f4f4f"><B>{{text}}</B></font>',
  props: {
    text: { type: String, required: true }
  }
};
@Component({
  components: { ImageLayer, Demo, FeedbackVerify, Highlight, PaginationPin },
  filters: {
    getReportLabelByErrorCode(errorCode: any): any {
      if (!errorCode) return '';
      const obj: any = (tags as any).filter(
        (t: any) => t.errorCode === Number(errorCode)
      )[0];
      if (obj) {
        return obj.label;
      }
      return '';
    }
  }
})
export default class TransactionDetail extends mixins(LoadPageMixin)
  implements LoadPageMixinInstance {
  @Mutation('transaction/setTransactionDetail') setTransactionDetail!: any;
  @Prop() id!: string;
  @Watch('state')
  stateChange(val: any) {
    this.setTransactionDetail({ ...val });
  }

  fetchOnce: boolean = true;
  defaultApi: any = getTransactionBySn$;
  defaultParams: any = {
    id: this.id
  };

  transformParams(params: any) {
    return params;
  }

  get isEmpty(): any {
    const { stateData }: any = this;
    return _.isNil(stateData);
  }

  get clientHeight(): string {
    return window.screen.height - 280 + 'px';
  }

  get transaction(): any {
    if (this.isEmpty) {
      return null;
    }
    const {
      stateData: {
        id,
        trx_sn,
        trx_code,
        trx_type,
        door_opened_at,
        door_closed_at,
        start_at,
        end_at,
        time_cost,
        status,
        exception_info,
        manager_cabinet_id,
        cabinet_id,
        model_id,
        bundle_id,
        customer_id,
        customer_name,
        report_info,
        layer_info,
        added
      }
    } = <{ stateData: any }>this;
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
      door_opened_at,
      door_closed_at,
      start: start_at,
      end: end_at,
      costTime: time_cost,
      cabinetId: cabinet_id,
      modelId: model_id,
      bundleId: bundle_id,
      managerCabinetId: manager_cabinet_id,
      customerId: customer_id,
      customerName: customer_name,
      status,
      exceptionInfo: exception_info,
      layerIndex,
      reportInfo: report_info,
      layerInfo: layer_info,
      added
    };
  }

  get shouldShowVerifyBtn(): any {
    return (
      !this.isEmpty &&
      this.transaction.reportInfo &&
      this.transaction.reportInfo.verify_status === 'waiting'
    );
  }

  get shouldShowVerifyStatus(): any {
    return (
      !this.isEmpty &&
      this.transaction.reportInfo &&
      this.transaction.reportInfo.report_type === 'error'
    );
  }

  load() {
    this.loadDefaultApi({ ...this.$route.params, ...this.$route.query });
  }

  showVerify() {
    (this.$refs.feedbackVerify as any).show(true);
  }

  transferToText(type: any, key: any): string {
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

  created() {
    document.onkeyup = e => {
      if (e.key.toLowerCase() === 'v' && this.shouldShowVerifyBtn) {
        this.showVerify();
      }
    };
  }

  mounted() {
    document.querySelector<HTMLElement>('.content-wrapper')!.style.overflowY =
      'scroll';
  }

  beforeDestroy() {
    document.querySelector<HTMLElement>('.content-wrapper')!.style.overflowY =
      'auto';
  }
}
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
  width: 100%;
  height: 100%;
}

.rows-ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  width: 200px;
}
.flex-box {
  display: flex;
  justify-content: space-between;
}
.text-content {
  max-height: 500px;
  border: 0;
  overflow: auto;
}
.text-content::-webkit-scrollbar {
  display: none;
}
</style>
