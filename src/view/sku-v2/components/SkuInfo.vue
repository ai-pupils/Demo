<template lang="pug">
  section
    Form(:ref="formName", :model="form", :rules="rules", inline, :label-width='110', label-position='left')
      Row.info-title 基本信息
      Row.info-box
        Col(span='8')
          FormItem(label='商品ID:') {{data.sku_id}}
        Col(span='8')
          FormItem(label='商品类型:') {{data.sku_type | getSkuTypes | empty}}
        Col(span="8")
          FormItem(label="商品高度:") {{data.length | empty}}
      Row.info-box
        Col(span="8")
          FormItem(label="原产国:") {{data.coc | CocFilter | empty}}
        Col(span="8")
          FormItem(label="包装类型:") {{data.package_type | getSkuPackageTypes | empty}}
        Col(span="8")
          FormItem(label="商品宽度:") {{data.width | empty}}
      Row.info-box
        Col(span="8")
          FormItem(label="商标:") {{(data.trade_mark_cn || data.trade_mark_en) | empty}}
        Col(span="8")
          FormItem(label="商品性质:") {{data.barcode_type | getSkuBarcodeTypes | empty}}
        Col(span="8")
          FormItem(label="商品厚度:") {{data.thickness | empty}}
      Row.info-box
        Col(span="8")
          FormItem(label="商品名称:", prop="sku_name")
            Input(v-model="form.sku_name")
        Col(span="8")
          FormItem(label="商品重量(可选):")
            Input(v-model="form.weight")
              span(slot="append") g
      Row.info-box
        Col(span="8")
          FormItem(label="备注:", prop="comment")
            Input(v-model="form.comment", type="textarea", placeholder="请输入备注")
      Row.info-title 商品分类
      Row.info-box
        Col(span="8")
          FormItem(label="采集类型:") {{(data.ingression_type && data.ingression_type.name) | empty}}
        Col(span="8")
          FormItem(label="视觉类型:") {{(data.vision_type && data.vision_type.name) | empty}}
      Row.info-title 商品图片
      Row.info-box
        Col(span="24")
          FormItem(label="商品示例图:", style="width:100%", prop="sku_url")
            //.mb20
              LazyLoadImg.pr.img-example(style="min-height:20px", :src="data.sku_url")
            div.clearfix
              <!--Input.fl(v-model="fetchImgSrc", style="width:300px")-->
              <!--Button.fl.ml5(type="primary", @click="fetchImgSrcHandle") 获取-->
              UploadImage.fl.ml5(
              :image-url="form.sku_url",
              :loading="uploadLoading",
              text="本地上传",
              size="default",
              :showImg="true",
              :action="UPLOAD_SKU_IMAGE"
              @on-uploading="uploadLoading = true",
              @on-uploaded="uploadedHandle",
              ref="uploadBox")
            <!--div(v-if="fetchImages.length > 0") 请在以下图片中选择一张作为该商品示例图-->
              <!--Row.mb10-->
                <!--Col(span="4", style="text-align:center")-->
                  <!--LazyLoadImg.img-example(src="http://placehold.it/300x300")-->
                  <!--div-->
                    <!--Button(style="margin-top: 10px") 应用-->
              <!--Row-->
                <!--Col(span="4", style="text-align:center")-->
                  <!--LazyLoadImg.img-example(src="http://placehold.it/300x300")-->
                  <!--div-->
                    <!--Button(style="margin-top: 10px") 应用-->
</template>


<script lang="ts">
import Component, { mixins } from 'vue-class-component';
import { DefaultApiType, MetaType } from '@/interface';
import { Model, Prop, Watch } from 'vue-property-decorator';
import { GetSkuData, updateSku$, UPLOAD_SKU_IMAGE } from '@/api/sku';
import UploadImage from '@/view/sku/UploadImage.vue';
import LazyLoadImg from '@/components/shared/LazyloadImg.vue';
import ValidFormMixin, { ValidFormOptions } from '@/mixins/validForm';
import { Form } from 'iview';

@Component({
  components: { UploadImage, LazyLoadImg },
  data() {
    return {
      rules: {
        sku_name: [{ required: true, message: '必填', trigger: 'blur' }],
        sku_url: [{ required: true, message: '必填', trigger: 'blur' }]
      }
    };
  }
})
export default class SkuInfo
  extends mixins<ValidFormMixin<any, MetaType>>(ValidFormMixin)
  implements ValidFormOptions {
  @Prop() data!: GetSkuData;
  @Model('change', { type: Boolean, default: false })
  submitStatus!: boolean;
  formApi: DefaultApiType = updateSku$;
  form: any = {
    sku_name: undefined,
    weight: undefined,
    sku_url: undefined,
    comment: undefined
  };
  imageUrl: string = '';
  formName: string = 'skuForm';
  UPLOAD_SKU_IMAGE: string = UPLOAD_SKU_IMAGE;
  uploadLoading: boolean = false;

  transformFormParams() {
    return { ...this.form, id: this.data.sku_id };
  }

  @Watch('data', { immediate: true })
  dataChange(v: GetSkuData) {
    if (v) {
      this.state.isFetching = false;
      this.form.sku_name = v.sku_name;
      this.form.weight = v.weight;
      this.form.sku_url = v.sku_url;
      this.form.comment = v.comment;
    }
  }

  @Watch('state.isFetching', { deep: true, immediate: true })
  isFetchingChange(v: boolean) {
    this.$emit('change', v);
  }

  public submit() {
    this.validAndHandleForm$().subscribe({
      next: ({ isFulfill }) => {
        if (isFulfill) {
          this.$Message.success('保存成功');
        }
      }
    });
  }

  uploadedHandle({ status, imageId }: any) {
    if (status === 'success') {
      const formRef = this.$refs[this.formName] as Form;
      this.form.sku_url = imageId;
      formRef.validateField('sku_url');
    }
    this.uploadLoading = false;
  }
}
</script>

<style lang="scss" scoped>
.img-thumb {
  height: 100px;
}
</style>
