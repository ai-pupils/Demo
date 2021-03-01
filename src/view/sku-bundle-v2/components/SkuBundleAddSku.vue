<template lang="pug">
  .page-content
    Card(:bordered="false", dis-hover)
      h6.clearfix(slot="title", style="line-height:30px")
        | {{`${skuCountLabel}，  ${appearancesCountLabel}`}}
        Button.fr.ml5(:disabled="allSkuCount === 0", type="primary",
          @click="confirm", :loading="isFetching", v-if="isCanEdit") 确认
        Button.fr(v-if="isTypeClone || isTypeCreate", @click="preStepHandle") 上一步
      Form(v-if="isCanEdit").search
        FormItem
          Input(v-model='searchSchema.keyword', placeholder='商品ID/包装ID/商品名称/商标/商品条码', style='width: 300px', clearable)
          Select.ml5(v-model='searchSchema.packageType', placeholder='包装类型', style='width: 100px', filterable, clearable)
            Option(v-for='item in SkuPackageTypes', :value='item.id', :key='item.id') {{ item.label }}
          Select.ml5(v-model='searchSchema.skuType', placeholder='商品类型', style='width: 100px', filterable, clearable)
            Option(v-for='item in SkuTypes', :value='item.id', :key='item.id') {{ item.label }}
          Button.ml5(icon='ios-search', type='primary', :loading='isFetching', @click.prevent='search') 查询
          Button.ml5(@click="reselect", :loading="isFetching") 重新选择
      Alert(show-icon type="warning" v-if="dataTotal === 0 && isFulfill && isTypeCreate") 暂无可用商品
      Row
        fly-ball(ref="flyBall")
        Row(:gutter="20", align="middle", justify="center")
          Col(:span="4", :xs="24", :sm="12", :md="8", :lg="8", :xl="6", :xxl="4", v-for="sku in skus", :key="sku.id")
            SkuAppearancesCard(:item="sku", :selection="isCanEdit", :key="sku.id", @itemSelected="itemSelected", :is-can-edit="isCanEdit")
    SkuBundleConfirmModal(ref="SkuBundleConfirmModal", @saveBundles="saveBundles",
      :skuCount="allSkuCount", :appearancesCount="allSkuAppearancesCount",
      @submitBundles="submitBundles", :isTypeCreate="isTypeCreate"
    )
    .targetEle(v-if="!isFetching && isCanEdit", @click="confirm")
      Badge(:count="allSkuCount")
        img(src="~@/assets/img/shopping-cart.svg", style="height:80px;width:80px")
    PaginationInnerBox(ref="PaginationInnerBox", :total="dataTotal", :isFetching="isFetching", @pageChange="pageChange",
      :pageSizeParams="defaultParams.pageSize", @sizeChange="pageChange")
</template>

<script lang="ts">
import Component, { mixins } from 'vue-class-component';
import LoadPageMixin, { LoadPageMixinInstance } from '@/mixins/loadPage';
import { DefaultApiType, MetaType } from '@/interface';
import { SkuPackageTypes, SkuTypes } from '@/const/data/sku';
import SearchMixin, { SearchMixinInstance } from '@/mixins/search';
import SkuAppearancesCard from '@/view/common/SkuAppearancesCard.vue';
import PaginationInnerBox from '@/components/shared/PaginationInnerBox.vue';
import SkuBundleConfirmModal from '@/view/sku-bundle-v2/components/SkuBundleConfirmModal.vue';
import _ from 'lodash';
import { Getter, Mutation } from 'vuex-class';
import { Prop, Watch } from 'vue-property-decorator';
import {
  getBundleSkus$,
  getSkuBundlesV2$
} from '@/api/sku-bundle';
import { map, observeOn, take } from 'rxjs/operators';
import FlyBall from '@/components/shared/FlyBall.vue';
import { asyncScheduler, of } from 'rxjs';
import { createEmptyTrackMeta } from '@/utils/misc';
import { getSkus$, getSkusBundles$ } from '@/api/sku';

