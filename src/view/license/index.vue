<template lang="pug">
  .page-content
    Card
      h6(slot='title') License监控
      Form.search
        FormItem.form-item
          Select(v-model="searchSchema.dealer_id", placeholder="请选择商户", style="width:150px", clearable)
            Option(v-for="item in dealer_list", :value="item.id", :key="item.id") {{ item.label }}
          Button.query-btn.ml5(type='primary', html-type='submit', :loading='state.isFetching', @click.prevent='doSearch', icon='ios-search') 查询
          Button.query-btn.ml5(type='primary', html-type='submit', @click.prevent='reSearch', icon='ios-refresh') 重置
      ListTable(:state='state', @sortChange="sortChange" :sort-change="sortChange" :default-sort="defaultSort")
      PaginationBox(:total='dataTotal', :isFetching='isFetching')
</template>


<script lang="ts">
import Component, { mixins } from 'vue-class-component';
import LoadPageMixin, { LoadPageMixinInstance } from '@/mixins/loadPage';
import SearchMixin, { SearchMixinInstance } from '@/mixins/search';
import ListTable from '@/view/license/components/ListTable.vue';
import PaginationBox from '@/components/shared/PaginationBox.vue';
import { DefaultApiType } from '@/interface';
import { getCustomers$ } from '@/api/v2/users';
import { getLicense$ } from '@/api/v3/license';

@Component({
  components: { ListTable, PaginationBox }
})
export default class DealerList extends mixins(SearchMixin, LoadPageMixin)
  implements LoadPageMixinInstance, SearchMixinInstance {
  defaultApi: DefaultApiType = getLicense$;
  defaultParams: any = {
    pageIndex: 1,
    pageSize: Number(process.env.PAGE_SIZE)
  };
  searchSchema: any = {
    ...this.defaultParams,
    dealer_id: undefined
  };
  defaultSort: any = {
    prop: 'id',
    order: 'ascending'
  };
  dealer_list: any[] = [];

  transformParams(params: any) {
    return params;
  }

  mounted() {
    this.getDealerList();
  }

  reSearch() {
    this.searchSchema.dealer_id = undefined;
    this.doSearch();
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
}
</script>

<style lang="less" scoped>
</style>
