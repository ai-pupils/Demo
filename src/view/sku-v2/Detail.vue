<template lang="pug">
  section
    GoBack
    Card
      Spin(size='large' fix v-if='isFetching')
      h6.clearfix(slot='title', style='line-height: 30px')
        span 商品详情
        .fr(v-if="tabName === 'skuInfo'")
          Button.ml5(type="primary", @click="skuInfoSubmitHandle", :loading="submitLoading") 提交
          <!--        .fr(v-if="tabName === 'skuAppearancesInfo'")-->
          <!--          Button.ml5(type="primary", @click="goCreateSkuAppearances") 新建包装-->
      TabsBox(v-model="tabName", :tabs="tabs")
        template(slot="skuInfo")
          SkuInfo(ref="skuInfoForm", v-show="tabName === 'skuInfo'", :data="stateData",
          @reload="reload", v-model="submitLoading")
        template(slot="skuAppearancesInfo")
          SkuAppearancesInfo(v-show="tabName === 'skuAppearancesInfo'", :state="state")
</template>

<script lang="ts">
import Component, { mixins } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { TabPaneType } from '@/components/shared/TabsBox.vue';
import SkuInfo from './components/SkuInfo.vue';
import SkuAppearancesInfo from './components/SkuAppearancesInfo.vue';
import TabsBox from '@/components/shared/TabsBox.vue';
import GoBack from '@/components/shared/GoBack.vue';
import LoadPageMixin, { LoadPageMixinInstance } from '@/mixins/loadPage';
import { DefaultApiType } from '@/interface';
import { getSku$, GetSkuParams } from '@/api/sku';

@Component({
  components: { GoBack, TabsBox, SkuInfo, SkuAppearancesInfo }
})
export default class SkuDetail extends mixins(LoadPageMixin)
  implements LoadPageMixinInstance {
  @Prop() id!: string;
  fetchOnce: boolean = true;
  defaultApi: DefaultApiType = getSku$;
  defaultParams: GetSkuParams = {
    id: this.id
  };
  tabName: string = 'skuInfo';
  tabs: TabPaneType[] = [
    { label: '商品', name: 'skuInfo' },
    { label: '商品包装', name: 'skuAppearancesInfo' }
  ];
  submitLoading: boolean = false;

  transformParams(params: any) {
    return params;
  }

  skuInfoSubmitHandle() {
    const skuInfoFormRef = <SkuInfo>this.$refs.skuInfoForm;
    skuInfoFormRef.submit();
  }

  goCreateSkuAppearances() {
    this.$router.push({
      name: 'v2-sku-appearances-create',
      params: { skuId: this.id },
      query: { name: this.stateData.sku_name }
    });
  }

  reload(params: any) {
    this.loadDefaultApi({ ...params });
  }
}
</script>
