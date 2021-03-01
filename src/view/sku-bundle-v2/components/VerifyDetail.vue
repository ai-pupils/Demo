<template lang="pug">
  .page-content
    .toolbar
      GoBackBtn
      Card
        h6.mb10(slot="title") 审核商品组
          span （商户ID：{{dealer_id}}
          span.ml10 柜体：{{cabinet_type_name}}）
          Button.fr(@click="verifyHandler", type="primary") 提交审核结果
        VerifyStep(style="margin-top: 40px;",
          :state="verifyStepState", :active="verifyStepIndex", :process-status="verifyStepStatus")
        Row.info-title 已选互斥商品
          span.ml5.tips *默认展示自动审核结果
        Row
          Button.fr(@click="removeConflicts", type="primary") 解除互斥
        ConflictSkus(:bundleSkus="cloneSkus", :bundleId="id", ref="conflictSku")
        Divider
        //- Row.info-title 其余商品列表
        Row.info-title 商品列表
        div.mb20
          span 分类：
          RadioGroup(v-model="sortType", type="button")
            Radio(label="all") 全部
            Radio(label="packageType") 按包装类型
        div.mb20
          span 筛选：
          RadioGroup(v-model="viewType", type="button")
            Radio(label="commonView") 查看示例图
            Radio(label="topView") 查看顶视图
          Button.ml10.fr(@click="addConflictsHandler", type="error") 标记为互斥商品
          Button.fr(@click="comparedHandler", type="info") 高清图对比
        SkuBundleVerifyCard(:bundleSkus="skus", :viewType="viewType", :sortType="sortType", ref="verifyCard",
        :visionId="bundleInfo.vision_id")
        Row.info-title 审核日志
        VerifyLogTable(:logs="verifyLogs")
        AppearancesComparedModal(ref="comparedModal")
        VerifyModal(ref="verifyModal", :id="id", :logs="logs")
</template>

<script lang="ts">
import _ from 'lodash';
import Component, { mixins } from 'vue-class-component';
import LoadPageMixin, { LoadPageMixinInstance } from '@/mixins/loadPage';
import { DefaultApiType, MetaType } from '@/interface';
import { getBundleSkus$, getSkuBundlesV2$ } from '@/api/sku-bundle';
import { Prop, Watch } from 'vue-property-decorator';
import SkuBundleVerifyCard from './SkuBundleVerifyCard.vue';
import ConflictSkus from './ConflictSkus.vue';
import AppearancesComparedModal from './AppearancesComparedModal.vue';
import VerifyModal from './VerifyModal.vue';
import VerifyStep from '@/view/sku-bundle-v2/components/VerifyStep.vue';
import { VerifyStepStateType } from '@/view/sku-bundle-v2/components/interface';
import { getBundleLogs$, GetBundleLogsData } from '@/api/v2/sku-bundle';
import VerifyMixin from '../VerifyMixin';
import VerifyLogTable from '@/view/sku-bundle-v2/components/VerifyLogTable.vue';
import { createEmptyTrackMeta } from '@/utils/misc';

