<template lang="pug">
  .table-wrapper
    TableBox(:state="state", dataKey="skus")
      Column(prop='sku_id', align='center', label='商品ID', :show-overflow-tooltip='true')
      Column(prop='id', align='center', label='商品示例图')
        template(slot-scope="{row}")
          LazyLoadImg.thumb(:src="row.sku_url", link)
      Column(prop='trade_mark', align='center', label='商标品牌', :show-overflow-tooltip='true')
        template(slot-scope="{row}")
          | {{(row.trade_mark_cn || row.trade_mark_en) | empty}}
      Column(prop='sku_name', align='center', label='商品名称', :show-overflow-tooltip='true', :min-width="150")
        template(slot-scope="{row}")
          | {{row.sku_name | empty}}
      Column(prop='sku_type', align='center', label='商品类型', :show-overflow-tooltip='true')
        template(slot-scope="{row}")
          | {{row.sku_type | getSkuTypes | empty}}
      Column(prop='package_type', align='center', label='包装类型', :show-overflow-tooltip='true')
        template(slot-scope="{row}")
          | {{row.package_type | getSkuPackageTypes | empty}}
      Column(prop='package_type', align='center', label='采集类型', :show-overflow-tooltip='true')
        template(slot-scope="{row}")
          | {{(row.ingression_type && row.ingression_type.name) | empty}}
      Column(prop='package_type', align='center', label='视觉类型', :show-overflow-tooltip='true')
        template(slot-scope="{row}")
          | {{(row.vision_type && row.vision_type.name) | empty}}
      Column(align='center', label='操作', :show-overflow-tooltip='true', fixed="right")
        template(slot-scope='{row}')
          Button(type="primary", size="small", @click="viewDetail(row)") 查看详情
</template>


<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import TableBox from '@/components/shared/TableBox.vue';
import { Prop } from 'vue-property-decorator';
import LazyLoadImg from '@/components/shared/LazyloadImg.vue';

@Component({
  components: { TableBox, LazyLoadImg }
})
export default class SkuListTable extends Vue {
  @Prop() state!: any;

  viewDetail(row: any) {
    this.$router.push({ name: 'v2-sku-detail', params: { id: row.sku_id } });
  }
}
</script>
