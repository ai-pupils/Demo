<template lang="pug">
  section
    TableBox(:state='state', :default-sort='defaultSort', @sortChange='sortChange', @cell-dblclick="cellDBClick")
      Column(prop='dealer_id', align='center', label='商户ID', :show-overflow-tooltip='true')
      Column(prop='dealer_name', align='center', label='商户名称', :show-overflow-tooltip='true')
      Column(prop='name', align='center', label='任务名称', :show-overflow-tooltip='true')
        template(slot-scope="{row}")
          Input(style="width:170px", v-model="row.name", v-if="row.isEdited")
          span(v-else) {{row.name | empty}}
      Column(prop='from_time', align='center', label='开始时间', :show-overflow-tooltip='true', sortable="custom")
        template(slot-scope="{row}")
          | {{row.from_time | fmtLocalTime}}
      Column(prop='to_time', align='center', label='结束时间', :show-overflow-tooltip='true', sortable="custom")
        template(slot-scope="{row}")
          | {{row.to_time | fmtLocalTime}}
      Column(prop='status', align='center', label='任务状态', :show-overflow-tooltip='true')
        template(slot-scope="{row}")
          | {{row.status | patrolStatusFilter}}
      Column(align='center', label='操作', fixed="right")
        template(slot-scope="{row}")
          Button(v-if="row.status === 'CREATED' && !row.isEdited",
            class="width-btn",
            type="primary",
            size="small",
            @click="$router.push({name:'_patrols_detail', params: {id: row.id}})") 开始巡检
          Button(class="width-btn", type="warning" v-if="row.status === 'SUBMITTED' && !row.isEdited", size="small", @click="exportFile(row)", :loading="row.isLoading") 导出巡检结果
          Button.ml5(v-show="row.isEdited", @click="saveItem(row)", size="small") 保存
          Button.ml5(v-show="!row.isEdited", @click="edit(row)", size="small") 编辑
          Button.ml5(v-show="row.isEdited", @click="cancel(row)", size="small") 取消

</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import TableBox from '@/components/shared/TableBox.vue';
import { Prop } from 'vue-property-decorator';
import { MetaType } from '@/interface';
import { exportPatrols$, postPatrol$ } from '@/api/patrol';
import downloadCsv from '@/utils/downloadCsv';
import { finalize } from 'rxjs/operators';
import { EmptyString } from '@/utils/EmptyString';

@Component({
  components: { TableBox }
})
export default class PatrolListTable extends Vue {
  @Prop() state!: MetaType;
  @Prop() sortChange!: any;
  @Prop() defaultSort!: any;
  cachedItem: any = {};

  edit(row: any) {
    this.cachedItem[row.id] = row.name;
    row.isEdited = true;
  }

  saveItem(row: any) {
    row.isEdited = false;
    row.isLoading = true;
    postPatrol$({ id: Number(row.id), name: row.name || new EmptyString() })
      .pipe(
        finalize(() => {
          row.isLoading = false;
        })
      )
      .subscribe({
        error: () => {
          this.cancel(row);
        }
      });
  }

  cancel(row: any) {
    row.name = this.cachedItem[row.id];
    row.isEdited = false;
  }

  cellDBClick({ row, column }: any) {
    if (column.property === 'name') {
      this.edit(row);
    }
  }

  exportFile(row: any) {
    row.isLoading = true;
    exportPatrols$({ id: row.id })
      .pipe(
        finalize(() => {
          row.isLoading = false;
        })
      )
      .subscribe((state: any) => {
        downloadCsv({ ...state.payload, filename: `;filename=${row.id}` });
      });
  }
}
</script>

<style scoped lang="scss">
.width-btn {
  width: 104px;
}
</style>