@Component({
  components: {
    VerifyStep,
    SkuBundleVerifyCard,
    ConflictSkus,
    AppearancesComparedModal,
    VerifyModal,
    VerifyLogTable
  }
})
export default class VerifyDetail extends mixins(LoadPageMixin, VerifyMixin)
  implements LoadPageMixinInstance {
  @Prop({ type: String, default: 'waiting' }) currentTab!: string;
  @Prop() id!: number;
  dealer_id: any = '';
  cabinet_type_name: string = '';
  defaultApi: DefaultApiType = getBundleSkus$;
  defaultParams: any = {
    id: this.id
  };

  bundleInfo: any = {};
  sortType: string = 'all';
  viewType: string = 'commonView';
  verifyStepState: VerifyStepStateType[] = [];
  verifyStepIndex: number = 2;
  verifyStepStatus: string = 'process';
  verifyLogs: MetaType = createEmptyTrackMeta();
  logs: any = [];
  skus: any[] = [];
  cloneSkus: any[] = [];

  @Watch('state', { immediate: true })
  stateChanged(state: MetaType) {
    if (state.isFulfill) {
      const {
        payload: {
          data: { skus }
        }
      } = state;
      this.skus = skus;
      // 保留一份克隆数据，用于互斥和其余商品列表之前交互。
      this.cloneSkus = _.cloneDeep(this.skus);
    }
  }

  created() {
    const initStep = (verifyStepState: VerifyStepStateType[]): any[] => {
      this.verifyStepStatus = 'process';
      this.verifyStepIndex = 2;
      verifyStepState
        .filter((e, index) => index > 1)
        .forEach(e => {
          e.user = '';
          e.date = '';
        });
      return [...verifyStepState];
    };

    getBundleLogs$({ bundleId: this.id }).subscribe({
      next: state => {
        if (state.isFulfill) {
          this.verifyLogs = { ...state };
          const logs: GetBundleLogsData[] = _.reverse([
            ...state.payload!.data.results
          ]);
          const last = logs.slice(0, 1);
          const initState = this.getInitState(logs);
          const reviewState = this.getReviewState(logs);
          const reviewFirstState = this.getReviewFirstState(logs);
          const reviewSecondState = this.getReviewSecondState(logs);
          const reviewThirdState = this.getReviewThirdState(logs);

          this.logs = logs;

          if (this.getReviewThirdState(last)) {
            const processStatus = this.getProcessStatus(reviewThirdState);
            this.verifyStepIndex = 4;
            if (processStatus === 'error') {
              this.verifyStepState = initStep(this.verifyStepState);
            } else {
              this.verifyStepStatus = 'process';
            }
          } else if (this.getReviewSecondState(last)) {
            const processStatus = this.getProcessStatus(reviewSecondState);
            if (processStatus === 'finish') {
              this.verifyStepIndex = 4;
              this.verifyStepStatus = 'process';
            } else if (processStatus === 'error') {
              this.verifyStepState = initStep(this.verifyStepState);
            }
          } else if (this.getReviewFirstState(last)) {
            const processStatus = this.getProcessStatus(reviewFirstState);
            if (processStatus === 'finish') {
              this.verifyStepIndex = 3;
              this.verifyStepStatus = 'process';
            } else if (processStatus === 'error') {
              this.verifyStepState = initStep(this.verifyStepState);
            }
          }

          this.verifyStepState = [
            ...this.setReviewStepLog(
              initState,
              reviewState,
              reviewFirstState,
              reviewSecondState,
              reviewThirdState,
              this.verifyStepIndex
            )
          ];
        }
      }
    });

    getSkuBundlesV2$({ bundleId: this.id }).subscribe({
      next: state => {
        if (state.isFulfill) {
          const {
            payload: {
              data: { bundles }
            }
          } = state as any;
          if (bundles && bundles.length > 0) {
            this.dealer_id = bundles[0].dealer_id;
            this.bundleInfo = bundles[0];
            if (bundles[0].cabinet_types) {
              bundles[0].cabinet_types.forEach((type: any) => {
                this.cabinet_type_name += ' ' + type.name;
              });
            }
          }
        }
      }
    });
  }

  transformParams(params: any) {
    return {
      ...params,
      sortBy: 'create_time',
      sortDirection: 'desc'
    };
  }

  verifyHandler() {
    let step = 'FIRST';
    if (this.verifyStepIndex === 3) {
      step = 'SECOND';
    } else if (this.verifyStepIndex === 4) {
      step = 'THIRD';
    }
    const items = (this.$refs.conflictSku as any).getExclusiveItems();
    (this.$refs.verifyModal as VerifyModal).open(this.dealer_id, step, items);
  }

  comparedHandler() {
    const skus = (this.$refs
      .verifyCard as SkuBundleVerifyCard).getCheckedSkus();
    if (skus && skus.length > 1) {
      (this.$refs.comparedModal as AppearancesComparedModal).open(skus);
    } else {
      this.$Message.warning('请任意选择勾选2个及以上商品对比！');
    }
  }

  addConflictsHandler() {
    const verifyCard = this.$refs.verifyCard as any;
    const vals = verifyCard.getCheckedVals();
    const rawVals = _.cloneDeep(vals);
    if (rawVals && rawVals.length > 1) {
      // 加入互斥列表
      (this.$refs.conflictSku as any).addConflicts(rawVals);
      // 从商品列表删除加入互斥的商品
      this.skus = this.skus.filter((sku: any) => !rawVals.includes(sku.pucode));
      /// 解除商品列表的勾选状态
      (this.$refs.verifyCard as any).removeCheckedVals(rawVals);
    } else {
      this.$Message.warning('请勾选2个或2个以上互斥的商品！');
    }
  }

  removeConflicts() {
    const conflictSku = this.$refs.conflictSku as any;
    const vals = conflictSku.getCheckedVals();
    const rawVals = _.cloneDeep(vals);
    if (rawVals && rawVals.length > 1) {
      // 将商品加入商品列表
      const skus = this.cloneSkus.filter((sku: any) =>
        rawVals.includes(sku.pucode)
      );
      this.skus = _.concat(skus, this.skus);
      // 从互斥列表中删除
      conflictSku.removeConflicts(rawVals);
    } else {
      this.$Message.warning('请勾选2个或2个以上非互斥的商品！');
    }
  }
}
</script>

<style scoped>
.tips {
  color: red;
  font-size: 12px;
}
</style>
