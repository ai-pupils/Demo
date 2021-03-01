<template lang="pug">
  section.mb20
    Card.ml20
      div(v-if="selection", slot="title")
        Checkbox(v-model="item.is_selected", :disabled="!item.barcode" @on-change="checkChange") 选中当前sku
      div.mb10
        lazy-load-image(:src="item.url", height="120px")
      div.mb5.clearfix
        Tooltip(:content="item.name", placement="top", style="width:100%")
          span(style="width:100%").fl.bold.ellipsis 商品名称:{{item.name | emptyText}}
      div.mb5.clearfix.ellipsis
        span.fl 商品ID: {{item.pucode | emptyText}}
      div.mb5.clearfix
        Tooltip.fl(:content="item.trademark_zhCN || item.trademark_enUS", placement="top", style="width: 60%")
          span(style="width: 120px").fl.ellipsis 商标: {{(item.trademark_zhCN || item.trademark_enUS) | emptyText}}
        Tag.fr(color="primary", :style="tagClass(item.package_type)")
          span {{item.package_type | getSkuPackageTypes | emptyText}}
      div.mb5
        span 商品条码:
        Select.ml5.barcode-select(v-if="isCanEdit", v-model="item.barcode", @on-change="selectedBarcode(item)")
          Option(v-for="barcode in item.barcodes", :value="barcode", :key="barcode") {{barcode}}
        span(v-else).ml5 {{item.appearances[0].selected_barcode | emptyText}}
      div.mb5.clearfix
        span 商品状态: {{ item.ingress_status === 'accepted' ? '可参与训练': '不可参与训练' }}
      div.mb5.clearfix
        router-link.fr(:to="{name: 'v2-sku-detail',params: { id: this.item.pucode }}", target="_blank")
          | 查看详情
    AppearancesComparedModal(ref="viewHDModal")
</template>

<script lang="ts">
import _ from 'lodash';
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import LazyloadImg from '@/components/shared/LazyloadImg.vue';
import HDImageThumb from '@/view/sku-v2/verify/components/HDImageThumb.vue';
import { Getter, Mutation } from 'vuex-class';
import { take } from 'rxjs/operators';
import AppearancesComparedModal from '@/view/sku-bundle-v2/components/AppearancesComparedModal.vue';
import LazyLoadImage from '@/components/shared/LazyLoadImage.vue';
import {getSkuPackageTypeColors} from "@/filters";

@Component({
  components: {
    LazyloadImg,
    HDImageThumb,
    AppearancesComparedModal,
    LazyLoadImage
  }
})
export default class SkuAppearancesCard extends Vue {
  @Getter('skuBundle/skus') selectedSkus!: any;
  @Mutation('skuBundle/setSkus') setSkus!: any;
  @Mutation('skuBundle/updateSkuBarcode') updateSkuBarcode!: any;
  @Prop() item!: any;
  @Prop() appearances!: any;
  @Prop({ default: false })
  selection!: boolean;
  @Prop({ default: false }) isCanEdit!: boolean;

  checkChange() {
    this.setSkus({ name: 'single', selections: [], row: { ...this.item } });
    this.$emit('itemSelected', this.item);
  }

  selectedBarcode(item: any){
    // 列表barcode改变时，更新store里sku的barcode
    this.updateSkuBarcode(item);
  }

  viewSkuAppearancesDetail(appearances: any) {
    this.$router.push({
      name: 'v2-sku-appearances-detail',
      params: { id: appearances.id }
    });
  }

  showHDImages(sku: any) {
    (this.$refs.viewHDModal as AppearancesComparedModal).open([sku]);
  }

  tagClass(type: string) {
    return {
      background: getSkuPackageTypeColors(type),
      color: '#fff!important'
    }
  }
}
</script>

<style lang="scss" scoped>
.skuappearances-card {
  .main-wrap {
    padding-right: 20px;
  }
}
.view-hd {
  position: absolute;
  bottom: 0;
  right: 0;
}
.card-content {
  min-height: 85px;
}
.img-contain {
  object-fit: contain;
  width: 100%;
  height: 100%;
}
.barcode-select {;
  width: 115px;
}
</style>
