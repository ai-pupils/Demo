<template lang="pug">
  section
    GoBack
    Card(title="新建包装")
      Row(style="margin-bottom: 50px")
        Col(span="8") &nbsp;
        Col(span="16")
          Steps(:current="step")
            Step(title="填写包装信息")
            Step(title="完成")
      Row(v-show="step===0")
        Col(span="8") &nbsp;
        Col(span="9")
          SkuAppearancesForm(@next="SkuAppearancesFormSuccessHandle",
          :submitting="state.isFetching", :skuId="skuId", :proposalInfo="proposalInfo")
      div(v-if="step===1", style="width: 500px; margin: 0 auto;")
        Alert(type="success", show-icon)
          div(style="text-align: left;") 操作成功
          div(slot="desc") 已完成新商品与包装的创建
        Form(:label-width="140")
          FormItem(label="商品名称:") {{skuName}}
          FormItem.pr(label="包装名称:", style="top:-25px") {{appearancesName}}
        div.text-center
          Button(@click="goVerify") 完成

</template>

<script lang="ts">
import Component, { mixins } from 'vue-class-component';
import GoBack from '@/components/shared/GoBack.vue';
import { Prop, Watch } from 'vue-property-decorator';
import ComponentOptionsMixin from '@/mixins/componentOptions';
import { finalize, mergeMap } from 'rxjs/operators';
import { MetaType } from '@/interface';
import SkuAppearancesForm from './components/SkuAppearancesForm.vue';
import {
  createSkuAppearances$,
  getSku$,
  getSkuProposals$,
  verifySkuProposal$
} from '@/api/sku';

@Component({
  components: { SkuAppearancesForm, GoBack }
})
export default class SkuAppearancesCreate extends mixins(
  ComponentOptionsMixin
) {
  @Prop() skuId!: string;
  step: number = 0;
  skuAppearancesValid: boolean = false;
  form: any = {};
  submitting: boolean = false;
  skuName: string = '';
  proposalInfo: any = {};
  proposalId: string = '';

  @Watch('$route.query.step', { deep: true, immediate: true })
  stepChange(stepValue: any) {
    if (stepValue) {
      this.step = Number(stepValue);
      if (stepValue === '1' || stepValue === '2') {
        if (!this.skuAppearancesValid) {
          this.$router.replace({ name: 'v2-sku-create', query: { step: '0' } });
        }
      }
    }
  }

  get appearancesName() {
    if (this.proposalId) {
      return this.form.approval_appearance.appearance_name;
    }
    return this.form.sku_appearance.appearance_name;
  }

  created() {
    const { proposalId } = this.$route.query;

    if (proposalId) {
      this.proposalId = proposalId as string;
      getSkuProposals$({ proposalId: proposalId }).subscribe(state => {
        if (state.isFulfill) {
          this.proposalInfo = state.payload!.data.sku_proposals[0];
          this.proposalInfo.proposalId = proposalId;
        }
      });
    }

    getSku$({ id: this.skuId }).subscribe(({ isFulfill, payload }) => {
      if (isFulfill) {
        this.skuName = payload!.data.sku_name;
      }
    });
  }

  mounted() {
    this.state.isFetching = false;
    this.skuName = (this.$route.query as any).name;
  }

  SkuAppearancesFormSuccessHandle(appearancesForm: any) {
    this.skuAppearancesValid = true;

    if (this.proposalId) {
      this.form = {
        status: 'approval',
        approval_sku: { sku_id: String(this.skuId) },
        ...this.form,
        ...appearancesForm
      };
    } else {
      this.form = { ...this.form, ...appearancesForm };
    }

    this.startFetch$()
      .pipe(
        mergeMap(() => {
          return this.proposalId
            ? verifySkuProposal$({ ...this.form, proposal_id: this.proposalId })
            : createSkuAppearances$({ ...this.form });
        }),
        finalize<MetaType<any>>(() => this.endFetch())
      )
      .subscribe(state => {
        this.state = state;
        if (state.isFulfill) {
          this.$router.replace({
            name: 'v2-sku-appearances-create',
            query: { step: '1' }
          });
        }
      });
  }

  goVerify() {
    this.$router.go(-1);
  }
}
</script>
