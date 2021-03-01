<template lang="pug">
  .page-content
    Card
      h6(slot="title") 商品审核
      Select(v-model="searchSchema.dealer_id", placeholder="请选择商户ID", clearable, filterable, style="width: 200px")
        Option(v-for="(item,index) in dealer_list", :key="item.id", :value="item.id",
          :label="item.label")
      Button.ml5(icon='ios-search', type='primary', html-type='submit', :loading='state.isFetching', @click.prevent='doSearch') 查询
      ProposalTable(:state='state')
      PaginationBox(:total='dataTotal', :isFetching='state.isFetching')
</template>

<script lang="ts">
import Component, { mixins } from 'vue-class-component';
import LoadPageMixin, { LoadPageMixinInstance } from '@/mixins/loadPage';
import { DefaultApiType } from '@/interface';
import { getSkuProposals$ } from '@/api/sku';
import PaginationBox from '@/components/shared/PaginationBox.vue';
import ProposalTable from '@/view/sku-v2/verify/components/ProposalTable.vue';
import { getCustomers$ } from '@/api/v2/users';
import SearchMixin, { SearchMixinInstance } from '@/mixins/search';

@Component({
  components: { ProposalTable, PaginationBox }
})
export default class Proposals extends mixins(LoadPageMixin, SearchMixin)
  implements LoadPageMixinInstance, SearchMixinInstance {
  defaultApi: DefaultApiType = getSkuProposals$;
  defaultParams: any = {
    pageIndex: 1,
    pageSize: Number(process.env.PAGE_SIZE),
    status: 'initialized'
  };
  searchSchema: any = {
    ...this.defaultParams,
    dealer_id: undefined
  };
  dealer_list = [];

  transformParams(params: any) {
    return params;
  }

  mounted() {
    this.getDealerList();
  }

  getDealerList() {
    getCustomers$({ pageIndex: 1, pageSize: 99999 }).subscribe(state => {
      if (state.isFulfill) {
        const {
          payload: {
            data: { results }
          }
        } = state as any;
        this.dealer_list = results.map((r: any) => {
          return {
            id: r.user_id.toString(),
            name: r.name,
            // note: select列表必须转成字符串，否则有bug
            label: r.name ? r.user_id + ' - ' + r.name : r.user_id.toString()
          };
        });
      }
    });
  }

  createNewSku() {
    this.$router.push({ name: '' });
  }
}
</script>
