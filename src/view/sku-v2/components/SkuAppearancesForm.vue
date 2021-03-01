<template lang="pug">
  Form(:ref="formName", :model="form", :rules="rules", :label-width="100")
    FormItem(label="包装名称:", prop="appearance_name")
      Input(v-model="form.appearance_name", :maxlength="16")
    FormItem.pr(label="商品条码:", prop="barcodes")
      Input(v-model="form.barcodes", placeholder="填写多条需要用英文逗号,分割")
    FormItem(label="包装示例图:", prop="appearance_url")
      UploadImage(
      :image-url="form.appearance_url",
      :loading="uploadLoading",
      size="default",
      :showImg="true",
      :action="UPLOAD_SKU_IMAGE"
      @on-uploading="uploadLoading = true",
      @on-uploaded="uploadedHandle",
      ref="uploadBox"
      )
    FormItem(label="多角度高清图:", prop="hdimages")
      HDImagesBox(ref="HDImagesBoxRef", @ok="HDOkHandle", :urls="hd_infos")
    FormItem(label="包装简介(可选):", prop="appearance_desc")
      Input(type="textarea", v-model="form.appearance_desc")
    FormItem
      Button(@click="preStepHandle") 上一步
      Button.ml20(type="primary", @click="submit", :loading="submitting") 提交
</template>


<script lang="ts">
import Component, { mixins } from 'vue-class-component';
import ValidFormMixin, { ValidFormOptions } from '@/mixins/validForm';
import { DefaultApiType } from '@/interface';
import { of } from 'rxjs';
import UploadImage from '@/view/sku/UploadImage.vue';
import { ProposalData, UPLOAD_SKU_IMAGE } from '@/api/sku';
import { Form } from 'iview';
import HDImagesBox from '@/view/sku-v2/components/HDImagesBox.vue';
import { Prop, Watch } from 'vue-property-decorator';
import { proposalHdImageMap } from '@/const/data/sku';

@Component<any>({
  components: { HDImagesBox, UploadImage },
  data() {
    return {
      rules: {
        appearance_name: [{ required: true, message: '必填', trigger: 'blur' }],
        appearance_url: [{ required: true, message: '必填', trigger: 'blur' }],
        barcodes: [{ required: true, message: '必填', trigger: 'blur' }],
        hdimages: [
          {
            required: true,
            message: '请上传完整多角度高清图',
            trigger: 'change'
          }
        ]
      }
    };
  }
})
export default class SkuAppearancesForm extends mixins(ValidFormMixin)
  implements ValidFormOptions {
  @Prop() submitting!: boolean;
  @Prop() proposal!: ProposalData;
  formApi: DefaultApiType = () => of(true);
  formName: string = 'createSku';
  form: any = {
    appearance_name: undefined,
    barcodes: undefined,
    hdimages: undefined,
    appearance_url: undefined,
    appearance_desc: undefined
  };
  hd_infos: any = {};
  uploadLoading: boolean = false;
  UPLOAD_SKU_IMAGE: string = UPLOAD_SKU_IMAGE;

  @Watch('proposal')
  proposalChange(proposal: ProposalData) {
    if (proposal) {
      this.form.barcodes = proposal.barcodes;
      this.form.appearance_url = proposal.front_url;
      proposalHdImageMap.forEach((key: string) => {
        this.$set(this.hd_infos, key, (proposal as any)[key]);
      });
    }
  }

  transformFormParams() {
    return { ...this.form };
  }

  preStepHandle() {
    this.$router.replace({
      name: 'v2-sku-create',
      query: { ...this.$route.query, step: '1' }
    });
  }

  submit() {
    this.validAndHandleForm$().subscribe(() => {
      if (this.proposal) {
        this.$emit('next', {
          approval_appearance: {
            appearance_name: this.form.appearance_name,
            appearance_url: this.form.appearance_url,
            barcodes: this.form.barcodes
              ? this.form.barcodes.split(',')
              : undefined,
            appearance_desc: this.form.appearance_desc,
            ...this.hd_infos
          }
        });
      } else {
        this.$emit('next', {
          sku_appearance: {
            appearance_name: this.form.appearance_name,
            appearance_url: this.form.appearance_url,
            barcodes: this.form.barcodes
              ? this.form.barcodes.split(',')
              : undefined,
            appearance_desc: this.form.appearance_desc,
            hd_infos: { ...this.hd_infos }
          }
        });
      }
    });
  }

  uploadedHandle({ status, imageId }: any) {
    if (status === 'success') {
      const formRef = this.$refs[this.formName] as Form;
      this.form.appearance_url = imageId;
      formRef.validateField('appearance_url');
    }
    this.uploadLoading = false;
  }

  HDOkHandle() {
    const formRef = this.$refs[this.formName] as Form;
    const HDImagesRef = this.$refs['HDImagesBoxRef'] as HDImagesBox;
    this.form.hdimages = 'ok';
    formRef.validateField('hdimages');
    this.hd_infos = { ...HDImagesRef.getImages() };
  }
}
</script>
