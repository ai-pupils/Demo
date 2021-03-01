<template lang="pug">
  .p-wrapper
    .toolbar
      GoBackBtn
      Card(style="min-height:800px")
        VerifyStep(v-if="autoTraining", style="margin: 40px 0",
          :state="verifyStepState", :active="verifyStepIndex", :process-status="verifyStepStatus")
        VerifyStep(v-if="!autoTraining && !isOld", style="margin: 40px 0",
          :state="verifyStepState", :active="verifyStepIndex", :process-status="verifyStepStatus")
        Form(v-if="baseInfo.length > 0")
          Row.info-title 基本信息
          Row.info-box
            Col(span='8')
              FormItem(:label='baseInfo[0].label') {{baseInfo[0].text}}
            Col(span='8')
              FormItem(:label='baseInfo[1].label') {{baseInfo[1].text}}
            Col(span='8')
              FormItem(:label='baseInfo[2].label') {{baseInfo[2].text}}
          Row.info-box
            Col(span='8')
              FormItem(:label='baseInfo[3].label') {{baseInfo[3].text}}
            Col(span='8')
              FormItem(:label='baseInfo[4].label') {{baseInfo[4].text}}
            Col(span='8')
              FormItem(:label='baseInfo[5].label') {{baseInfo[5].text}}
          Row.info-box
            Col(span='8')
              FormItem(:label='baseInfo[6].label') {{baseInfo[6].text}}
            Col(span="8", v-if="!autoTraining && isOld")
              FormItem(label="审核状态:")
                Tag(v-if="bundleInfo.status === 'approval'", color="success") 审核通过
                Tag(v-else, color="error") 审核未通过
        //aside.playground-history
          CommonInfoCard(:data="baseInfo", cardTitle="商品组信息")
          br
          CommonInfoCard(:data="bundle", cardTitle="审核信息")
        //h3.mb10(style="padding-left:340px") 组内商品信息
        Row.info-title 商品列表
        SkuBundleVerifyCard(:state="state", ref="verifyCard", :showCheckBox="false",
          :spanNum="5", :visionId="bundleInfo.vision_id")
        Row.info-title 审核日志
        VerifyLogTable(:logs="verifyLogs")
</template>

<script lang="ts">
import Component, { mixins } from 'vue-class-component';
import GoBack from '@/components/shared/GoBack.vue';
import SkuBundleInfo from './components/SkuBundleInfo.vue';
import SkuList from './components/SkuList.vue';
import ModelList from './components/ModelList.vue';
import TrainingList from './components/TrainingList.vue';
import CabinetList from './components/CabinetList.vue';
import SkuAppearancesCard from '@/view/common/SkuAppearancesCard.vue';
import { Prop } from 'vue-property-decorator';
import CommonInfoCard from '@/components/shared/CommonInfoCard.vue';
import LoadPageMixin, { LoadPageMixinInstance } from '@/mixins/loadPage';
import { getBundleSkus$, getSkuBundlesV2$ } from '@/api/sku-bundle';
import { DefaultApiType } from '@/interface';
import SkuBundleVerifyCard from './components/SkuBundleVerifyCard.vue';
import _ from 'lodash';
import fmt from '@/const/fmt';
import { getSkuBundleReviewedStatusFilter } from '@/filters/statusType';
import VerifyMixin from '@/view/sku-bundle-v2/VerifyMixin';
import VerifyStep from '@/view/sku-bundle-v2/components/VerifyStep.vue';
import { getBundleLogs$, GetBundleLogsData } from '@/api/v2/sku-bundle';
import { VerifyStepStateType } from './components/interface';
import { createEmptyTrackMeta } from '@/utils/misc';
import VerifyLogTable from './components/VerifyLogTable.vue';

