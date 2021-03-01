<template lang="pug">
  Card(title="激活新的活动指南", dis-hover, :bordered="false")
    Row.info-box
      Form(:model="formData", inline, :label-width='100', label-position='left', ref="form" :rules="ruleValidate")
        Col(span='8')
          FormItem(label='上新类型：', prop="ingressionType")
            Select(v-model="formData.ingressionType")
              Option(v-for="item in ingressionTypes" :value="item.id" :key="item.id")
                | {{item.id}} - {{ item.name }}
        Col(span='8')
          FormItem(label='视觉 ID：', prop="visionId")
            Input(v-model="formData.visionId", type="number", placeholder="请输入视觉 ID")
        Col(span='8')
          FormItem(label='指南 ID：', prop="guideId")
            Input(v-model="formData.guideId", type="number", placeholder="请输入指南 ID")
    Row.text-right
      Button(type="text", @click="cancel")
        | 取消
      Button(type="primary", @click="submit")
        | 确定
</template>
<script lang="ts">
import Vue from 'vue'
import { getSkuIngressionTypes$ } from '@/api/v2/skus';
import Component, {mixins} from 'vue-class-component';

@Component({})
export default class NewDispatch extends Vue{
  ingressionTypes: Array<any> = []
  visions: Array<any> = []
  formData: {ingressionType: null|number, visionId: null|string, guideId: null|number} = {
    ingressionType: null,
    visionId: null,
    guideId: null
  }
  get ruleValidate() {
    return {
      ingressionType: {required: true, type: 'number', message: '上新类型是必填的', trigger: 'blur' },
      visionId: { required: true, message: '视觉 ID 是必填的', trigger: 'blur' },
      guideId: { required: true, message: '指南 ID 是必填的', trigger: 'blur' }
    }
  }
  cancel() {
    this.$emit('cancel')
  }
  submit() {
    (this.$refs.form as any).validate((isValid: any) => {
      if (isValid) {
        const {formData} = this
        const data = {...formData, guideId: Number(formData.guideId)}
        this.$emit('submit', data)
      } else {
        this.$Message.error('请完善表单信息');
      }
    });
  }
  mounted() {
    getSkuIngressionTypes$().subscribe((state: any) => {
      if (state.isFulfill) {
        const {payload: {data: { ingression_types }}} = state;
        this.ingressionTypes = ingression_types;
      }
    });
  }
}
</script>
