<template lang="pug">
  .mb20
    Row(:gutter="20", align="middle", justify="center")
      CheckboxGroup(v-model="checkedVals")
        Col(:span="spanNum", :md="24", :lg="12", :xl="8", :xxl="5", v-for="sku in skus", :key="sku.id")
          Checkbox.fl(v-if="showCheckBox", :label="sku.pucode") {{''}}
          Card.ml20.mb20
            div.mb10
              lazy-load-image(v-if="isTopView && sku.appearances", height="120px",
                :src="sku.appearances[0].top_url", link)
              lazy-load-image(v-else, :src="sku.url", height="120px", link)
            div.mb5.clearfix
              span.fl {{sku.pucode | emptyText}}
              span.fr.fl.bold.sku-name {{sku.price | fmtPrice(1) | empty('')}}
            div.mb5.clearfix
              Tooltip(:content="sku.name", placement="top", style="width:100%")
                span(style="width:100%").fl.bold.ellipsis.sku-name {{sku.name | emptyText}}
            div.mb5.clearfix.ellipsis
              Tooltip.fl(:content="sku.trademark_zhCN || sku.trademark_enUS", placement="top", style="width: 60%")
                span(style="width: 100%").fl.ellipsis {{(sku.trademark_zhCN || sku.trademark_enUS) | emptyText}}
            div.mb5.clearfix.ellipsis
              Tooltip.fl(:content="sku.appearances[0].selected_barcode")
                span(style="width: 100%").fl.ellipsis {{sku.appearances[0].selected_barcode | emptyText}}
            div.mb10.clearfix.ellipsis
              Tag(color="primary", :style="tagClass(sku.package_type)")
                span {{sku.package_type | getSkuPackageTypes | emptyText}}
              a.fr.ml10(href="javascript:;", @click="showHDImages(sku)") 查看高清图>>
            div.mb5.clearfix
              span.fl {{sku.appearances.length}}个包装
              a.fr.ml10(href="javascript:;", @click="showIngressImages(sku)") 查看采集图片>>
    AppearancesComparedModal(ref="comparedModal")
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import LazyloadImg from '@/components/shared/LazyloadImg.vue';
import { MetaType } from '@/interface';
import AppearancesComparedModal from './AppearancesComparedModal.vue';
import _ from 'lodash';
import { getSkuPackageTypeColors } from '@/filters/statusType';
import LazyLoadImage from '@/components/shared/LazyLoadImage.vue';

@Component({
  components: { LazyloadImg, AppearancesComparedModal, LazyLoadImage }
})
export default class SkuBundleVerifyCard extends Vue {
  @Prop() state!: MetaType;
  @Prop() bundleSkus!: any[];
  @Prop({ type: String, default: 'commonView' }) viewType!: string;
  @Prop({ type: String, default: 'all' }) sortType!: string;
  @Prop({ type: Number, default: 4 }) spanNum!: number;
  @Prop({ type: Boolean, default: true }) showCheckBox!: boolean;
  @Prop() visionId!: string;

  skus: any = [];
  cloneSkus: any = [];
  checkedVals: Array<number> = [];

  @Watch('bundleSkus')
  skusChanged(skus: any[]) {
    this.skus = skus;
    this.cloneSkus = _.cloneDeep(skus);
  }

  tagClass(type: string) {
    return {
      background: getSkuPackageTypeColors(type),
      color: '#fff!important'
    };
  }

  getCheckedSkus() {
    if (this.checkedVals && this.checkedVals.length > 1) {
      const skus = this.skus.filter((sku: any) =>
        this.checkedVals.includes(sku.pucode)
      );
      if (skus && skus.length > 1) {
        return skus;
      }
    }
    return [];
  }

  getCheckedVals() {
    if (this.checkedVals && this.checkedVals.length > 1) {
      return this.checkedVals;
    }
    return [];
  }

  removeCheckedVals(vals: string[]) {
    vals.forEach((item: any) => {
      this.checkedVals.splice(this.checkedVals.findIndex(val => val === item));
    });
  }

  get isTopView() {
    return this.viewType === 'topView';
  }

  @Watch('sortType', { immediate: true })
  sortTypeChanged(val: string) {
    if (val === 'packageType') {
      this.skus = _.sortBy(this.skus, (sku: any) => {
        return sku.package_type;
      });
    } else {
      this.skus = this.cloneSkus;
    }
  }

  showHDImages(sku: any) {
    (this.$refs.comparedModal as AppearancesComparedModal).open([sku]);
  }

  showIngressImages(sku: any) {
    window.open(
      `/ingression_images?id=${sku.pucode}&vision_id=${this.visionId}`
    );
  }
}
</script>

<style scoped lang="scss">
.sku-name {
  font-size: 16px;
}
.ellipse-text {
  text-align: center;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  display: block;
}
</style>
