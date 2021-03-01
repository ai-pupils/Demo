<template lang="pug">
  section
    Card(title="查找相似商品")
      Spin(size='large' fix v-if='isFetching')
      Form.search(:label-width="65")
        FormItem(label="包装类型:")
          RadioGroup(v-model="searchSchema.packageType" placeholder="请选择包装类型")
            Radio(v-for="(package_type, index) in SkuPackageTypes"
            :key="package_type.id" :label="package_type.id"
            :disabled="isFetching") {{package_type.label}}
        FormItem(label="商品类型:")
          RadioGroup(v-model="searchSchema.skuType" placeholder="请选择包装类型")
            Radio(v-for="(sku_type, index) in SkuTypes"
            :key="sku_type.id" :label="sku_type.id"
            :disabled="isFetching") {{sku_type.label}}
      Form(inline, :label-width="65", label-position="left")
        FormItem(label="商品名称:")
          Input.input-style(v-model="searchSchema.keyword", placeholder="商品ID/包装ID/商品名称/商标")
        FormItem(label="商品条码:")
          Input.input-style.ml5(v-model="searchSchema.barcode", placeholder="商品条码")
          Button.ml5(type="primary", @click="doSearch") 搜索
      SkusCardList(:skus="skus")
</template>


<script lang="ts">
import _ from 'lodash';
import Component, { mixins } from 'vue-class-component';
import {createEmptyTrackMeta} from '@/utils/misc';
import SearchMixin, { SearchMixinInstance } from '@/mixins/search';
import { DefaultApiType, DefaultDataResponse } from '@/interface';
import LoadPageMixin, { LoadPageMixinInstance } from '@/mixins/loadPage';
import { getSkus$, GetSkusData, GetSkusParams, ProposalData } from '@/api/sku';
import { Prop } from 'vue-property-decorator';
import ComponentOptionsMixin from '@/mixins/componentOptions';
import { SkuPackageTypes, SkuTypes } from '@/const/data/sku';
import SkusCardList from '@/view/sku-v2/verify/components/SkusCardList.vue';

@Component({
  components: { SkusCardList }
})
export default class SearchSimilarProposal
  extends mixins<
    SearchMixin,
    ComponentOptionsMixin<DefaultDataResponse<GetSkusData>>
  >(SearchMixin, LoadPageMixin)
  implements SearchMixinInstance, LoadPageMixinInstance {
  proposalInfo: any = createEmptyTrackMeta();
  routeAction: any = 'replace';
  defaultApi: DefaultApiType = getSkus$;
  defaultParams: GetSkusParams = {
    keyword: this.proposalInfo.sku_name,
    barcode: this.proposalInfo.barcodes,
    packageType: this.proposalInfo.package_type,
    skuType: this.proposalInfo.sku_type,
    pageIndex: 1,
    pageSize: 20
  };
  searchSchema: any = {
    keyword: this.proposalInfo.sku_name,
    barcode: this.proposalInfo.barcodes,
    packageType: this.proposalInfo.package_type,
    skuType: this.proposalInfo.sku_type
  };
  SkuPackageTypes: any = [...SkuPackageTypes];
  SkuTypes: any = [...SkuTypes];

  created() {
    const { keyword, barcode, packageType, skuType } = this.$route.query as any;
    if (!_.isNil(keyword)) {
      this.searchSchema.keyword = keyword;
    }
    if (!_.isNil(barcode)) {
      this.searchSchema.barcode = barcode;
    }
    if (packageType === '') {
      this.searchSchema.packageType = '';
    }
    if (skuType === '') {
      this.searchSchema.skuType = '';
    }
    this.SkuPackageTypes.unshift({ label: '全部', id: '' });
    this.SkuTypes.unshift({ label: '全部', id: '' });
  }

  transformParams(params: any) {
    if (!params.skuType) {
      params.skuType = undefined;
    }
    if (!params.packageType) {
      params.packageType = undefined;
    }
    return params;
  }

  transformSearchParams(params: any) {
    delete params.pageIndex;
    delete params.pageSize;
    return params;
  }

  get skus() {
    if (this.state.isFulfill) {
      return this.state.payload!.data.skus;
    }
    return [];
  }
}
</script>

<style lang="scss">
.input-style {
  width: 250px;
}
</style>