@Component({
  components: {
    SkuBundleConfirmModal,
    PaginationInnerBox,
    SkuAppearancesCard,
    FlyBall
  }
})
export default class SkuBundleAddSku extends mixins(SearchMixin, LoadPageMixin)
  implements SearchMixinInstance, LoadPageMixinInstance {
  @Prop() type!: string;
  @Prop() skuBundleId!: string;
  @Getter('skuBundle/skus') selectedSkus!: any[];
  @Mutation('skuBundle/clearSkus') clearSkus!: () => void;
  @Mutation('skuBundle/setSkus') setSkus!: any;

  bundleStatus: any = '';
  visionId: any = undefined;
  internalSearch: boolean = true;
  beforeDefaultApi() {
    if (this.skuBundleId) {
      return getSkuBundlesV2$({
        bundleId: this.skuBundleId
      }).pipe(
        map((state: any) => {
          const bundle = (state.payload!.data as any).bundles[0];
          this.bundleStatus = bundle.status;
          return state;
        })
      );
    } else {
      return of(null);
    }
  }
  defaultApi() {
    if (this.isCanEdit) {
      const { visionId } = this.$route.query;
      this.visionId = visionId;
      return getSkusBundles$({
        ...this.defaultParams,
        ...this.searchSchema,
        visionId: this.visionId,
        bundleId: this.skuBundleId
      });
    } else {
      return this.emptyState;
    }
  }
  defaultParams: any = {
    pageIndex: 1,
    pageSize: 12,
    visionId: this.visionId
  };
  searchSchema: any = {
    keyword: undefined,
    packageType: undefined,
    skuType: undefined
  };
  SkuTypes: any = SkuTypes;
  SkuPackageTypes: any = SkuPackageTypes;
  submitLoading: boolean = false;
  bundleSkus: any[] = [];

  itemImg: string = '';

  transformParams(params: any) {
    return {
      ...params,
      visionId: this.visionId
    };
  }

  // 列表sku选中时添加动画
  itemSelected(item: any) {
    this.itemImg = item.sku_url;
    let clickedNode: any = {
      tagName: 'INPUT',
      className: 'ivu-checkbox-input'
    };
    if (item.is_selected) {
      (this.$refs.flyBall as FlyBall).click2Show(clickedNode, item.url);
    }
  }

  get emptyState() {
    return of<MetaType>(createEmptyTrackMeta()).pipe(
      observeOn(asyncScheduler),
      map((state: any) => {
        state.isFulfill = true;
        state.isFetching = false;
        state.payload = { data: { count: 0, skus: [] } };
        return state;
      })
    );
  }

  // 获取所有商品
  get skus() {
    if (this.isFulfill) {
      if (this.isCanEdit) {
        return this.state.payload!.data.results.map((e: any) => {
          this.$set(e, 'is_selected', false);
          this.$set(e, 'barcode', e.barcode);
          // 使用store里的sku信息，更新外部列表信息
          const sku = _.find(this.selectedSkus, ['id', e.id]);
          if (sku) {
            e.is_selected = true;
            e.barcode = sku.barcode;
          }
          return e;
        });
      }
      // 如果商品组不可编辑，则直接返回当前商品组内的商品
      else {
        return this.bundleSkus;
      }
    }

    return [];
  }

  get allSkuCount() {
    if (this.isCanEdit) {
      return this.selectedSkus.length || 0;
    }
    return this.bundleSkus.length || 0;
  }

  get allSkuAppearancesCount() {
    if (this.isCanEdit) {
      return this.selectedSkus.reduce<number>(
        (pre, cur: any) =>
          pre + (cur.appearance_count || cur.appearances.length),
        0
      );
    }
    return this.bundleSkus.reduce<number>(
      (pre, cur: any) => pre + (cur.appearance_count || cur.appearances.length),
      0
    );
  }

  get skuCountLabel() {
    if (this.isCanEdit) {
      return '已添加商品数：' + this.allSkuCount;
    } else {
      return '商品数：' + this.allSkuCount;
    }
  }

  get appearancesCountLabel() {
    if (this.isCanEdit) {
      return '已添加包装数：' + this.allSkuAppearancesCount;
    } else {
      return '包装数：' + this.allSkuAppearancesCount;
    }
  }

  get isCanEdit() {
    return (
      this.isTypeCreate ||
      this.isTypeEdit ||
      this.isTypeClone ||
      this.bundleStatus === 'initialized' ||
      this.bundleStatus === 'refused'
    );
  }

  get isTypeClone() {
    return this.type === 'clone';
  }

  get isTypeEdit() {
    return this.type === 'edit';
  }

  get isTypeCreate() {
    return !this.skuBundleId;
  }

  async created() {
    if (this.skuBundleId) {
      const { newValue }: any = await this.$watchAsObservable('state')
        .pipe(take(1))
        .toPromise();
      let bundleSkus = newValue.payload.data.bundle_skus;
      // 如果已经存在商品组，则从当前商品组筛选出已经选中的商品，存入store
      if (bundleSkus) {
        this.bundleSkus = bundleSkus;
        this.bundleSkus.forEach((e: any) => {
          e.barcode = e.appearances[0].selected_barcode;
          e.barcodes = _.union(
            _.flatten(e.appearances.map((e: any) => e.barcodes))
          );
          e.is_selected = true;
          this.setSkus({ name: 'single', selections: [], row: { ...e } });
        });
      }
      // 如果bundleSkus不存在，则调用接口获取bundle
      else {
        const { isFulfill, payload } = await this.getBundleSkus();
        if (isFulfill) this.bundleSkus = payload!.data.skus;
      }
    }
  }

  getBundleSkus() {
    return getBundleSkus$({ id: this.skuBundleId }).toPromise();
  }

  pageChange(page: any) {
    this.searchSchema.pageIndex = page.pageIndex;
    this.searchSchema.pageSize = page.pageSize;
    this.loadDefaultApi({ ...this.searchSchema });
  }

  search() {
    this.searchSchema.pageIndex = 1;
    (this.$refs.PaginationInnerBox as any).init();
    this.loadDefaultApi({ ...this.searchSchema });
  }

  preStepHandle() {
    this.$router.replace({
      name: this.isTypeClone ? 'v2-sku-bundle-clone' : 'v2-sku-bundle-create',
      query: { ...this.$route.query, step: '0' }
    });
  }

  confirm() {
    const ref: SkuBundleConfirmModal = this.$refs[
      'SkuBundleConfirmModal'
    ] as SkuBundleConfirmModal;

    if (this.allSkuCount === 0) {
      this.$Message.warning('请先选择需要添加的商品');
    } else {
      ref.open();
    }
  }

  getSkuIds(skus: any[]) {
    const skuIds = skus.reduce((sku: any, cur: any) => {
      sku[cur.pucode] = cur.barcode;
      return sku;
    }, {});
    return skuIds;
  }

  saveBundles() {
    this.submitLoading = true;
    this.showLoading(true);
    this.$emit('next', {
      sku_ids: this.getSkuIds(this.selectedSkus)
    });
  }

  submitBundles() {
    this.submitLoading = true;
    this.showLoading(true);
    this.$emit('next', {
      sku_ids: this.getSkuIds(this.selectedSkus),
      status: 'in_review'
    });
  }

  reselect() {
    this.clearSkus();
    this.skus.forEach((e: any) => {
      e.is_selected = false;
    });
  }

  colseModal() {
    this.showLoading(false);
    (this.$refs.SkuBundleConfirmModal as any).closeHandle();
  }

  showLoading(loading: boolean) {
    (this.$refs.SkuBundleConfirmModal as any).showLoading(loading);
  }

  beforeDestroy() {
    this.submitLoading = false;
    this.reselect();
  }
}
</script>

<style scoped>
.targetEle {
  position: fixed;
  right: 80px;
  bottom: 50px;
  z-index: 2999;
}
</style>
