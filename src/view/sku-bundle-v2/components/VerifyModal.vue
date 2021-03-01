<template lang="pug">
  section
    Modal(v-model='visible', @on-ok='submit', @on-cancel="closeHandle")
      div(slot='header') 提交审核结果
      Form(:label-width='90', :model='putData', :rules='rules', ref='initForm')
        FormItem(label='审核状态：', prop='status')
          RadioGroup(v-model="putData.status",  type="button")
            Radio(label="ACCEPTED", :disabled="!canAccepted") 审核通过
            Radio(label="REJECTED") 审核未通过
        FormItem(label='审核备注：', prop='comment')
          Input(v-model='putData.audited_comment', type='textarea', :rows='4',
            placeholder='请输入审核备注')
      div(slot='footer')
        Button(type='text', @click='closeHandle') 取消
        Button(type='primary', @click='submit', :loading='loading') 确认
</template>

<script lang="ts">
import Vue from 'vue';
import { Component, Prop, Provide } from 'vue-property-decorator';
import { updateSkuBundleV2$, UpdateSkuBundleV2Params } from '@/api/sku-bundle';
import { finalize } from 'rxjs/operators';
import { skuBundleReviewedStatus } from '@/const/data/sku-bundle';
import { State } from 'vuex-class';

@Component({})
export default class VerifyModal extends Vue {
  @State('profile') user!: any;

  visible: boolean = false;
  rowData: any = {};
  @Prop() faultType!: string;
  @Prop() id!: number;
  @Prop() logs!: any[];
  bundleStatus = skuBundleReviewedStatus;
  putData: UpdateSkuBundleV2Params = {
    id: this.id,
    dealer_id: 0,
    audited_comment: '',
    audited_status: '',
    status: '',
    exclusive_items: []
  };
  isCanSubmit: boolean = true;
  loading: boolean = false;

  open(dealer_id: number, audited_status: string, items: string[]) {
    this.putData.dealer_id = dealer_id;
    this.putData.audited_status = audited_status;
    this.putData.exclusive_items = items;
    this.visible = true;
  }

  get rules() {
    return {
      status: [{ required: true, message: '请选择审核状态', trigger: 'change' }]
    };
  }

  get canAccepted() {
    return (
      !this.putData.exclusive_items || this.putData.exclusive_items.length === 0
    );
  }

  closeHandle() {
    this.visible = false;
    (this.$refs.initForm as any).resetFields();
  }

  submit() {
    (this.$refs.initForm as any).validate((isValid: any) => {
      if (isValid) {
        this.loading = true;
        this.confirmHandle();
      } else {
        this.$Message.error('请完善表单信息！');
      }
    });
  }

  checkOperator(step: string): boolean {
    if (step === 'FIRST') return true;

    const {
      payload: {
        data: { account }
      }
    } = this.user;

    if (step === 'SECOND') {
      const [first] = this.logs;
      if (first.operator_name === account) {
        this.$Message.error('请勿重复审核该商品组');
        return false;
      }
      return true;
    }

    if (step === 'THIRD') {
      const [first, second] = this.logs;
      if (first.operator_name === account || second.operator_name === account) {
        this.$Message.error('请勿重复审核该商品组');
        return false;
      }
      return true;
    }

    return false;
  }

  confirmHandle() {
    if (!this.checkOperator(this.putData.audited_status as string)) {
      this.loading = false;
      return;
    }

    updateSkuBundleV2$({
      ...this.putData,
      audited_status: this.putData.status + '_' + this.putData.audited_status,
      status: undefined
    })
      .pipe(
        finalize(() => {
          this.isCanSubmit = true;
          this.loading = false;
        })
      )
      .subscribe({
        next: state => {
          if (!state.isError && state.payload) {
            this.$Message.success('审核完成');
            this.$router.replace({
              name: 'v2-sku-bundle-verify-detail',
              params: { id: this.id.toString() }
            });
          }
          this.closeHandle();
        }
      });
  }
}
</script>

<style scoped></style>
