<template lang="pug">
  section
    Form(:ref="formName", :model="form", :rules="rules", inline, :label-width='110', label-position='left')
      Row.info-title 基本信息
      Row.info-box
        Col(span='8')
          FormItem(label='商品包装ID:') {{data.id}}
      Row.info-box
        Col(span="8")
          FormItem(label="包装名称:", prop="appearance_name")
            Input(v-model="form.appearance_name")
      Row.info-box
        Col(span="8")
          FormItem(label="商品条码:")
            | {{form.barcodes}}
            <!--Input(v-model="form.barcodes", placeholder="填写多条需要用英文逗号,分割")-->
      Row.info-box
        Col(span="8")
          FormItem(label="包装简介(可选):")
            Input(v-model="form.appearance_desc")
      Row.info-title 商品图片
      Row.info-box
        Col(span="24")
          FormItem(label="包装示例图:", prop="appearanceImage", style="width:100%")
            div.clearfix
              UploadImage.fl.ml5(
              :image-url="form.appearanceImage",
              :loading="uploadLoading",
              size="default",
              :showImg="true",
              :action="UPLOAD_SKU_IMAGE"
              @on-uploading="uploadLoading = true",
              @on-uploaded="uploadedHandle",
              ref="uploadBox")
          FormItem(label="多角度高清图", prop="hdimages", style="width:100%")
            HDImagesBox(ref="HDImagesBoxRef", :urls="hdImagesUrl", @ok="HDOkHandle")
</template>


<script lang="ts">
import Component, { mixins } from 'vue-class-component';
import { DefaultApiType, MetaType } from '@/interface';
import { Model, Prop, Watch } from 'vue-property-decorator';
import { updateSkuAppearaces$, UPLOAD_SKU_IMAGE } from '@/api/sku';
import UploadImage from '@/view/sku/UploadImage.vue';
import LazyLoadImg from '@/components/shared/LazyloadImg.vue';
import ValidFormMixin, { ValidFormOptions } from '@/mixins/validForm';
import HDImagesBox from '@/view/sku-v2/components/HDImagesBox.vue';

@Component({
  components: { HDImagesBox, UploadImage, LazyLoadImg },
  data() {
    return {
      rules: {
        appearance_name: [{ required: true, message: '必填', trigger: 'blur' }]
      }
    };
  }
})
export default class AppearancesInfo
  extends mixins<ValidFormMixin<any, MetaType>>(ValidFormMixin)
  implements ValidFormOptions {
  @Prop() data!: any;
  @Model('change', { type: Boolean, default: false })
  submitStatus!: boolean;
  formApi: DefaultApiType = updateSkuAppearaces$;
  form: any = {
    sku_id: undefined,
    id: undefined,
    appearance_name: undefined,
    weight: undefined,
    barcodes: undefined,
    appearance_desc: undefined,
    appearance_url: undefined,
    hdimages: undefined,
    appearanceImage: undefined
  };
  hd_infos: any = {};
  hdImagesUrl: any = {};
  formName: string = 'AppearancesForm';
  UPLOAD_SKU_IMAGE: string = UPLOAD_SKU_IMAGE;
  uploadLoading: boolean = false;

  transformFormParams() {
    return {
      ...this.form,
      id: this.data.id,
      hd_infos: { ...this.hd_infos },
      barcodes: this.form.barcodes ? this.form.barcodes.split(',') : undefined
    };
  }

  @Watch('data', { immediate: true })
  dataChange(v: any) {
    if (v) {
      this.state.isFetching = false;
      this.form.id = v.id;
      this.form.sku_id = v.sku_id;
      this.form.appearance_name = v.appearance_name;
      this.form.appearanceImage = v.appearance_url;
      this.form.weight = v.weight ? v.weight : undefined;
      this.form.appearance_desc = v.appearance_desc;
      this.form.barcodes = v.barcodes;
      this.hdImagesUrl = {
        front_url: v.front_url,
        back_url: v.back_url,
        left_url: v.left_url,
        right_url: v.right_url,
        top_url: v.top_url,
        bottom_url: v.bottom_url
      };
    }
  }

  @Watch('state.isFetching', { deep: true, immediate: true })
  isFetchingChange(v: boolean) {
    this.$emit('change', v);
  }

  public submit() {
    return this.validAndHandleForm$();
  }

  uploadedHandle({ status, imageId }: any) {
    if (status === 'success') {
      this.form.appearance_url = imageId;
    }
    this.uploadLoading = false;
  }

  HDOkHandle() {
    const HDImagesRef = this.$refs['HDImagesBoxRef'] as HDImagesBox;
    this.hd_infos = { ...HDImagesRef.getImages() };
  }
}
</script>

<style lang="scss" scoped>
.img-thumb {
  height: 100px;
}
</style>
