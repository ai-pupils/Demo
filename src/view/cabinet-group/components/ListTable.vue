<template lang="pug">
  .table-wrapper
    TableBox(:state="state")
      Column(prop='id', align='center', label='货柜组ID', :show-overflow-tooltip='true')
      Column(prop='name', align='center', label='货柜组名称', :show-overflow-tooltip='true', :min-width="150")
        template(slot-scope="{row}")
          | {{row.name | empty}}
      Column(prop='description', align='center', label='货柜组描述', :show-overflow-tooltip='true')
        template(slot-scope="{row}")
          | {{row.description | empty}}
      Column(prop='sku_count', align='center', label='货柜数量', :show-overflow-tooltip='true')
        template(slot-scope="{row}")
          | {{(row.cabinet_ids && row.cabinet_ids.length) | empty}}
      Column(prop='created_at', align='center', label='创建时间', :show-overflow-tooltip='true')
        template(slot-scope="{row}")
          | {{row.created_at  | fmtLocalTime | empty}}
      Column(prop='creator_name', align='center', label='创建人', :show-overflow-tooltip='true')
      Column(align='center', label='操作', :show-overflow-tooltip='true', fixed="right")
        template(slot-scope='{row}')
          Button(type="primary", size="small", @click="viewHandler(row)") 查看详情
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
export default class ListTable extends Vue {
  @Prop() state!: any;

  viewHandler(row: any) {
    this.$router.push({
      name: `cabinet-group-detail`,
      params: { id: row.id }
    });
  }
}
</script>
