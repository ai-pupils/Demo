<template lang="pug">
  Modal(v-model="visible", fullscreen, title="高清图对比", :footer-hide="true")
    div(v-for="(sku, index) in skus")
      AppearancesCarousel(:sku="sku")
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import AppearancesCarousel from '@/view/sku-bundle-v2/components/AppearancesCarousel.vue';

@Component({
  components: { AppearancesCarousel }
})
export default class AppearancesComparedModal extends Vue {
  skus: any = [];
  visible: boolean = false;

  public open(skus: Array<any>) {
    this.skus = skus;
    this.visible = true;
  }

  public close() {
    this.visible = false;
  }
}
</script>

<style scoped>
.sku-lable {
  font-size: 16px;
}
</style>
