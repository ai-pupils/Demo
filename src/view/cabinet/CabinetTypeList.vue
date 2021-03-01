<template lang="pug">
  .page-content
    Card
      h6(slot='title') 柜体列表
      Form.search
        FormItem
          Input(v-model='searchSchema.keyword', placeholder='柜体ID/柜体名称', style='width: 300px;margin-right: 5px;')
          Button(icon='ios-search', type='primary', html-type='submit', :loading='state.isFetching', @click.prevent='search') 查询
      CabinetTypeTable(:state='state')
      PaginationBox(:total='dataTotal', :isFetching='state.isFetching')
</template>

<script lang="ts">
  import Component, {mixins} from "vue-class-component";
  import LoadPageMixin, {
    LoadPageMixinInstance
  } from '@/mixins/loadPage';
  import SearchMixin, {SearchMixinInstance} from '@/mixins/search';
  import PaginationBox from '@/components/shared/PaginationBox.vue';
  import {getCabinetTypes$, GetCabinetTypesParams} from '@/api/cabinet';
  import CabinetTypeTable from './components/CabinetTypeTable.vue';

  @Component({
    components: {
      CabinetTypeTable,
      PaginationBox
    }
  })
  export default class CabinetTypeList extends mixins(LoadPageMixin, SearchMixin)
    implements LoadPageMixinInstance, SearchMixinInstance {
    keyword: string = '';
    defaultApi: any = getCabinetTypes$;
    defaultParams: GetCabinetTypesParams = {};

    search() {
      this.doSearch();
    }

    searchSchema: any = {
      ...this.defaultParams,
      keyword: ''
    };

    transformParams(params: GetCabinetTypesParams) {
      return params;
    }
  }
</script>
<style lang="scss" scoped>
</style>
