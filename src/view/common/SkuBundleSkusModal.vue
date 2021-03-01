<template lang="pug">
  Modal(v-model='visible', title='SKU列表', width='60', :footer-hide='true')
    Table(max-height='550', :data='tableData', :border='true', :fit='true')
      Column(label='商品ID', align='center', prop='id')
      Column(label='商品名称', align='center', prop='name', :min-width="230", show-overflow-tooltip)
      Column(label='商品条码', align='center', prop='barcode', :width="170")
      Column(label='商品性质', align='center', prop='barcode_type')
        template(slot-scope='{row}')
          | {{row.barcode_type | getSkuBarcodeTypes}}
      Column(label='包装类型', align='center', prop='package_type')
        template(slot-scope='{row}')
          | {{row.package_type | getSkuPackageTypes}}
      Column(label='商品类型', align='center', prop='sku_types')
        template(slot-scope='{row}')
          | {{row.sku_type | getSkuTypes}}
</template>


<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

@Component({})
export default class SkuBundleSkusModal extends Vue {
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
