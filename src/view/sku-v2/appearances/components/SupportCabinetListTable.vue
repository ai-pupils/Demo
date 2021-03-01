<template lang="pug">
  TableBox(:state="state", data-key="ingression_tasks")
    Column(label="柜体ID", align="center", prop="")
      template(slot-scope="{row}")
        p(v-for="type in row.cabinet_types")
          | {{type.id | empty}}
    Column(align='center', label='柜体名称', :show-overflow-tooltip='true')
      template(slot-scope="{row}")
        p(v-for="type in row.cabinet_types")
          router-link(:to="{name:'cabinet-type-detail',params:{id: type.id}}")
            | {{type.name}}
    Column(label="视觉ID", align="center", prop="vision_id")
    Column(label="待审核数", align="center")
      template(slot-scope="{row}")
        | {{row.unreviewed_job_count || 0}}
    Column(label="审核通过数", align="center")
      template(slot-scope="{row}")
        | {{row.accepted_job_count || 0}}
    Column(label="未通过数", align="center")
      template(slot-scope="{row}")
        | {{row.rejected_job_count || 0}}
    Column(label="未采集数", align="center")
      template(slot-scope="{row}")
        | {{row.empty_job_count || 0}}
    Column(label="上新状态", align="center")
      template(slot-scope="{row}")
        | {{row.status | getSkuTaskStatusFilter | emptyText}}
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
export default class SupportCabinetListTable extends Vue {
  @Prop() state!: any;
}
</script>
