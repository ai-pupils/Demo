<template lang="pug">
  .table-wrapper
    TableBox(:state='state', :default-sort='defaultSort', @sortChange='sortChange')
      Column(prop='user_id', align='center', label='商户ID', sortable="custom")
      Column(prop='name', align='center', label='商户名称', sortable="custom")
        template(slot-scope="{row}")
          | {{row.name | emptyText}}
      Column(prop='user_type', align='center', label='商户类型', sortable="custom")
      Column(prop='email', align='center', label='邮箱', sortable="custom")
        template(slot-scope="{row}")
          | {{row.email | emptyText}}
      Column(prop='create_time', align='center', label='创建时间', sortable="custom")
        template(slot-scope='{row}')
          | {{row.create_time | fmtLocalTime | emptyText}}
      Column(prop='comment', align='center', label='备注', sortable="custom")
        template(slot-scope="{row}")
          | {{row.comment | emptyText}}
      Column(align='center', label='操作', :width='100', fixed='right')
        template(slot-scope='scope')
          Button(type='primary', size='small', @click='gotoDetail(scope.row)') 查看详情

</template>


<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import TableBox from '@/components/shared/TableBox.vue';
import { Prop } from 'vue-property-decorator';
import { MetaType } from '@/interface';

@Component({
  components: { TableBox }
})
export default class ListTable extends Vue {
  @Prop() state!: MetaType;
  @Prop() sortChange!: any;
  @Prop() defaultSort!: any;

  gotoDetail(row: any) {
    this.$router.push({ name: 'dealer-detail', params: { id: row.user_id }, query: { name: row.name } });
  }
}
</script>