@Component({
  components: {
    VerifyStep,
    SkuAppearancesCard,
    GoBack,
    CabinetList,
    TrainingList,
    ModelList,
    SkuList,
    SkuBundleInfo,
    CommonInfoCard,
    SkuBundleVerifyCard,
    VerifyLogTable
  }
})
export default class VerifySkuBundleDetail
  extends mixins(LoadPageMixin, VerifyMixin)
  implements LoadPageMixinInstance {
  @Prop() id!: string;
  defaultApi: DefaultApiType = getBundleSkus$;
  defaultParams: any = {
    id: this.id
  };
  bundleInfo: any = {};
  verifyStepState: VerifyStepStateType[] = [];
  verifyStepIndex: number = 2;
  verifyStepStatus: string = 'process';
  verifyLogs: any = createEmptyTrackMeta();
  autoTraining: boolean = false;

  transformParams(params: any) {
    return {
      ...params
    };
  }

  get isOld() {
    return this.isOldVersion(this.bundleInfo);
  }

  created() {
    getSkuBundlesV2$({ bundleId: this.id }).subscribe({
      next: state => {
        if (state.isFulfill) {
          const {
            payload: {
              data: { bundles }
            }
          } = state as any;
          if (bundles && bundles.length > 0) {
            this.bundleInfo = bundles[0];
          }
        }
      }
    });

    getBundleLogs$({ bundleId: this.id }).subscribe({
      next: state => {
        if (state.isFulfill) {
          let lastIndex = 0;
          const logs: GetBundleLogsData[] = _.reverse([
            ...state.payload!.data.results
          ]);
          const last = logs.slice(0, 1);
          const initState = this.getInitState(logs);
          const reviewState = this.getReviewState(logs);
          const reviewFirstState = this.getReviewFirstState(logs);
          const reviewSecondState = this.getReviewSecondState(logs);
          const reviewThirdState = this.getReviewThirdState(logs);

          this.autoTraining = this.isAutoTraining(state.payload!.data.results);

          if (this.autoTraining) {
            const {
              verifyStepStatus,
              verifyStepIndex,
              verifyStepState
            } = this.setAutoTraining(logs);
            this.verifyStepStatus = verifyStepStatus;
            this.verifyStepIndex = verifyStepIndex;
            this.verifyStepState = verifyStepState;
            this.verifyLogs = state;
            if (!this.verifyLogs.error) {
              const results = this.verifyLogs.payload.data.results;
              results[results.length - 1].operator_name = '--';
            }
            return;
          }

          if (this.getReviewThirdState(last)) {
            const processStatus = this.getProcessStatus(reviewThirdState);
            if (processStatus === 'error') {
              this.verifyStepStatus = processStatus;
              this.verifyStepIndex = 4;
              lastIndex = 5;
            } else {
              this.verifyStepIndex = 5;
              lastIndex = this.verifyStepIndex;
              this.verifyStepStatus = 'success';
            }
          } else if (this.getReviewSecondState(last)) {
            const processStatus = this.getProcessStatus(reviewSecondState);
            if (processStatus === 'finish') {
              this.verifyStepIndex = 4;
              this.verifyStepStatus = 'process';
              lastIndex = this.verifyStepIndex;
            } else if (processStatus === 'error') {
              this.verifyStepIndex = 3;
              this.verifyStepStatus = processStatus;
              lastIndex = 4;
            }
          } else if (this.getReviewFirstState(last)) {
            const processStatus = this.getProcessStatus(reviewFirstState);
            if (processStatus === 'finish') {
              this.verifyStepIndex = 3;
              this.verifyStepStatus = 'process';
              lastIndex = this.verifyStepIndex;
            } else if (processStatus === 'error') {
              this.verifyStepIndex = 2;
              this.verifyStepStatus = processStatus;
              lastIndex = 3;
            }
          }

          this.verifyStepState = [
            ...this.setReviewStepLog(
              initState,
              reviewState,
              reviewFirstState,
              reviewSecondState,
              reviewThirdState,
              lastIndex
            )
          ];

          this.verifyLogs = state;
        }
      }
    });
  }

  get baseInfo() {
    if (_.isEmpty(this.bundleInfo)) return [];
    return [
      {
        label: '商品组ID：',
        text: this.id
      },
      {
        label: '商户ID：',
        text: this.bundleInfo.dealer_id
      },
      {
        label: '视觉ID：',
        text: this.bundleInfo.vision_id
      },
      {
        label: '商品组名称：',
        text: this.bundleInfo.name
      },
      {
        label: '商户名称：',
        text: this.bundleInfo.dealer_info
          ? this.bundleInfo.dealer_info.name
          : ''
      },
      {
        label: '柜体名称：',
        text: this.getCabinetTypeNames(this.bundleInfo)
      },
      {
        label: '提交时间：',
        text: fmt.formatDate(this.bundleInfo.create_time)
      }
    ];
  }

  getCabinetTypeNames(bundleInfo: any) {
    let names = '';
    bundleInfo.cabinet_types.forEach((type: any) => {
      names += ' ' + type.name;
    });
    return names;
  }

  get bundle() {
    if (_.isEmpty(this.bundleInfo)) return [];
    return [
      {
        label: '审核状态：',
        text: getSkuBundleReviewedStatusFilter(this.bundleInfo.status)
      },
      {
        label: '审核人：',
        text: this.bundleInfo.reviewer_email || this.bundleInfo.reviewer_id
      },
      {
        label: '审核时间：',
        text: fmt.formatDate(this.bundleInfo.reviewed_at)
      },
      {
        label: '审核备注：',
        text: this.bundleInfo.review_comment
      }
    ];
  }
}
</script>

<style scoped lang="less">
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
.p-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
