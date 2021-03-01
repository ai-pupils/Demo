<template lang="pug">
  section
    .upload
      Upload(
        ref="upload",
        :on-success="handleSuccess",
        :on-progress="handleProgress",
        :on-error="handleError"
        :format="format",
        :show-upload-list="false",
        name="attachment",
        action="/v2/work-orders/attachments.fl",
        :max-size="maxSize",
        :on-format-error="handleFormatError",
        :on-exceeded-size="handleMaxSize",
        multiple
      )
        Button(icon="ios-cloud-upload-outline", :disabled="loading") 上传附件
    .list
      .mb10(v-for="item in uploadList")
        template(v-if="item.status === 'finished'")
          preview-box(:attachment="item", @handleRemove="handleRemove", :showClose="true")
        template(v-else)
          Progress(v-if="item.showProgress", :percent="item.percentage", :stroke-width="5")
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import PreviewBox from '@/view/ticket/components/PreviewBox.vue';

@Component({
  components: { PreviewBox }
})
export default class UploadFiles extends Vue {
  uploadList: any = [];
  loading = false;

  format = [
    'png',
    'jpg',
    'jpeg',
    'txt',
    'rar',
    'doc',
    'xls',
    'xlsx',
    'zip',
    '7z'
  ];
  maxSize = 5120;

  get uploadFiles() {
    return this.uploadList;
  }

  mounted() {
    this.uploadList = (this.$refs.upload as any).fileList;
  }

  handleProgress(){
    this.syncStatus(true);
  }

  handleRemove(file: any) {
    const fileList = (this.$refs.upload as any).fileList;
    (this.$refs.upload as any).fileList.splice(fileList.indexOf(file), 1)
  }
  handleSuccess(res: any, file: any, fileList: any[]) {
    this.syncStatus(false);
    this.uploadList = fileList;
    this.uploadList.forEach((file: any) => {
      file.source_name = file.name;
      file.content = file.response.data.name;
    });
  }
  handleError(res: any, file: any, fileList: any[]) {
    this.syncStatus(false);
    // 上传失败时，从列表里删除失败的文件
    this.handleRemove(file);
    this.$Message.error('上传文件失败');
  }
  handleFormatError(file: any) {
    this.syncStatus(false);
    this.$Message.error('不支持的文件类型');
  }
  handleMaxSize(file: any) {
    this.syncStatus(false);
    this.$Message.error('不支持的文件类型');
  }

  syncStatus(status: boolean) {
    this.loading = status;
    this.$emit('loading', status);
  }
}
</script>

<style scoped>
.demo-upload-list {
  display: inline-block;
  width: 60px;
  height: 60px;
  text-align: center;
  line-height: 60px;
  border: 1px solid transparent;
  border-radius: 4px;
  overflow: hidden;
  background: #fff;
  position: relative;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
  margin-right: 4px;
}
.demo-upload-list img {
  width: 100%;
  height: 100%;
}
.demo-upload-list-cover {
  display: none;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
}
.demo-upload-list:hover .demo-upload-list-cover {
  display: block;
}
.demo-upload-list-cover i {
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  margin: 0 2px;
}
</style>
