<template lang="pug">
  Modal(v-model='visible', :width='1200', :footer-hide='true')
    header(slot='header')
      h3 识别服务列表
    Row(v-if='cabinet.binding_service')
      Col(span="8") 当前关联服务ID:
        router-link(:to="{name: 'service-common', query:{pageIndex: 1, keyword: cabinet.binding_service.id}}")
          | {{cabinet.binding_service.id}}
      Col(span="8") 服务名称: {{(cabinet.binding_service && cabinet.binding_service.name) | emptyText}}
      Col(span="8") 商品组名称:
        div(v-if='cabinet.binding_service.bundle_name')
          router-link(:to="{name: 'sku-bundle-list', query:{pageIndex: 1, keyword: cabinet.binding_service.bundle_name}}")
            | {{cabinet.binding_service.bundle_name}}
    ServiceTable(v-if='visible', :cabinet='cabinet')
</template>

<script lang="ts">
  import Vue from 'vue';
  import Component from "vue-class-component";
  import ServiceTable from './ServiceTable.vue';

  @Component({
    components: {ServiceTable}
  })
  export default class ServiceModal extends Vue {
    visible: boolean = false;
    cabinet: any = {};

    load(row: any) {
      this.visible = true;
      this.cabinet = row;
    }
  }
</script>

<style scoped>
</style>
