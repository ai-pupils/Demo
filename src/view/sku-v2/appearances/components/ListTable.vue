<template lang="pug">
  TableBox(:state="state", data-key="sku_appearances")
    Column(label="商品包装ID", align="center", prop="id")
    Column(label="包装名称", align="center")
      template(slot-scope="{row}")
        | {{row.appearance_name | emptyText}}
    Column(label="包装描述", align="center")
      template(slot-scope="{row}")
        | {{row.appearance_desc | emptyText}}
    Column(label="商品条码", align="center")
      template(slot-scope="{row}")
        | {{row.barcodes | emptyText}}
    Column(label="支持柜体", align="center")
      template(slot-scope="{row}")
        span(v-if="row.ingression_status && row.ingression_status.length === 0") {{'' | emptyText}}
        Button(v-else, @click="viewIngressionStatus(row)") 查看
    Column(label="包装示例图", align="center")
      template(slot-scope="{row}")
        LazyLoadImg.thumb(:src="row.appearance_url", link)
    Column(label="操作", align="center", fixed="right")
      template(slot-scope="{row}")
        Button(size="small", type="primary", @click="viewSkuAppearancesDetail(row)") 查看详情
</template>


<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import TableBox from '@/components/shared/TableBox.vue';
import LazyLoadImg from '@/components/shared/LazyloadImg.vue';

@Component({
  components: { TableBox, LazyLoadImg }
})
export default class SkuAppearancesListTable extends Vue {
  @Prop() state!: any;

  viewSkuAppearancesDetail(row: any) {
    this.$router.push({
      name: 'v2-sku-appearances-detail',
      params: { id: row.id }
    });
  }

  viewIngressionStatus(row: any) {
    this.$router.push({
      name: 'v2-sku-appearances-detail',
      params: { id: row.id },
      query: { tabName: 'supportCabinet' }
    });
  }
}
</script>
