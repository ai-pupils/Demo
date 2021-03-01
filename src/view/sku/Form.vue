<template>
    <div>
        <Form
            ref="form"
            :model="form"
            :rules="rules"
            label-position="right"
            :label-width="120">
            <FormItem label="商品条码/编码" prop="barcode" >
                  <Input v-model="form.barcode" placeholder="请输入商品条码/编码" :disabled="isUpdate"></Input>
              </FormItem>
             <FormItem label="商品名称" prop="name">
                  <Input v-model="form.name" placeholder="请输入商品名称"></Input>
              </FormItem>
              <FormItem label="商品性质" prop="barcode_type">
                  <RadioGroup v-model="form.barcode_type" placeholder="请选择商品性质">
                      <Radio v-for="(barcode, index) in SkuBarcodeTypes" :key="barcode.id" :label="barcode.id" :disabled="isUpdate">{{barcode.label}}</Radio>
                  </RadioGroup>
              </FormItem>
              <FormItem label="包装类型" prop="package_type">
                  <RadioGroup v-model="form.package_type" placeholder="请选择包装类型">
                      <Radio v-for="(package_type, index) in SkuPackageTypes" :key="package_type.id" :label="package_type.id" :disabled="isUpdate">{{package_type.label}}</Radio>
                  </RadioGroup>
              </FormItem>
              <FormItem label="商品类型" prop="sku_type">
                  <RadioGroup v-model="form.sku_type" placeholder="请选择商品类型">
                      <Radio v-for="(sku_type, index) in SkuTypes" :key="sku_type.id" :label="sku_type.id" :disabled="isUpdate">{{sku_type.label}}</Radio>
                  </RadioGroup>
              </FormItem>
              <FormItem label="商品状态" prop="status" v-if="isUpdate">
                  <Select v-model="form.status" placeholder="请选择包装类型" :disabled="isUpdate">
                      <Option v-for="(status, index) in SkuStatus" :key="status.id" :value="status.id" >{{status.label}}</Option>
                  </Select>
              </FormItem>
              <!-- <FormItem label="商品重量">
                  <InputNumber v-model.number="form.weight" placeholder="请输入商品重量（选填）">
                    <span slot="append">g</span>
                  </InputNumber>
              </FormItem> -->
              <FormItem label="商品样例图" prop="url">
                  <UploadImage :action="UPLOAD_SKU_IMAGE" :image-url="imgUrl" @on-uploading="uploading" @on-uploaded="uploaded" ref="uploadBox" ></UploadImage>
              </FormItem>
              <FormItem>
                  <Button type="primary" @click="submit('form')" :loading="isSubmit">保存</Button>
                  <Button style="margin-left: 8px" @click="goBack()">返回</Button>
              </FormItem>
         </Form>
    </div>
</template>

<script>
import { mapActions } from 'vuex';
import {
  SkuPackageTypes,
  SkuBarcodeTypes,
  SkuStatus,
  SkuTypes
} from '../../const/data/sku';
import {
  getSku,
  createSku,
  updateSku,
  UPLOAD_SKU_IMAGE
} from '../../store/api/sku';
import { isValidBarcode$ } from '../../api/sku';
import UploadImage from './UploadImage';

export default {
  components: { UploadImage },
  props: {
    type: String
  },
  data() {
    const asyncBarcodeValidator = (rule, value, callback) => {
      if (this.isUpdate) {
        callback();
      } else {
        isValidBarcode$(value).subscribe(res => {
          const {
            payload: { data }
          } = res;
          if (data.existing === true && data.name) {
            return callback(new Error('商品已存在'));
          }
          return callback();
        });
      }
    };

    return {
      SkuTypes,
      SkuPackageTypes,
      SkuBarcodeTypes,
      SkuStatus,
      UPLOAD_SKU_IMAGE,
      isSubmit: false,
      isUploading: false,
      isUpdate: this.type === 'update',
      imgId: undefined, // 上传图片时需要传给接口的参数
      imgUrl: '', // 回显图片时用
      form: {
        name: '',
        barcode: '',
        barcode_type: '',
        package_type: '',
        // weight: '',
        status: 'available',
        image_name: undefined,
        url: '' // 校验是否有上传图片用
      },
      rules: {
        name: [
          {
            required: true,
            message: '请输入商品名称',
            trigger: 'blur'
          }
        ],
        barcode: [
          {
            required: true,
            message: '请输入商品条码/编码',
            trigger: 'blur'
          },
          {
            validator: asyncBarcodeValidator,
            trigger: 'blur'
          }
        ],
        barcode_type: [
          {
            required: true,
            message: '请选择商品性质',
            trigger: 'change'
          }
        ],
        package_type: [
          {
            required: true,
            message: '请选择包装类型',
            trigger: 'change'
          }
        ],
        sku_type: [
          {
            required: true,
            message: '请选择商品类型',
            trigger: 'change'
          }
        ],
        status: [
          {
            required: true,
            message: '请选择商品状态',
            trigger: 'change'
          }
        ],
        url: [
          {
            required: true,
            message: '请上传商品样例图',
            trigger: 'change'
          }
        ]
      }
    };
  },
  mounted() {
    if (this.isUpdate) {
      getSku(this.$route.params.id).then(({ data }) => {
        this.form.barcode = data.barcode;
        this.form.barcode_type = data.barcode_type;
        this.form.package_type = data.package_type;
        this.form.name = data.name;
        this.form.status = data.status;
        this.form.sku_type = data.sku_type;
        // this.form.weight = data.weight;

        if (data.url) {
          this.imgUrl = data.url;
          this.form.url = data.url;
        }
      });
    }
  },
  methods: {
    ...mapActions('sku', ['getSkus']),
    createSku,
    updateSku,
    submit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.isSubmit = true;
          if (this.imgId) {
            this.form.image_name = this.imgId;
          }
          delete this.form.url; // 删除无用参数
          // if (this.form.weight) {
          //   this.form.weight = Number(this.form.weight);
          // } else {
          //   delete this.form.weight;
          // }
          if (this.isUpdate) {
            updateSku(this.$route.params.id, this.form).then(({ status }) => {
              if (status === 0) {
                this.isSubmit = false;
                this.$Message.success('更新成功');
                this.$router.push('/sku/list');
              }
            });
          } else {
            createSku(this.form).then(({ status }) => {
              if (status === 0) {
                this.isSubmit = false;
                this.$Message.success('保存成功');
                this.$router.push('/sku/list');
              }
            });
          }
        }
      });
    },
    uploading() {
      this.isFetching = true;
    },
    uploaded({ imageId }) {
      if (imageId) {
        this.imgId = imageId;
        this.form.url = imageId;
      }
      this.$refs.form.validateField('url');
      this.isFetching = false;
    },
    goBack() {
      history.go(-1);
    }
  }
};
</script>

<style lang="less" scoped>
</style>
