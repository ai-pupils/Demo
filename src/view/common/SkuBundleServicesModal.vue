<template lang="pug">
  Modal(v-model='visible', title='识别服务列表', width='60', :footer-hide='true')
    Table(max-height='550', :data='tableData', :border='true', :fit='true')
      Column(label='服务ID', align='center', prop='id')
      Column(label='服务名称', align='center', prop='name')
        template(slot-scope='{row}')
          | {{row.name | emptyText}}
      Column(label='服务描述', align='center', prop='desc')
        template(slot-scope='{row}')
          | {{row.desc | emptyText}}
</template>


<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

@Component({})
export default class SkuBundleServicesModal extends Vue {
  visible: boolean = false;
  tableData: any[] = [];

  load(data: any) {
    if (data && data.length > 0) {
      this.visible = true;
      this.tableData = data;
    }
  }
}
</script>
