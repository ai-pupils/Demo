<template lang="pug">
  section
    TableBox(:state='state', :default-sort='defaultSort', @sortChange='sortChange')
      Column(prop='id', align='center', label='锁柜编号')
      Column(prop='source', align='center', label='锁柜原因')
        template(slot-scope='{row}')
          | {{row.name | empty}}
      Column(prop='created_at', align='center', label='锁柜时间')
        template(slot-scope='{row}')
          | {{row.started_at | fmtLocalTime | empty}}
      Column(prop='closed_at', align='center', label='解锁时间')
        template(slot-scope='{row}')
          | {{row.ended_at | fmtLocalTime | empty}}
      Column(prop='start_operator_name', align='center', label='锁定人')
        template(slot-scope='{row}')
          | {{row.start_operator_name | empty}}
      Column(prop='end_operator_name', align='center', label='解锁人')
        template(slot-scope='{row}')
          | {{row.end_operator_name | empty}}
      Column(prop='start_desc', align='center', label='备注')
        template(slot-scope='{row}')
          | {{row.start_desc | empty}}
      Column(align='center', label='操作', fixed='right')
        template(slot-scope='{row}')
          div(v-if='!row.is_deleted')
            Button(type="primary", size="small", @click="unlockedHandle(row)") 解除锁定
          span(v-else) --
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import TableBox from '@/components/shared/TableBox.vue';
import { Prop } from 'vue-property-decorator';
import { MetaType } from '@/interface';
import { refreshCabinet$, updateCabinet$ } from '@/api/cabinet';
import { refreshCabinetExceptions$ } from '@/api/v2/cabinet-exceptions';

@Component({
  components: {
    TableBox
  }
})
export default class CabinetLockedLogsList extends Vue {
  @Prop() state!: MetaType;
  @Prop() cabinetId!: number;
  @Prop() sortChange!: any;
  @Prop() defaultSort!: any;

  get currentTab() {
    const {
      $route: {
        query: { currentTab }
      }
    } = this;
    return currentTab;
  }

  unlockedHandle(row: any) {
    row.cabinetId = this.cabinetId;
    this.$Modal.confirm({
      title: '确认',
      content: `<p>解除锁定后，该货柜可进行正常交易，确认解除锁定货柜？</p>`,
      onOk: () => {
        updateCabinet$({ id: this.cabinetId, status: 'available' }).subscribe(
          withMetaResponse => {
            if (!withMetaResponse.isError && withMetaResponse.payload) {
              const { runtime_status } = (withMetaResponse as any).payload.data;
              if (runtime_status === 'available') {
                this.$Message.success('解锁成功!');
              } else {
                this.$Message.error('解锁失败!');
              }
              if (this.currentTab === 'cabinetLockedLogs') {
                // 广播，更新数据
                refreshCabinetExceptions$.next();
                //更新货柜信息
                refreshCabinet$.next();
              }
            }
          }
        );
      }
    });
  }
}
</script>
