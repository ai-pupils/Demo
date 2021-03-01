<template lang="pug">
  section
    GoBack
    Card(:title="type === 'clone' ? '克隆商品组' : '新建商品组'")
      Row(style="margin-bottom: 50px")
        Col(span="5") &nbsp;
        Col(span="19")
          Steps(:current="step")
            Step(title="填写商品组信息")
            Step(title="添加商品")
            Step(title="完成")
      Row(v-show="step===0")
        Col(span="6") &nbsp;
        Col(span="9")
          SkuBundleForm(@next="skuBundleFormConfirmHandle", :type="type", :bundleInfo="bundleInfo" :cabinet="cabinet")
      Row(v-if="step===1")
        SkuBundleAddSku(ref="SkuBundleAddSku", :type="type", :skuBundleId="skuBundleId",
          @next="skuBundleAddSkuConfirmHandle"
        )
      div(v-if="step===2", style="width: 500px; margin: 0 auto;")
        Alert(type="success", show-icon)
          div(style="text-align: left;") 操作成功
          div(slot="desc") 已成功创建商品组
        Form(:label-width="140")
          FormItem(label="商品组名称:") {{skuName}}
          FormItem.pr(label="商品数:", style="top:-25px") {{skuCount}}
        div.text-center
          Button(@click="goSkuBundleList") 完成

</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import SkuBundleForm from './components/SkuBundleForm.vue';
import SkuBundleAddSku from './components/SkuBundleAddSku.vue';
import GoBack from '@/components/shared/GoBack.vue';
import { Prop, Watch } from 'vue-property-decorator';
import { createSkuBundleV2$, getSkuBundlesV2$ } from '@/api/sku-bundle';
import { Getter, Mutation } from 'vuex-class';

@Component({
  components: { GoBack, SkuBundleAddSku, SkuBundleForm }
})
export default class SkuBundleCreate extends Vue {
  @Getter('skuBundle/skus') selectedSkus!: any[];
  @Prop({ type: String, default: 'edit' }) type!: string;
  @Prop() skuBundleId!: string;
  cabinet: any = {};
  step: number = 0;
  SkuBundleFormValid: boolean = false;
  form: any = {};
  skuName: string = '';
  skuCount: number = 0;
  bundleInfo: any = {};

  @Watch('$route.query.step', { deep: true, immediate: true })
  stepChange(stepValue: any) {
    if (stepValue) {
      this.step = Number(stepValue);
      if (stepValue === '1' || stepValue === '2') {
        if (!this.SkuBundleFormValid) {
          this.$router.replace({
            name:
              this.type === 'clone'
                ? 'v2-sku-bundle-clone'
                : 'v2-sku-bundle-create',
            query: { ...this.$route.query, step: '0' }
          });
        }
      }
    }
  }

  async created() {
    if (this.type === 'clone') {
      const { isFulfill, payload } = await this.getBundleInfo();
      if (isFulfill) this.bundleInfo = payload!.data.bundles[0];
    }
    this.cabinet = this.$route.params.cabinet;
  }

  getBundleInfo() {
    return getSkuBundlesV2$({ bundleId: this.skuBundleId }).toPromise();
  }

  skuBundleFormConfirmHandle(form: any) {
    this.SkuBundleFormValid = true;
    this.form = { ...form };
  }

  async skuBundleAddSkuConfirmHandle(form: any) {
    this.form = { ...this.form, ...form };

    const { isFulfill, payload } = await createSkuBundleV2$({
      vision_id: this.form.vision_id,
      dealer_id: Number(this.form.dealer_id),
      description: this.form.description,
      name: this.form.name,
      sku_ids: this.form.sku_ids,
      status: form.status
    }).toPromise();

    (this.$refs.SkuBundleAddSku as any).colseModal();

    if (isFulfill) {
      this.$router.replace({
        name:
          this.type === 'clone'
            ? 'v2-sku-bundle-clone'
            : 'v2-sku-bundle-create',
        query: { ...this.$route.query, step: '2' }
      });
      const id = payload.data.bundle_id;
      getSkuBundlesV2$({ bundleId: id }).subscribe(state => {
        if (!state.isError && state.payload) {
          if (state.isFulfill) {
            const {
              payload: {
                data: { bundles }
              }
            } = state as any;
            if (bundles && bundles.length > 0) {
              this.skuName = bundles[0].name;
              this.skuCount = bundles[0].sku_count;
            }
          }
        }
      });
    }
  }

  goSkuBundleList() {
    this.$router.replace({ name: 'v2-sku-bundle-list' });
  }

  beforeDestroy() {
    const SkuBundleAddSkuRef: SkuBundleAddSku = this.$refs[
      'SkuBundleAddSku'
    ] as SkuBundleAddSku;
    if (SkuBundleAddSkuRef) SkuBundleAddSkuRef.reselect();
  }
}
</script>
