<template lang="pug">
  section
    TableBox(:state="state")
      Column(label="任务ID", align="center", prop="task_id")
      Column(label="训练环境", align="center")
        template(slot-scope="{row}")
          | {{row.task_from | emptyText}}
      Column(label="任务状态", align="center")
        template(slot-scope='{row}')
          tag(:color='row.status | getTrainingTaskStatusTypes("color")')
            | {{row.status | getTrainingTaskStatusTypes('text')}}
      Column(label="模型地址", align="center", show-overflow-tooltip)
        template(slot-scope="{row}")
          | {{row.output}}
      Column(label="训练开始时间", align="center")
        template(slot-scope='{row}')
          | {{row.created_at | fmtLocalTime}}
      Column(label="最后更新时间", align="center")
        template(slot-scope='{row}')
          | {{row.modified_at | fmtLocalTime}}
      Column(label="训练时长", align="center")
        template(slot-scope='{row}')
          span(v-if='row.status === 4') {{[row.modified_at, row.created_at] | timeDiff}}
          span(v-else='') -
    PaginationInnerBox(:total="count", :isFetching="isFetching", @pageChange="internalPageChange", @sizeChange="internalPageChange")
</template>

<script lang="ts">
import Component, { mixins } from 'vue-class-component';
import TableBox from '@/components/shared/TableBox.vue';
import LoadPageMixin, { LoadPageMixinInstance } from '@/mixins/loadPage';
import { DefaultApiType, MetaType } from '@/interface';
import { Prop } from 'vue-property-decorator';
import { getTrainTasks$ } from '@/api/train-tasks';
import PaginationInnerBox from '@/components/shared/PaginationInnerBox.vue';
import { of, asyncScheduler } from 'rxjs';
import { createEmptyTrackMeta } from '@/utils/misc';
import { map, observeOn } from 'rxjs/operators';

@Component({
  components: { TableBox, PaginationInnerBox }
})
export default class TrainingList extends mixins(LoadPageMixin)
  implements LoadPageMixinInstance {
  @Prop() bundleId!: string;
  @Prop() footprint!: string;
  fetchOnce: boolean = true;
  defaultApi: DefaultApiType = this.footprint
    ? getTrainTasks$
    : () =>
        of<MetaType>(createEmptyTrackMeta()).pipe(
          observeOn(asyncScheduler),
          map(state => {
            state.isFulfill = true;
            state.isFetching = false;
            state.payload = { data: { count: 0, results: [] } };
            return state;
          })
        );
  defaultParams: any = {
    pageIndex: 1,
    pageSize: process.env.PAGE_SIZE,
    footprint: this.footprint
  };

  transformParams(params: any) {
    return params;
  }

  get count() {
    if (this.statePayload) {
      return this.stateData.count;
    }
    return 0;
  }
}
</script>
