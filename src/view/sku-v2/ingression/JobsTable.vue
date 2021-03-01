<template lang="pug">
  div
    GoBack
    Card(title="商品任务列表")
      TableBox(:state="state", dataKey="data")
        Column(label='序号', align='center', width="120", type='index')
        Column(label='采集指令', align='center', prop='instruction_id', width="120")
        Column(label='视觉 ID', align='center', prop='vision_id', width="120")
        Column(label='包装 ID', align='center', prop='appearance_id', width="120")
        Column(prop="job_status" align="center" label="任务状态")
          template(slot-scope="{row}")
            div(:set="statusObj = getJobStatus(row.status)")
              Tag(v-if="statusObj", :color="statusObj.tagColor")
                | {{ statusObj.label }}
        Column(label="采集时间" align="center" prop="updated_at")
          template(slot-scope="{ row }")
            span
              | {{row.updated_at | fmtLocalTime}}
        Column(label="操作", align="center")
          template(slot-scope="{row}")
            Button(type='primary', @click="viewPhotos(row)")
              | 查看详情
    VerifyPhotos(ref="verifyBox" :isLastOne="isLastOne" :visible="showPhotos" :jobInfo="activeJob"
      :disabled="isAllJobFinished" @exit="verifyExit" @next="nextJob" @reviewed="onReviewed")
</template>
<script lang="ts">
import Component, {mixins} from 'vue-class-component';
import TableBox from '@/components/shared/TableBox.vue';
import { jobStatus } from '../../../const/data/skuIngression';
import VerifyPhotos from './VerifyPhotos.vue';
import {DefaultApiType} from '@/interface';
import LoadPageMixin, {LoadPageMixinInstance} from '@/mixins/loadPage';
import SearchMixin, {SearchMixinInstance} from '@/mixins/search';
import {getSkuIngressionJobs$, GetSkuIngressionJobsParams} from '@/api/v2/skus';
import GoBack from '@/components/shared/GoBack.vue';
import {JOB_STATUS_ACCEPTED} from '@/const/data/skuIngression';

@Component({
  components: {TableBox, VerifyPhotos, GoBack},
})
export default class JobsTable extends mixins(LoadPageMixin)
  implements LoadPageMixinInstance {
    defaultApi: DefaultApiType = getSkuIngressionJobs$;
    showPhotos: boolean = false;
    activeJob: any = {};
    get taskId() {
      return (this.$route.query as any).id;
    }
    get isLastOne() {
      const {activeJob, stateData} = this
      const data = (stateData as any).data
      if(activeJob.id && Array.isArray(data)){
        return !(data.filter(item => item.id !== activeJob.id).findIndex(item => item.status !== JOB_STATUS_ACCEPTED) > -1)
      }
      return false
    }
    get isAllJobFinished() {
      return this.stateData.data && this.stateData.data.every(job => job.status === JOB_STATUS_ACCEPTED)
    }
    get defaultParams():GetSkuIngressionJobsParams  {
      return {
        taskId: this.taskId,
      }
    }
    getJobStatus(value: string) {
      return jobStatus.filter(item => item.value === value)[0];
    }
    transformParams(params: any) {
      return params;
    }
    verifyExit() {
      this.showPhotos = false;
      this.activeJob = {};
      this.loadDefaultApi(this.defaultParams);
    }
    nextJob(offset) {
      const {stateData: {data}, activeJob} = this;
      let index = data.findIndex((job: any) => job.id === activeJob.id);
      if(index > -1) {
        const nextIndex = index + offset;
        if (nextIndex < data.length && nextIndex > -1) {
          this.activeJob = data[nextIndex];
        } else {
          this.$Message.warning('没有发现新的审核任务！');
          this.verifyExit()
        }
      }
    }
    onReviewed({reviewed_status}) {
      this.activeJob.status = reviewed_status
    }
    viewPhotos(row: any) {
      this.showPhotos = true;
      this.activeJob = row;
    }
}
</script>
