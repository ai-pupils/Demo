<template lang="pug">
  section
    Modal(v-model="visible", fullscreen, title="将以下商品添加至商品组", :z-index="3000")
      .mb20
        span 商品数:
        span {{skuCount}}
        span.ml20 商品包装数:
        span {{appearancesCount}}
        <!--      SkuAppearancesCard(v-for="item in list", :key="item.id", :item="item")-->
      Row(:gutter="20", align="middle", justify="center")
        Col(:span="4", :xs="24", :sm="12", :md="8", :lg="8", :xl="6", :xxl="4", v-for="sku in skus", :key="sku.id")
          SkuAppearancesCard(:item="sku", selection, :key="sku.id", :is-can-edit="true")
      div(slot='footer')
        Button(type='text', @click='closeHandle') 取消
        Button(type='primary', @click='saveHandler', :loading="isLoading") 保存
        Tooltip.ml10(v-if="!isCanSubmit", content="存在未完成采集任务的商品，请先完成采集任务", placement="top", max-width="200")
          Button(type='success', @click='submitHandler', :loading="isLoading", :disabled="!isCanSubmit")
            |{{isTypeCreate ? '创建并送审': '送审'}}
        Button(v-else, type='success', @click='submitHandler', :loading="isLoading", :disabled="!isCanSubmit")
          |{{isTypeCreate ? '创建并送审': '送审'}}
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import SkuAppearancesCard from '@/view/common/SkuAppearancesCard.vue';
import { Prop } from 'vue-property-decorator';
import { Getter } from 'vuex-class';
import _ from 'lodash';

@Component({
  components: { SkuAppearancesCard }
})
export default class SkuBundleConfirmModal extends Vue {
  @Prop() skuCount!: number;
  @Prop() appearancesCount!: number;
  @Prop() isTypeCreate!: boolean;
  @Getter('skuBundle/getBundleReviewStatus') getBundleReviewStatus!: string;
  @Getter('skuBundle/skus') selectedSkus!: any[];

  visible: boolean = false;
  isLoading: boolean = false;

  open() {
    this.visible = true;
  }

  get skus() {
    return _.cloneDeep(this.selectedSkus);
  }

  get isCanSubmit() {
    return _.isEmpty(
      _.find(this.skus, (sku: any) => {
        return sku.ingress_status != 'accepted';
      })
    );
  }

  closeHandle() {
    this.visible = false;
  }

  showLoading(loading: boolean) {
    this.isLoading = loading;
  }

  confirm() {
    this.$emit('confirm');
  }

  saveHandler() {
    this.$emit('saveBundles');
  }

  submitHandler() {
    this.$emit('submitBundles');
  }
}
</script>
