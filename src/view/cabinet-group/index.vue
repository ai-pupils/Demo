<template lang="pug">
  .page-content
    Card
      h6(slot="title") 货柜组列表
      Form.search
        FormItem
          Input(v-model='searchSchema.query', placeholder='货柜组ID/货柜组名称/货柜组描述', style='width: 300px', clearable)
          Button.ml5(icon='ios-search', type='primary', :loading='isFetching', html-type="submit", @click.prevent='doSearch') 查询
          Button.fr(type='primary', @click="createNewCabinetGroup") 新建货柜组
      ListTable(:state='state')
      PaginationBox(:total='dataTotal', :isFetching='state.isFetching')
</template>

<script lang="ts">
import Component, { mixins } from 'vue-class-component';
import ListTable from '@/view/cabinet-group/components/ListTable.vue';
import LoadPageMixin, { LoadPageMixinInstance } from '@/mixins/loadPage';
import SearchMixin, { SearchMixinInstance } from '@/mixins/search';
import { DefaultApiType } from '@/interface';
import PaginationBox from '@/components/shared/PaginationBox.vue';
import {
  getCabinetGroups$,
  GetCabinetGroupsParams
} from "@/api/v2/cabinet-group";

@Component({
  components: { ListTable, PaginationBox }
})
export default class App extends mixins(SearchMixin, LoadPageMixin)
  implements SearchMixinInstance, LoadPageMixinInstance {
  searchSchema: any = {
    query: undefined,
    packageType: undefined,
    skuType: undefined
  };
  defaultApi: DefaultApiType = getCabinetGroups$;
  defaultParams: GetCabinetGroupsParams = {
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
  createNewCabinetGroup() {
    this.$router.push({ name: 'cabinet-group-create' });
  }
}
</script>
