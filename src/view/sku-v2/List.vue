<template lang="pug">
  .page-content
    Card
      h6(slot="title") 商品列表
      Form.search
        FormItem
          Input(v-model='searchSchema.keyword', placeholder='商品ID/商品名称/商品条码/商标品牌', style='width: 300px')
          Select.ml5(v-model='searchSchema.ingressionType', placeholder='采集类型', style='width: 200px', filterable, clearable)
            Option(v-for='item in ingressionTypes', :value='item.id', :key='item.id') {{ item.name }}
          Select.ml5(v-model='searchSchema.visionType', placeholder='视觉类型', style='width: 200px', filterable, clearable)
            Option(v-for='item in visionTypes', :value='item.id', :key='item.id') {{ item.name }}
          Button.ml5(icon='ios-search', type='primary', :loading='isFetching', html-type="submit", @click.prevent='doSearch') 查询
          <!--          Button.fr(type='primary', @click="createNewSku") 新建商品及包装-->
      ListTable(:state='state')
      PaginationBox(:total='dataTotal', :isFetching='state.isFetching')
</template>

<script lang="ts">
import Component, { mixins } from 'vue-class-component';
import ListTable from './components/ListTable.vue';
import LoadPageMixin, { LoadPageMixinInstance } from '@/mixins/loadPage';
import SearchMixin, { SearchMixinInstance } from '@/mixins/search';
import { DefaultApiType } from '@/interface';
import { getSkus$ } from '@/api/sku';
import PaginationBox from '@/components/shared/PaginationBox.vue';
import { getSkuIngressionTypes$ } from '@/api/v2/skus';
import _ from 'lodash';

@Component({
  components: { ListTable, PaginationBox }
})
export default class SkuList extends mixins(SearchMixin, LoadPageMixin)
  implements SearchMixinInstance, LoadPageMixinInstance {
  defaultApi: DefaultApiType = getSkus$;
  defaultParams: any = {
    pageIndex: 1,
    pageSize: Number(process.env.PAGE_SIZE),
    sortBy: 'created_at',
    sortDirection: 'down'
  };
  searchSchema: any = {
    keyword: undefined,
    ingressionType: undefined,
    visionType: undefined
  };
  ingressionTypes: any[] = [];
  visionTypes: any[] = [];

  mounted() {
    this.getSkuIngressionTypes();
  }

  getSkuIngressionTypes() {
    getSkuIngressionTypes$().subscribe((state: any) => {
      if (state.isFulfill) {
        const {
          payload: {
            data: { ingression_types }
          }
        } = state;
        this.ingressionTypes = ingression_types;
        ingression_types.forEach(
          (type: any) => {
            this.visionTypes = _.concat(this.visionTypes, type.vision_types)
          }
        );
      }
    });
  }

  transformParams(params: any) {
    return params;
  }

  createNewSku() {
    this.$router.push({ name: 'v2-sku-create' });
  }
}
</script>
