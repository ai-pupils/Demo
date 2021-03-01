<template lang="pug">
  section
    GoBack
    Card(title="新建商品及包装")
      Row(style="margin-bottom: 50px")
        Col(:span="20", :offset="4")
          Steps(:current="step")
            Step(title="填写商品信息")
            Step(title="确认商品分类")
            Step(title="填写包装信息")
            Step(title="完成")
      Row(v-show="step===0")
        Col(:span="9", :offset="6")
          SkuForm(@next="skuFormSuccessHandle", :proposal="proposalInfo")
      Row(v-show="step===1")
        Col(:span="18", :offset="3")
          ChooseSkuCategory(@next="ChooseSkuTypesHandle", :proposal="proposalInfo")
      Row(v-show="step===2")
        Col(:span="9", :offset="6")
          SkuAppearancesForm(@next="SkuAppearancesFormSuccessHandle", :submitting="state.isFetching", :proposal="proposalInfo")
      div(v-if="step===3", style="width: 500px; margin: 0 auto;")
          Alert(type="success", show-icon)
            div(style="text-align: left;") 操作成功
            div(slot="desc") 已完成新商品与包装的创建
          Form(:label-width="140")
            FormItem(label="商品名称:") {{skuName}}
            FormItem.pr(label="包装名称:", style="top:-25px") {{appearanceName}}
          div.text-center
            Button(@click="goVerify") 完成

</template>

<script lang="ts">
import Component, { mixins } from 'vue-class-component';
import GoBack from '@/components/shared/GoBack.vue';
import { Watch } from 'vue-property-decorator';
import SkuForm from './components/SkuForm.vue';
import SkuAppearancesForm from '@/view/sku-v2/components/SkuAppearancesForm.vue';
import { createSku$, getSkuProposals$, verifySkuProposal$ } from '@/api/sku';
import ComponentOptionsMixin from '@/mixins/componentOptions';
import { finalize, mergeMap } from 'rxjs/operators';
import { MetaType } from '@/interface';
import { Prop } from 'vue-property-decorator';
import ChooseSkuCategory
  from "@/view/sku-bundle-v2/components/ChooseSkuCategory.vue";

@Component({
  components: { SkuAppearancesForm, ChooseSkuCategory, SkuForm, GoBack }
})
export default class SkuCreate extends mixins(ComponentOptionsMixin) {
  @Prop() proposalId!: string;
  step: number = 0;
  skuFormValid: boolean = false;
  skuAppearancesValid: boolean = false;
  skuTypesValid: boolean = false;
  form: any = {};
  submitting: boolean = false;
  proposalInfo: any = null;

  @Watch('$route.query.step', { deep: true, immediate: true })
  stepChange(stepValue: any) {
    if (stepValue) {
      this.step = Number(stepValue);
      if (stepValue === '1' || stepValue === '2') {
        if (!this.skuFormValid) {
          this.$router.replace({
            name: 'v2-sku-create',
            query: { ...this.$route.query, step: '0' }
          });
        }
      }
    }
  }

  get skuName() {
    if (this.proposalId) {
      return this.form.approval_sku.sku_info.sku_name;
    }
    return this.form.sku.sku_name;
  }

  get appearanceName() {
    if (this.proposalId) {
      return this.form.approval_appearance.appearance_name;
    }
    return this.form.sku_appearance.appearance_name;
  }

  created() {
    if (this.proposalId) {
      getSkuProposals$({ proposalId: this.proposalId }).subscribe(state => {
        if (state.isFulfill) {
          this.proposalInfo = state.payload!.data.sku_proposals[0];
        }
      });
    }
  }

  mounted() {
    this.state.isFetching = false;
  }

  skuFormSuccessHandle(skuForm: any) {
    this.skuFormValid = true;
    this.form = { ...skuForm };
  }

  ChooseSkuTypesHandle(form: any) {
    this.skuTypesValid = true;
    this.form.approval_sku.sku_info.ingression_type = form.ingression_type;
    this.form.approval_sku.sku_info.vision_type = form.vision_type;
  }

  SkuAppearancesFormSuccessHandle(appearancesForm: any) {
    this.skuAppearancesValid = true;
    this.form = { ...this.form, ...appearancesForm };

    if (this.proposalId) {
      this.form.status = 'approval';
    }

    this.startFetch$()
      .pipe(
        mergeMap(() => {
          return this.proposalId
            ? verifySkuProposal$({ ...this.form, proposal_id: this.proposalId })
            : createSku$({ ...this.form });
        }),
        finalize<MetaType<any>>(() => this.endFetch())
      )
      .subscribe(state => {
        this.state = state;
        if (state.isFulfill) {
          this.$router.replace({
            name: 'v2-sku-create',
            query: { ...this.$route.query, step: '3' }
          });
        }
      });
  }

  goVerify() {
    this.$router.replace({ name: 'v2-sku-list' });
  }
}
</script>
