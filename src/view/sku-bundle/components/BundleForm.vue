<template>
    <div>
        <Form ref="form" :model="form" :rules="rules" label-position="right" :label-width="100">
            <FormItem label="绑定商户ID" prop="dealerId">
                <Input v-model="form.dealerId" placeholder="请输入商户ID"></Input>
            </FormItem>
             <FormItem label="商品组名称" prop="name">
                <Input v-model="form.name" placeholder="请输入商品组名称"></Input>
            </FormItem>
            <FormItem label="商品组描述" prop="description">
                <Input v-model="form.description" placeholder="请输入商品组描述"></Input>
            </FormItem>
            <FormItem label="货柜类型" prop="cabinetTypeId">
              <Select v-model="form.cabinetTypeId" style="width:200px" placeholder="请选择货柜类型">
                <Option v-for="item in cabinetType" :value="String(item.id)" :key="item.id">{{ item.name }}</Option>
              </Select>
            </FormItem>
            <FormItem>
                <Button type="primary" @click="submit('form')" :loading="isSubmit">确认无误，添加商品</Button>
                <Button@click="goBack">取消</Button>
            </FormItem>
        </Form>
    </div>
</template>
<script>
import { postSkuBundles$ } from '../../../api/sku-bundle';
import { getCabinetTypes$ } from '../../../api/cabinet';

export default {
  props: ['type'],
  data() {
    return {
      isSubmit: false,
      cabinetType: [],
      form: {
        dealerId: undefined,
        name: undefined,
        description: undefined,
        cabinetTypeId: undefined
      },
      rules: {
        dealerId: [
          { required: true, message: '请输入商户ID', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入商品组名称', trigger: 'blur' }
        ],
        cabinetTypeId: [
          { required: true, message: '请输入货柜类型', trigger: 'change' }
        ]
      }
    };
  },
  created() {
    getCabinetTypes$({}).subscribe(res => {
      const {
        payload: {
          data: { results }
        }
      } = res;
      this.cabinetType = results;
    });
  },
  methods: {
    submit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.isSubmit = true;
          postSkuBundles$({ ...this.form }).subscribe(res => {
            const bundle = res.payload.data.bundle;
            this.isSubmit = false;
            this.$Message.success(this.isUpdate ? '更新成功' : '保存成功');
            this.$router.push(
              `/sku-bundle/update/${bundle.id}?dealerId=${bundle.dealer_id}`
            );
          });
        }
      });
    },
    goBack() {
      window.history.go(-1);
    }
  }
};
</script>
