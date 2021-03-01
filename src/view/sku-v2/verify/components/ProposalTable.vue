<template lang="pug">
  .table-wrapper
    TableBox(:state="state", dataKey="sku_proposals")
      Column(prop='id', align='center', label='注册申请编号', :show-overflow-tooltip='true')
      Column(prop='sku_name', align='center', label='商品名称', :show-overflow-tooltip='true', :min-width="150")
        template(slot-scope="{row}")
          | {{row.sku_name | emptyText}}
      Column(prop='barcodes', align='center', label='商品条码', :show-overflow-tooltip='true')
        template(slot-scope="{row}")
          | {{row.barcodes | emptyText}}
      Column(prop='created_at', align='center', label='申请时间', :show-overflow-tooltip='true')
        template(slot-scope="{row}")
          | {{row.created_at | fmtLocalTime}}
      Column(prop='creator_id', align='center', label='商户ID', :show-overflow-tooltip='true')
      Column(prop='comment', align='center', label='备注', :show-overflow-tooltip='true')
        template(slot-scope="{row}")
          | {{row.comment | empty}}
      Column(align='center', label='操作', :show-overflow-tooltip='true', fixed="right")
        template(slot-scope='{row}')
          Button(type="primary", size="small", @click="viewDetail(row)") 处理
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
export default class ProposalTable extends Vue {
  @Prop() state!: any;

  viewDetail(row: any) {
    this.$router.push({
      name: 'v2-sku-verify-proposal-detail',
      params: { id: row.id }
    });
  }
}
</script>
