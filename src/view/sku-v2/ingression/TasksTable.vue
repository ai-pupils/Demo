<template lang="pug">
  TableBox(:state='state', dataKey="data")
    Column(prop="name", label='任务名称', :width="250")
      template(slot-scope="{row}")
        router-link(:to="{name: 'sku-ingression-jobs', query: {id: row.id}}").inherit-color
          | {{row.name}}
    Column(label="包装样例图" align="center" :width="100")
      template(slot-scope="{row}")
        a(v-if="row.appearance_info" :href="row.appearance_info.appearance_url" target="_blank")
          LazyloadImg(class="thumb" :src="row.appearance_info.appearance_url")
        span(v-else)
          | 暂无
    Column(prop="appearance_id", label='包装 ID')
    Column(prop="vision_id", label='视觉 ID' :width="100")
    Column(prop="guide_id", label='采集指南' :width="100")
      template(slot-scope="{row}")
        router-link(:to="{name: 'v2-guide-detail', params: {id: row.guide_id}}").inherit-color
          | {{row.guide_id}}
    Column(prop="sku_id", label='商品 ID')
    Column(label="当前状态", prop="status", :width="100", align="center")
      template(slot-scope="{row}")
        Tag(:color="getTaskStatus(row.status).tagColor")
          | {{ getTaskStatus(row.status).label || row.status }}
    Column(label="未审核", prop="unreviewed_job_count", :width="100")
    Column(label="未拍摄", prop="empty_job_count", :width="100")
    Column(label="已拒绝", prop="rejected_job_count", :width="100")
    Column(label="已接收", prop="accepted_job_count", :width="100")
    Column(label="采集时间" width="200")
      template(slot-scope="{row}")
            | {{row.min_unreviewed_collected_at | fmtLocalTime}}
    Column(label="过期提醒")
      template(slot-scope="{row}")
        span(:class="row.min_unreviewed_review_deadline | getTimeoutInfo('class')")
          | {{ row.min_unreviewed_review_deadline | getTimeoutInfo('text')}}
    Column(label="操作")
      template(slot-scope="{row}")
        Button(type="primary" :to="{name: 'sku-ingression-jobs', query: {id: row.id}}")
          | 查看任务
</template>
<script lang="ts">
  import Component, {mixins} from 'vue-class-component';
  import { Prop } from 'vue-property-decorator';
  import Vue from 'vue';
  import LazyloadImg from '@/components/shared/LazyloadImg.vue';
  import { taskStatus } from '../../../const/data/skuIngression';
  import TableBox from '@/components/shared/TableBox.vue';
  import fmt from '@/const/fmt.js';
  import humanizeDuration from 'humanize-duration';

  @Component({
    components: {LazyloadImg, TableBox},
    filters: {
      getTimeoutInfo(value, key) {
        if(!value) return '';
        const deadline = fmt.moment(value)
        const current = fmt.moment()
        const diff = deadline.diff(current)
        const time = humanizeDuration(diff, {
          largest: diff > 0 ? 2 : 1,
          round: diff > 0 ? false : true,
          language: 'zh_CN',
          units: ['d', 'h', 'm', 's'],
          delimiter: ' ',
          maxDecimalPoints: 0
        })
        const diffText = `${time}${diff > 0 ? '后': '前'}到期`
        let info = {}
        if(diff > 1200) {
          info = { text: diffText }
        } else if (diff > 0) {
          info = {
            text: diffText,
            class: 'color-yellow'
          }
        } else {
          info = {
            text: diffText,
            class: 'color-red'
          }
        }
        return key ? info[key] : info
      }
    }
  })
  export default class StatisticsSkuTable extends Vue {
    @Prop({ type: Object, required: true })
    state: any;

    getTaskStatus(status: any) {
      return taskStatus.find(s => s.value === status);
    }
}
</script>
<style lang="less" scoped>
  @import (less) "~@/css/vars.less";

  .color {
    &-red {
      color: @color-error;
    }
    &-yellow {
      color: @color-warning;
    }
  }
</style>
