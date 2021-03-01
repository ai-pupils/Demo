<template lang="pug">
  Modal(v-model='visible', :width='1200', :footer-hide='true')
    header(slot='header')
      h3 商品组列表
    BindSkuBundleTable(v-if='visible', :cabinet='cabinet', @hide="hide")
</template>

<script lang="ts">
  import Vue from 'vue';
  import Component from "vue-class-component";
  import BindSkuBundleTable from './BindSkuBundleTable.vue';

  @Component({
    components: {BindSkuBundleTable}
  })
  export default class BindSkuBundleModal extends Vue {
    visible: boolean = false;
    cabinet: any = {};

    load(row: any) {
      this.visible = true;
      this.cabinet = row;
    }

    hide() {
      this.visible = false;
    }
  }
</script>

<style scoped>
</style>
