<template lang="pug">
  section
    GoBack
    ProposalInfo.mb20(:proposalInfo="proposalInfo")
    SearchSimilarProposal
</template>


<script lang="ts">
import Component, { mixins } from 'vue-class-component';
import LoadPageMixin, { LoadPageMixinInstance } from '@/mixins/loadPage';
import { DefaultApiType, DefaultDataResponse } from '@/interface';
import {
  getSkuProposals$,
  GetSkuProposalsData,
  GetSkuProposalsParams
} from '@/api/sku';
import { Prop, Provide } from 'vue-property-decorator';
import ComponentOptionsMixin from '@/mixins/componentOptions';
import ProposalInfo from '@/view/sku-v2/verify/components/ProposalInfo.vue';
import SearchSimilarProposal from '@/view/sku-v2/verify/components/SearchSimilarProposal.vue';
import GoBack from '@/components/shared/GoBack.vue';

@Component({
  components: { SearchSimilarProposal, ProposalInfo, GoBack }
})
export default class ProposalDetail
  extends mixins<
    ComponentOptionsMixin<DefaultDataResponse<GetSkuProposalsData>>
  >(LoadPageMixin)
  implements LoadPageMixinInstance {
  @Prop() id!: string;
  @Provide('getProposalId')
  getProposalId() {
    return this.id;
  }
  defaultApi: DefaultApiType = getSkuProposals$;
  defaultParams: GetSkuProposalsParams = {
    proposalId: Number(this.id)
  };
  fetchOnce: boolean = true;

  transformParams(params: any) {
    return {
      proposalId: Number(this.id)
    };
  }

  get proposalInfo() {
    if (this.state.isFulfill) {
      return this.state.payload!.data.sku_proposals[0];
    }
  }
}
</script>
