<template lang="pug">
  section
    Modal(v-model="visible", title="废弃当前proposal", @on-visible-change="visibleChange")
      RadioGroup.mb10(v-model="selectedStatus")
        Radio(label="refused") 审核不通过
        Radio(label="existed") 已存在相似商品包装
      Form(:ref="formName", :model="form", :rules="rules", :label-width="90")
        FormItem(v-show="!isExisted", label='拒绝原因：', prop='refusedReason')
          Select(v-model="form.refusedReason" style="width: 50%")
            Option(v-for="item in skuRefusedReason" :value="item.value" :key="item.value") {{ item.label }}
        FormItem(v-show="isExisted", label="商品包装ID:", prop="appearancesId")
          Input(v-model="form.appearancesId", style="width: 50%")
      div(slot="footer")
        Button(@click="visible=false") 取消
        Button(type="primary", @click="deleteProposal", :loading="isFetching") 确定
</template>


<script lang="ts">
import Component, { mixins } from 'vue-class-component';
import ValidFormMixin, { ValidFormOptions } from '@/mixins/validForm';
import { DefaultApiType, MetaType } from '@/interface';
import { verifySkuProposal$, ProposalData } from '@/api/sku';
import { Prop } from 'vue-property-decorator';
import { skuRefusedReason } from '@/const/data/sku';

@Component<any>({
  data() {
    const checkError = (rule: any, value: any, callback: any) => {
      if ((this as any).isExisted && !value) {
        return callback(new Error('必填'));
      }
      callback();
    };
    const checkRefusedReason = (rule: any, value: any, callback: any) => {
      if (!(this as any).isExisted && !value) {
        return callback(new Error('必填'));
      }
      callback();
    };

    return {
      rules: {
        appearancesId: [
          { required: true, validator: checkError, trigger: 'blur' }
        ],
        refusedReason: [
          { required: true, validator: checkRefusedReason, trigger: 'blur' }
        ]
      }
    };
  }
})
export default class VerifyProposalModal
  extends mixins<ValidFormMixin<any, MetaType>>(ValidFormMixin)
  implements ValidFormOptions {
  @Prop({ default: () => ({}) })
  proposalInfo!: ProposalData;
  selectedStatus: string = 'existed';
  formApi: DefaultApiType = verifySkuProposal$;
  formName: string = 'form';
  form: any = {
    appearancesId: undefined,
    refusedReason: undefined
  };
  visible: boolean = false;
  skuRefusedReason = skuRefusedReason;

  mounted() {
    this.state.isFetching = false;
  }

  transformFormParams() {
    return {
      proposal_id: this.proposalInfo ? this.proposalInfo.id : undefined,
      status: this.selectedStatus,
      appearance_id: this.form.appearancesId,
      refused_reason: this.form.refusedReason
    };
  }

  get isExisted() {
    return this.selectedStatus === 'existed';
  }

  public open() {
    this.visible = true;
  }

  public close() {
    this.visible = false;
  }

  visibleChange(visible: boolean) {
    if (visible === false) {
      (this.$refs[this.formName] as any).resetFields();
    }
  }

  deleteProposal() {
    this.validAndHandleForm$().subscribe({
      next: ({ isFulfill, payload }) => {
        if (isFulfill && payload) {
          if (payload!.data!.error_code === 200) {
            this.$Message.success('操作成功');
            this.$emit('ok');
          }
        }
      }
    });
  }
}
</script>
