<template>
  <div>
    <Upload
      :action="action"
      :format="['jpg','jpeg','png']"
      :max-size="2048"
      :before-upload="beforeUpload"
      :on-success="afterUploadSuccess"
      :on-format-error="handleFormatError"
      :on-exceeded-size="handleMaxSize"
      :on-error="afterUploadError"
    >
      <slot>
        <img
          v-if="imageSrc && showImg"
          :src="imageSrc"
          class="avatar"
          style="margin-bottom:10px;"
        >
        <Button :disabled="loading" icon="md-cloud-upload" :size="size">
          {{loading ? '正在上传...' : text ? text : imageSrc?'点击重新上传示例图':'点击上传示例图'}}
        </Button>
      </slot>
    </Upload>
  </div>
</template>

<script>
import { toSamlLogin } from '@/utils/misc';

export default {
  props: {
    size: { type: String, default: 'large' },
    showImg: { type: Boolean, default: true },
    text: { type: String },
    action: { type: String },
    imageUrl: { type: String, required: false },
    loading: { type: Boolean, default: false }
  },
  data() {
    return {
      imageData: undefined,
      lastFile: undefined,
      imageId: undefined
    };
  },
  computed: {
    imageSrc() {
      return this.imageData ? this.imageData : this.imageUrl;
    }
  },
  methods: {
    reset() {
      this.imageData = undefined;
      this.lastFile = undefined;
      this.imageId = undefined;
    },
    beforeUpload(file) {
      if (this.loading) return false;
      this.$emit('on-uploading', {});
      this.lastFile = file;
      return true;
    },
    afterUploadSuccess(response, file, fileList) {
      fileList.splice(0, fileList.length);
      if (response.status !== 0) {
        this.$emit('on-uploaded', {
          status: 'error',
          error: response.msg
        });
        this.$Message.error(`上传出错: ${response.status}`);
        return;
      }
      this.imageId = response.data.image_name;
      const reader = new FileReader();
      reader.onload = e => {
        this.imageData = e.target.result;
        this.$emit('on-uploaded', { status: 'success', imageId: this.imageId, resource: response.data.resource_name });
      };
      reader.readAsDataURL(this.lastFile);
    },
    afterUploadError(error) {
      this.$emit('on-uploaded', { status: 'error' });
      this.$Message.error('上传出错');
      if (error && error.status === 401) {
        toSamlLogin();
      }
    },
    handleFormatError() {
      this.$emit('on-uploaded', { status: 'error' });
      this.$Message.error('文件格式错误，仅支持.png/.jpg/.jpeg');
    },
    handleMaxSize() {
      this.$emit('on-uploaded', { status: 'error' });
      this.$Message.error('文件过大，请确保文件小于2M');
    }
  },
  mounted() {}
};
</script>

<style scoped>
.padding {
  padding: 10px;
  border-spacing: 15px;
  width: 100%;
  font-size: 16px;
}
.avatar {
  height: 178px;
  display: block;
}
</style>
