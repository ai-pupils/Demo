<template lang="pug">
  .mb20
    Row(:gutter="20", align="middle", justify="center")
      CheckboxGroup(v-model="checkedVals", @on-change="checkedValsChanged")
        Col(:span="spanNum", :md="24", :lg="12", :xl="8", :xxl="5", v-for="sku in conflictSkus", :key="sku.id")
          Checkbox.fl(v-if="showCheckBox", :label="sku.pucode") {{''}}
          Card.ml20.mb20
            div.mb10
              lazy-load-image(:src="sku.url", height="120px", link)
              div(:class="`triangle-topright-${sku.confictColor.type}`", 
                :style="{'border-top': `60px solid ${sku.confictColor.bg}!important`}")
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
import LoadPageMixin, { LoadPageMixinInstance } from '@/mixins/loadPage';
import { DefaultApiType } from '@/interface';
import { getBundleReviewedResults$ } from '@/api/v2/sku-bundle';
import { Mutation, Getter } from 'vuex-class';
import { of } from 'rxjs';

@Component({
  components: { LazyloadImg, AppearancesComparedModal, LazyLoadImage }
})
export default class ConflictSkus extends LoadPageMixin
  implements LoadPageMixinInstance {
  @Prop() bundleSkus!: any[];
  @Prop() bundleId!: number;
  @Prop({ type: Number, default: 4 }) spanNum!: number;
  @Prop({ type: Boolean, default: true }) showCheckBox!: boolean;
  @Prop() visionId!: string;
  @Getter('skuBundle/conflictColor') conflictColor!: any;
  @Mutation('skuBundle/colorMoveToEnd') changeColor!: any;
  // TODO: get conflict skus list // 没有API
  defaultApi: DefaultApiType = () => of(true);
  defaultParams: any = {
    id: this.bundleId
  };
  skus: any = [];
  exclusive_items: string[][] = [];
  conflictSkus: any = [];
  checkedVals: Array<string> = [];
  checkedValsClone: Array<string> = [];

  transformParams(params: any) {
    return params;
  }

  @Watch('bundleSkus', { immediate: true })
  skusChanged(skus: any[]) {
    this.skus = skus;
  }

  checkedValsChanged(vals: string[]) {
    const d = this.getRawCheckVal(vals);
    this.exclusive_items.forEach((items: any, index: number) => {
      const inItems = items.includes(d.diff);
      if (inItems) {
        if (d.add) {
          items.forEach((item: any) => {
            this.checkedVals.push(item);
          });
        } else {
          items.forEach((item: any) => {
            this.checkedVals.splice(
              this.checkedVals.findIndex(val => val === item)
            );
          });
        }
      }
    });
    // checkBox值改变时，无法获取到改变前的值，故保存备份
    this.checkedValsClone = vals;
  }

  getRawCheckVal(vals: any) {
    let diff = [];
    // 新增
    if (vals.length > this.checkedValsClone.length) {
      diff = _.difference(vals, this.checkedValsClone);
    }
    // 减少
    else {
      diff = _.difference(this.checkedValsClone, vals);
    }
    return { diff: diff[0], add: vals.length > this.checkedValsClone.length };
  }

  getExclusiveItems() {
    return this.exclusive_items;
  }

  tagClass(type: string) {
    return {
      background: getSkuPackageTypeColors(type),
      color: '#fff!important'
    };
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

  addConflicts(items: string[]) {
    this.exclusive_items.push(items);
    let confictColor = this.conflictColor;
    // 改变颜色
    this.changeColor();
    items.forEach((pucode: string) => {
      const confictSku = _.find(this.skus, ['pucode', pucode]);
      const InConflictSkus = _.find(this.conflictSkus, ['pucode', pucode]);
      if (confictSku && !InConflictSkus) {
        confictSku.confictColor = confictColor;
        this.conflictSkus.push(confictSku);
      }
    });
  }

  removeConflicts(vals: string[]) {
    vals.forEach((val: string) => {
      this.exclusive_items.forEach((items: any, index: number) => {
        const inItems = items.includes(val);
        if (inItems) {
          items.forEach((item: any) => {
            const index = _.findIndex(this.conflictSkus, ['pucode', item]);
            if (index > -1) {
              this.conflictSkus.splice(index, 1);
            }
            // 解除互斥列表的选中状态
            this.checkedVals.splice(this.checkedVals.findIndex(c => c === val));
          });
          // 从互斥列表中解除
          this.exclusive_items.splice(index, 1);
        }
      });
    });
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
.triangle-topright {
  width: 0;
  height: 0;
  border-top: 60px solid #2d8cf0;
  border-left: 60px solid transparent;
  position: absolute;
  top: 0;
  right: 0;
}

.triangle-topright-w {
  width: 0;
  height: 0;
  border-top: 60px solid #2d8cf0;
  border-left: 60px solid transparent;
  position: absolute;
  top: 0;
  right: 0;
}

.triangle-topright-b {
  width: 0;
  height: 0;
  border-top: 60px solid #2d8cf0;
  border-left: 60px solid transparent;
  position: absolute;
  top: 0;
  right: 0;
}

.triangle-topright:after {
  display: block;
  content: '互斥';
  border-width: 8px 8px 8px 8px;
  color: #d9dee4;
  /* 定位 */
  position: absolute;
  left: -35px;
  top: -55px;
}

.triangle-topright-w:after {
  display: block;
  content: '互斥';
  border-width: 8px 8px 8px 8px;
  color: #d9dee4;
  /* 定位 */
  position: absolute;
  left: -35px;
  top: -55px;
}

.triangle-topright-b:after {
  display: block;
  content: '互斥';
  border-width: 8px 8px 8px 8px;
  color: #000000;
  /* 定位 */
  position: absolute;
  left: -35px;
  top: -55px;
}
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
