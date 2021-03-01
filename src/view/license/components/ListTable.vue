<template lang="pug">
  .table-wrapper
    TableBox(:state='state', :default-sort='defaultSort', @sortChange='sortChange')
      Column(prop='id', align='center', label='License ID')
      Column(prop='user_id', align='center', label='商户名称')
      Column(prop='user_name', align='center', label='商户名称')
        template(slot-scope="{row}")
          | {{row.user_name | emptyText}}
      Column(prop='cabinet_key_duration', align='center', label='License有效时长（月）')
      Column(prop='user_type', align='center', label='已激活key数/Key总数（个）')
        template(slot-scope="{row}")
          | {{`${row.used_count || 0}/${row.total_count || 0}`}}
      Column(prop='create_time', align='center', label='创建时间')
        template(slot-scope='{row}')
          | {{row.create_time | fmtLocalTime | emptyText}}
      Column(align='center', label='操作', :width='100', fixed='right')
        template(slot-scope='scope')
          Button(type='primary', size='small', @click='gotoDetail(scope.row)') 查看明细

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
    this.$router.push({
      name: 'license-detail',
      params: { lkey: row.license_key }
    });
  }
}
</script>
