<template lang="pug">
  section
    .message-log(v-if="!state.isFetching")
      .logs(v-for='log in logs')
        .col.ml20(style="height:auto")
          .avatar
            img.custom(v-if="log.person_type === 'DEALER'", src="~@/assets/img/custom.png")
            img.staff(v-else, src="~@/assets/img/malong_logo.png")
          .div(style="width: 100%")
            .log-title
              span.pa10 {{getLogTitle(log.person_type)}}
              span.fr {{log.created_at | fmtLocalTime}}
            p.pa10 {{log.message}}
            .preview(v-for="att in log.attachments")
              preview-box(:attachment="att")
        Divider
    .message-box.mt50(v-if='!isFinished && isHandler')
      h4.mb20 留言回复
      Input.mb10(v-model="message", type="textarea", :rows="4", placeholder="请输入留言回复")
      UploadFiles.mb5(ref="uploadFiles", @loading="changeBtnStatus")
        span.ml10.log-title 支持.png, .jpg, .jpeg, .txt, .rar, .doc, .xls, .xlsx, .zip, .7z格式, 最大不超过5M
      Button(type="primary", @click="submit", :loading="loading") 提交
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import { DataResponse, MetaType } from '@/interface';
import { createTicket$, GetTicketsData } from '@/api/ticket';
import LazyLoadImage from '@/components/shared/LazyLoadImage.vue';
import { TicketStatus } from '@/const/data/ticket';
import { State } from 'vuex-class';
import UploadFiles from '@/view/ticket/components/UploadFiles.vue';
import _ from 'lodash';
import { getFileExt } from '@/mixins/helper';
import PreviewBox from '@/view/ticket/components/PreviewBox.vue';

@Component({
  components: { PreviewBox, LazyLoadImage, UploadFiles }
})
export default class TicketLogs extends Vue {
  @Prop() state!: any;
  @Prop({ type: Boolean, default: false }) isFinished!: boolean;
  @Prop({ type: Boolean, default: false }) isHandler!: boolean;
  logs = {};
  message: string = '';
  loading = false;

  @Watch('state', { immediate: true })
  stateChanged(state: MetaType<DataResponse<GetTicketsData>>) {
    if (state.isFulfill) {
      const data = state.payload!.data as any;
      if (data) {
        this.logs = data.work_order_logs;
      }
    }
  }

  changeBtnStatus(v: boolean) {
    this.loading = v;
  }

  getLogTitle(type: string) {
    if (type === 'DEALER') {
      return '问题描述';
    } else {
      return '码隆运营';
    }
  }

  get attachments() {
    const updaload = this.$refs['uploadFiles'] as any;
    if (!_.isEmpty(updaload)) {
      return updaload.uploadFiles.map((f: any) => {
        return { source_name: f.source_name, content: f.content };
      });
    }
    return {};
  }

  isCanSubmit() {
    return this.message || !_.isEmpty(this.attachments);
  }

  submit() {
    if (!this.isCanSubmit()) {
      this.$Message.error('请填写留言或上传附件');
      return;
    }
    const id = this.state.payload!.data.id;
    createTicket$({
      id: id,
      message: this.message,
      attachments: this.attachments
    }).subscribe(state => {
      if (!state.isError) {
        this.$Message.success('提交成功');
        this.$emit('refresh');
      } else {
        this.$Message.error(`提交失败 ${state.error.message || ''}`);
      }
    });
  }
}
</script>

<style scoped>
.col {
  display: flex;
  align-items: center;
  position: relative;
}
.log-title {
  font-size: 10px;
  color: #999999;
}
.pa10 {
  padding: 10px;
}
.mt50 {
  margin-top: 50px;
}
.custom {
  padding: 15px;
  width: 60px;
  height: 60px;
}
.staff {
  width: 60px;
  height: 60px;
}
</style>
