<template lang="pug">
  section
    GoBack
    Card
      h6.clearfix(slot='title', style='line-height: 30px')
        span(v-if="tabName === 'skuBundleInfo'") 商品组详情
        span(v-else) {{`商品组详情(商品组ID: ${skuBundleId}, 商户ID: ${dealerId || '--'})`}}
        .fr(v-if="tabName === 'skuBundleInfo'")
          Button.ml5(type="primary", @click="updateSkuBundleHandle", :loading="submitLoading") 提交
        .fr
          Button.ml5(type="primary", @click="goCloneSkuBundle") 克隆商品组
        .fr
          Button.ml5(type="default", icon='md-download', @click="exportSkuBundle", :loading="loadingCsv") 导出商品组
      TabsBox(v-model="tabName", :tabs="tabs", :isShowAnimation="false")
        template(slot="skuBundleInfo")
          SkuBundleInfo(ref="SkuBundleInfo", v-model="submitLoading",
          v-show="tabName==='skuBundleInfo'", :bundleId="skuBundleId", @dealerId="getDealerId")
        template(slot="skuList")
          SkuList(v-if="tabName==='skuList'", :bundleId="skuBundleId")
        template(slot="modelList")
          ModelList(v-if="tabName==='modelList'", :bundleId="skuBundleId")
        template(slot="trainList")
          TrainingList(v-if="tabName==='trainList'", :bundleId="skuBundleId", :footprint="footprint")
        template(slot="cabinetList")
          CabinetList(v-if="tabName==='cabinetList'", :bundleId="skuBundleId")
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import TabsBox, { TabPaneType } from '@/components/shared/TabsBox.vue';
import GoBack from '@/components/shared/GoBack.vue';
import SkuBundleInfo from './components/SkuBundleInfo.vue';
import SkuList from './components/SkuList.vue';
import ModelList from './components/ModelList.vue';
import TrainingList from './components/TrainingList.vue';
import CabinetList from './components/CabinetList.vue';
import SkuAppearancesCard from '@/view/common/SkuAppearancesCard.vue';
import { Prop } from 'vue-property-decorator';
import { exportSkuBundlesV2$ } from '@/api/sku-bundle';
import downloadCsv from '@/utils/downloadCsv';

@Component({
  components: {
    SkuAppearancesCard,
    GoBack,
    TabsBox,
    CabinetList,
    TrainingList,
    ModelList,
    SkuList,
    SkuBundleInfo
  }
})
export default class SkuBundleDetail extends Vue {
  @Prop() skuBundleId!: string;
  dealerId: string = '';
  tabs: TabPaneType[] = [
    { label: '商品组信息', name: 'skuBundleInfo' },
    { label: '商品', name: 'skuList' },
    { label: '模型', name: 'modelList' },
    { label: '模型训练任务', name: 'trainList' },
    { label: '货柜', name: 'cabinetList' }
  ];
  tabName: string = 'skuBundleInfo';
  submitLoading: boolean = false;
  loadingCsv = false;

  async updateSkuBundleHandle() {
    const SkuBundleInfoRef = this.$refs['SkuBundleInfo'] as SkuBundleInfo;
    const res = await SkuBundleInfoRef.submit().toPromise();

    if (res && res.isFulfill) {
      this.$Message.success('修改成功');
    }
  }

  get footprint() {
    return (this.$route.query as any).footprint;
  }

  goCloneSkuBundle() {
    this.$router.push({
      name: 'v2-sku-bundle-clone',
      params: { skuBundleId: this.skuBundleId },
      query: {}
    });
  }

  getDealerId(dealerId: string) {
    this.dealerId = dealerId;
  }

  exportSkuBundle() {
    this.loadingCsv = true;
    exportSkuBundlesV2$({
      dealer_id: this.dealerId,
      bundles: this.skuBundleId
    }).subscribe({
      next: ({ payload, isError }): any => {
        if (!isError) {
          downloadCsv({
            file: (payload as any).file,
            filename: `bundle-${this.skuBundleId}`
          });
          this.$Message.success('导出成功');
        } else {
          this.loadingCsv = false;
          this.$Message.error('导出失败');
        }
      },
      error: () => {
        this.loadingCsv = false;
        this.$Message.error('导出失败');
      },
      complete: () => {
        this.loadingCsv = false;
      }
    });
  }
}
</script>
