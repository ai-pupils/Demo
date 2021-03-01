<template lang="pug">
  section
    TableBox(:state='state', :default-sort='defaultSort', @sortChange='sortChange')
      Column(prop='id', align='center', label='故障ID')
      Column(prop='source', align='center', label='故障来源')
        template(slot-scope='{row}')
          | {{row.source | getCabinetFaultSourceFilter}}
      Column(prop='desc', align='center', label='故障简述')
      Column(prop='status', align='center', label='故障处理状态')
        template(slot-scope='{row}')
          | {{row.status | getCabinetFaultResovedStatus}}
      Column(prop='created_at', align='center', label='报告时间')
        template(slot-scope='{row}')
          | {{row.created_at | fmtLocalTime}}
      Column(prop='closed_at', align='center', label='结束时间')
        template(slot-scope='{row}')
          | {{row.closed_at | fmtLocalTime}}
      Column(prop='type', align='center', label='故障类型')
        template(slot-scope='{row}')
          | {{row.type | getCabinetFaultTypes}}
      Column(prop='id', align='center', label='操作', fixed='right')
        template(slot-scope='{row}')
          div(v-if='row.status === "PENDING"')
            Button(type="primary", size="small", @click="completeHandle(row)") 完成处理
          div(v-else)
            Button(type="primary", size="small", @click="viewDetail(row)") 查看详情
    SystemFaultDetails(ref="faultDetails", :cabinetId="cabinetId")
    SystemFaultCompleteModal(ref="completeModal")
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import _ from 'lodash';
import { Carousel, CarouselItem } from 'element-ui';
import TableBox from '@/components/shared/TableBox.vue';
import { Prop } from 'vue-property-decorator';
import { MetaType } from '@/interface';
import SystemFaultCompleteModal from '@/view/cabinet/components/SystemFaultCompleteModal.vue';
import SystemFaultDetails from '@/view/cabinet/components/SystemFaultDetails.vue';

@Component({
  components: {
    TableBox,
    Carousel,
    CarouselItem,
    SystemFaultCompleteModal,
    SystemFaultDetails
  }
})
export default class SystemFaultLogsList extends Vue {
  @Prop() state!: MetaType;
  @Prop() cabinetId!: number;
  @Prop() sortChange!: any;
  @Prop() defaultSort!: any;
  viewDetail(row: any) {
    (this.$refs['faultDetails'] as SystemFaultDetails).load(row);
  }

  completeHandle(row: any) {
    row.cabinetId = this.cabinetId;
    (this.$refs['completeModal'] as SystemFaultCompleteModal).load(row);
  }
}
</script>
