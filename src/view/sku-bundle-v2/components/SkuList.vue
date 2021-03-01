<template lang="pug">
  section
    Spin(size='large' fix v-if='isFetching')
    SkuBundleAddSku(:skuBundleId="bundleId", @next="skuBundleAddSkuConfirmHandle",
      ref="SkuBundleAddSku")
</template>

<script lang="ts">
import Component, { mixins } from 'vue-class-component';
import SkuAppearancesCard from '@/view/common/SkuAppearancesCard.vue';
import LoadPageMixin, { LoadPageMixinInstance } from '@/mixins/loadPage';
import { DefaultApiType } from '@/interface';
import {
  BundleSkuData,
  getBundleSkusV2$,
  GetBundleSkusV2Data,
  getSkuBundlesV2$,
  updateSkuBundleV2$
} from '@/api/sku-bundle';
import { Prop, Watch } from 'vue-property-decorator';
import SkuBundleAddSku from '@/view/sku-bundle-v2/components/SkuBundleAddSku.vue';
import _ from 'lodash';
import { Getter, Mutation } from 'vuex-class';

@Component({
  components: { SkuBundleAddSku, SkuAppearancesCard }
})
export default class SkuList extends mixins(LoadPageMixin)
  implements LoadPageMixinInstance {
  @Prop() bundleId!: string;
  @Prop() bundleStatus!: string;
  fetchOnce: boolean = true;
  defaultApi: DefaultApiType = getBundleSkusV2$;
  defaultParams: any = {
    id: this.bundleId
  };
  skuCount: number = 0;
  skuAppearancesCount: number = 0;
  skus: BundleSkuData[] = [];

  get isShow() {
    return (this.$route.query as any).tabName === 'skuList';
  }

  transformParams(params: any) {
    return params;
  }

  @Watch('stateData')
  dataChange(data: GetBundleSkusV2Data) {
    if (this.state.isFulfill) {
      this.skuCount = data.sku_count;
      this.skuAppearancesCount = data.sku_appearance_count;
      this.skus = data.skus;
    }
  }

  async skuBundleAddSkuConfirmHandle(form: any) {
    const { isFulfill, payload } = await updateSkuBundleV2$({
      id: this.bundleId,
      status: form.status,
      sku_ids: form.sku_ids
    }).toPromise();

    if (isFulfill) {
      // 如果传参中没有status，则是保存操作，否则是送审操作
      if (form.status) {
        this.$Message.success('送审成功！');
        this.$router.replace({
          name: 'v2-sku-bundle-list'
        });
      } else {
        (this.$refs.SkuBundleAddSku as any).colseModal();
        this.$Message.success('保存成功！');
      }
    }
  }
}
</script>

<style>
.targetEle {
  position: fixed;
  right: 80px;
  bottom: 50px;
  z-index: 2999;
}
</style>
