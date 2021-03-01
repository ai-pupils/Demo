<template lang="pug">
  .page-content
    Card
      h6(slot='title') 商户管理
      Form.search
        FormItem.form-item
          Select(v-model="searchSchema.customerType", placeholder="商户类型", style="width:150px", clearable)
            Option(v-for="type in customerTypeMap", :key="type.value", :value="type.value") {{type.value}}
          Input.ml5(v-model='searchSchema.keyword', placeholder='商户ID/商户名称/邮箱', style='width: 300px')
          Button.query-btn.ml5(type='primary', html-type='submit', :loading='state.isFetching', @click.prevent='doSearch', icon='ios-search') 查询
      ListTable(:state='state', @sortChange="sortChange" :sort-change="sortChange" :default-sort="defaultSort")
      PaginationBox(:total='dataTotal', :isFetching='isFetching')
</template>


<script lang="ts">
import Component, { mixins } from 'vue-class-component';
import LoadPageMixin, { LoadPageMixinInstance } from '@/mixins/loadPage';
import SearchMixin, { SearchMixinInstance } from '@/mixins/search';
import ListTable from '@/view/dealer/components/ListTable.vue';
import PaginationBox from '@/components/shared/PaginationBox.vue';
import { DefaultApiType } from '@/interface';
import { getCustomers$ } from '@/api/v2/users';

@Component({
  components: { ListTable, PaginationBox }
})
export default class DealerList extends mixins(SearchMixin, LoadPageMixin)
  implements LoadPageMixinInstance, SearchMixinInstance {
  defaultApi: DefaultApiType = getCustomers$;
  defaultParams: any = {
    pageIndex: 1,
    pageSize: Number(process.env.PAGE_SIZE)
  };
  searchSchema: any = {
    ...this.defaultParams,
    keyword: '',
    customerType: undefined
  };
  defaultSort: any = {
    prop: 'user_id',
    order: 'ascending'
  };
  customerTypeMap: any[] = [
    { value: 'dealer' },
    { value: 'agent' },
    { value: 'admin' },
    { value: 'integrator' }
  ];

  transformParams(params: any) {
    return params;
  }
}
</script>

<style lang="less" scoped>
</style>
