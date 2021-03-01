<template lang="pug">
  section
    GoBack
    Card.mb20
      Spin(size='large' fix v-if='!proposalInfo')
      h6.clearfix.mb10(slot='title', style='line-height: 30px')
        span 商品包装({{`商品ID: ${skuId}, 商品名称: ${skuName}`}})
        div(style='float: right;')
          Button(:disabled="!isInitialized", @click="openModal", :loading="deleteLoading") 废弃当前数据
          Button.ml5(:disabled="!isInitialized", type="primary", @click="goCreateAppearance") 新建包装
      .text-center.bold.mb20 当前商品所有角度高清图
      Row(v-if="proposalInfo", :gutter="15")
        Col(span="4")
          HDImageThumb(title="前视图", :src="proposalInfo.front_url")
        Col(span="4")
          HDImageThumb(title="后视图", :src="proposalInfo.back_url")
        Col(span="4")
          HDImageThumb(title="左视图", :src="proposalInfo.left_url")
        Col(span="4")
          HDImageThumb(title="右视图", :src="proposalInfo.right_url")
        Col(span="4")
          HDImageThumb(title="顶视图", :src="proposalInfo.top_url")
        Col(span="4")
          HDImageThumb(title="底视图", :src="proposalInfo.bottom_url")
    AppearancesCardList(:skuId="skuId", :proposalInfo="proposalInfo")
    VerifyProposalModal(ref='VerifyProposalModal', :proposalInfo="proposalInfo", @ok="confirmHandle")
</template>


<script lang="ts">
import Component, { mixins } from 'vue-class-component';
import GoBack from '@/components/shared/GoBack.vue';
import { Prop } from 'vue-property-decorator';
import LoadPageMixin, { LoadPageMixinInstance } from '@/mixins/loadPage';
import { DefaultApiType, DefaultDataResponse } from '@/interface';
import {
  getSkuProposals$,
  GetSkuProposalsData,
  GetSkuProposalsParams,
  ProposalData
} from '@/api/sku';
import ComponentOptionsMixin from '@/mixins/componentOptions';
import HDImageThumb from '@/view/sku-v2/verify/components/HDImageThumb.vue';
import AppearancesCardList from '@/view/sku-v2/verify/components/AppearancesCardList.vue';
import VerifyProposalModal from '@/view/sku-v2/verify/components/VerifyProposalModal.vue';

@Component({
  components: { VerifyProposalModal, GoBack, HDImageThumb, AppearancesCardList }
})
export default class AppearancesDetail
  extends mixins<
    ComponentOptionsMixin<DefaultDataResponse<GetSkuProposalsData>>
  >(LoadPageMixin)
  implements LoadPageMixinInstance {
  @Prop() skuId!: string;
  @Prop() proposalId!: string;
  defaultApi: DefaultApiType = getSkuProposals$;
  defaultParams: GetSkuProposalsParams = {
    proposalId: Number(this.proposalId)
  };
  deleteLoading: boolean = false;
  skuName: string = '';
  visible: boolean = false;

  transformParams(params: any) {
    return params;
  }

  get proposalInfo(): ProposalData | undefined {
    if (this.state.isFulfill) {
      return this.state.payload!.data.sku_proposals[0];
    }
  }

  get isInitialized() {
    if (this.proposalInfo) {
      return this.proposalInfo.status === 'initialized';
    }
    return false;
  }

  created() {
    const { skuName }: any = this.$route.query as any;
    this.skuName = skuName;
  }

  confirmHandle() {
    this.deleteLoading = false;
    this.$router.go(-1);
  }

  goCreateAppearance() {
    this.$router.push({
      name: 'v2-sku-appearances-create',
      params: { skuId: this.skuId },
      query: { proposalId: this.proposalId }
    });
  }

  openModal() {
    const ref: VerifyProposalModal = this.$refs['VerifyProposalModal'] as VerifyProposalModal;
    ref.open();
  }
}
</script>
