<template lang="pug">
  .page-content
    Card
      h6(slot='title') 货柜列表
      Form.search
        FormItem
          Input(v-model='searchSchema.keyword', placeholder='货柜编号/货柜名称/货柜描述/商户ID/货柜ID/柜体名称/IMEI', style='width: 400px; margin-right: 5px;')
          Select(v-model='searchSchema.status', clearable, placeholder='货柜运营状态', style='width:250px; margin-right: 5px;')
            Option(v-for='item in CabinetStatusTypes', :value='item.id', :key='item.id') {{ item.label }}
          Select(v-model='searchSchema.runtimeStatus', clearable, placeholder='货柜运行状态', style='width:250px; margin-right: 5px;')
            Option(v-for='item in CabinetRuntimeStatusTypes', :value='item.id', :key='item.id') {{ item.label }}
          Button(icon='ios-search', type='primary', html-type='submit', :loading='state.isFetching', @click.prevent='search') 查询
      CabinetTable(:state='state', @refresh='refresh')
      PaginationBox(:total='dataTotal', :isFetching='state.isFetching')
</template>

<script lang="ts">
import Component, { mixins } from 'vue-class-component';
import LoadPageMixin, { LoadPageMixinInstance } from '@/mixins/loadPage';
import SearchMixin, { SearchMixinInstance } from '@/mixins/search';
import PaginationBox from '@/components/shared/PaginationBox.vue';
import {
  CabinetStatusTypes,
  CabinetRuntimeStatusTypes
} from '@/const/data/cabinet';
import { getCabinets$, GetCabinetParams } from '@/api/cabinet';
import CabinetTable from './components/CabinetTable.vue';
import { refreshCabinet$ } from '@/api/cabinet';

@Component({
  components: {
    CabinetTable,
    PaginationBox
  }
})
export default class CabinetList extends mixins(LoadPageMixin, SearchMixin)
  implements LoadPageMixinInstance, SearchMixinInstance {
  CabinetStatusTypes: any = CabinetStatusTypes;
  CabinetRuntimeStatusTypes: any = CabinetRuntimeStatusTypes;
  keyword: string = '';
  status: string = '';
  runtimeStatus: string = '';
  defaultApi: any = getCabinets$;
  defaultParams: GetCabinetParams = {
    pageIndex: 1,
    pageSize: Number(process.env.PAGE_SIZE)
  };

  mounted() {
    refreshCabinet$.subscribe(() => this.refresh());
  }

  refresh() {
    this.loadDefaultApi(this.searchSchema);
  }

  search() {
    this.doSearch();
  }

  searchSchema: any = {
    ...this.defaultParams,
    keyword: ''
    // status: '',
    // runtimeStatus: ''
  };

  transformParams(params: GetCabinetParams) {
    return params;
  }
}
</script>
<style lang="scss" scoped>
</style>
