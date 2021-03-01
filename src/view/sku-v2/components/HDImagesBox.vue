<template lang="pug">
  section.hd-images-box
      Row
        Col(:span="8", :gutter="5")
          UploadImage(
          :image-url="form.front_url",
          :loading="loadingStatus['front_url']",
          text="上传前视图",
          size="default",
          :showImg="true",
          :action="UPLOAD_SKU_IMAGE"
          @on-uploading="loadingStatus['front_url'] = true",
          @on-uploaded="uploadedHandle($event, 'front_url')",
          )
        Col(:span="8", :gutter="5")
          UploadImage(
          :image-url="form.back_url",
          :loading="loadingStatus['back_url']",
          size="default",
          text="上传后视图",
          :showImg="true",
          :action="UPLOAD_SKU_IMAGE"
          @on-uploading="loadingStatus['back_url'] = true",
          @on-uploaded="uploadedHandle($event,'back_url')",
          )
        Col(:span="8", :gutter="5")
          UploadImage(
          :image-url="form.left_url",
          :loading="loadingStatus['left_url']",
          text="上传左视图",
          size="default",
          :showImg="true",
          :action="UPLOAD_SKU_IMAGE"
          @on-uploading="loadingStatus['left_url'] = true",
          @on-uploaded="uploadedHandle($event,'left_url')",
          )
      Row
        Col(:span="8", :gutter="5")
          UploadImage(
          :image-url="form.right_url",
          :loading="loadingStatus['right_url']",
          text="上传右视图",
          size="default",
          :showImg="true",
          :action="UPLOAD_SKU_IMAGE"
          @on-uploading="loadingStatus['right_url'] = true",
          @on-uploaded="uploadedHandle($event,'right_url')",
          )
        Col(:span="8", :gutter="5")
          UploadImage(
          :image-url="form.top_url",
          :loading="loadingStatus['top_url']",
          size="default",
          text="上传顶视图",
          :showImg="true",
          :action="UPLOAD_SKU_IMAGE"
          @on-uploading="loadingStatus['top_url'] = true",
          @on-uploaded="uploadedHandle($event,'top_url')",
          )
        Col(:span="8", :gutter="5")
          UploadImage(
          :image-url="form.bottom_url",
          :loading="loadingStatus['bottom_url']",
          text="上传底视图",
          size="default",
          :showImg="true",
          :action="UPLOAD_SKU_IMAGE"
          @on-uploading="loadingStatus['bottom_url'] = true",
          @on-uploaded="uploadedHandle($event,'bottom_url')",
          )
</template>


<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import UploadImage from '@/view/sku/UploadImage.vue';
import { UPLOAD_SKU_IMAGE } from '@/api/sku';
import { proposalHdImageMap } from '@/const/data/sku';

@Component({
  components: { UploadImage }
})
export default class HDImagesBox extends Vue {
  @Prop() urls!: any;
  UPLOAD_SKU_IMAGE: string = UPLOAD_SKU_IMAGE;
  form: any = {
    front_url: undefined,
    back_url: undefined,
    left_url: undefined,
    right_url: undefined,
    top_url: undefined,
    bottom_url: undefined
  };
  loadingStatus: any = {
    front_url: false,
    back_url: false,
    left_url: false,
    right_url: false,
    top_url: false,
    bottom_url: false
  };
  changeStatus: any = {
    front_url: false,
    back_url: false,
    left_url: false,
    right_url: false,
    top_url: false,
    bottom_url: false
  };

  @Watch('form', { deep: true })
  formValueChange(form: any) {
    try {
      Object.keys(form).forEach((e: any) => {
        if (!form[e]) throw new Error(`${e} value is undefined`);
      });
      this.$emit('ok');
    } catch (e) {}
  }

  @Watch('urls')
  urlsChange(urls: any) {
    if (urls) {
      proposalHdImageMap.forEach((key: string) => {
        this.form[key] = urls[key];
        if (urls[key]) {
          this.changeStatus[key] = true;
        }
      });
    }
  }

  public getImages() {
    const data: any = {};
    Object.keys(this.changeStatus).forEach((key: any) => {
      if (this.changeStatus[key] === true) {
        data[key] = this.form[key];
      }
    });
    return { ...data };
  }

  uploadedHandle({ status, imageId }: any, type: string) {
    if (status === 'success') {
      this.form[type] = imageId;
      this.changeStatus[type] = true;
    }
    this.loadingStatus[type] = false;
  }
}
</script>

<style lang="scss">
.hd-images-box {
  .avatar {
    max-width: 100%;
  }
}
</style>
