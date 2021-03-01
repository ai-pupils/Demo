<template lang="pug">
  .page-content
    Card
      h6(slot="title") 商品组列表
      Form.search
        FormItem
          Input(v-model='searchSchema.keyword', placeholder='商品组ID/商品组名称/商品组描述', style='width: 300px', clearable)
          Button.ml5(icon='ios-search', type='primary', :loading='isFetching', html-type="submit", @click.prevent='doSearch') 查询
          Button.fr(type='primary', @click="createNewSkuBundle") 新建商品组
      ListTable(:state='state')
      PaginationBox(:total='dataTotal', :isFetching='state.isFetching')
</template>

<script lang="ts">
import Component, { mixins } from 'vue-class-component';
import ListTable from './components/ListTable.vue';
import LoadPageMixin, { LoadPageMixinInstance } from '@/mixins/loadPage';
import SearchMixin, { SearchMixinInstance } from '@/mixins/search';
import { DefaultApiType } from '@/interface';
import { getSkuBundlesV2$ } from '@/api/sku-bundle';
import PaginationBox from '@/components/shared/PaginationBox.vue';

@Component({
  components: { ListTable, PaginationBox }
})
export default class SkuBundleList extends mixins(SearchMixin, LoadPageMixin)
  implements SearchMixinInstance, LoadPageMixinInstance {
  searchSchema: any = {
    keyword: undefined,
    packageType: undefined,
    skuType: undefined
  };
  defaultApi: DefaultApiType = getSkuBundlesV2$;
  defaultParams: any = {
    pageIndex: 1,
    pageSize: Number(process.env.PAGE_SIZE)
  };
  transformParams(params: any) {
    return {
      ...params,
      sortBy: 'create_time',
      sortDirection: 'desc'
    };
  }
  createNewSkuBundle() {
    this.$router.push({ name: 'v2-sku-bundle-create' });
  }
}
</script>
