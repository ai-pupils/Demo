<template lang="pug">
  section
    Spin(size='large' fix v-if='isFetching')
    Form(:ref="formName", :model="form", :rules="rules", inline, :label-width='110', label-position='left')
      Row.info-title 基本信息
      Row.info-box
        Col(span='8')
          FormItem(label='商品组ID:') {{bundleInfo.id}}
        Col(span='8')
          FormItem(label='商户ID:') {{bundleInfo.dealer_id | emptyText}}
      Row.info-box
        Col(span="8")
          FormItem(label="商品数:") {{bundleInfo.sku_count || 0}}
        Col(span="8")
          FormItem(label="商品组名称:", prop="name")
            Input(v-model="form.name")
        Col(span="8")
          FormItem(label="商品组描述:", prop="description")
            Input(v-model="form.description")
      Row.info-box
        Col(span="8")
          FormItem(label="视觉ID:") {{bundleInfo.vision_id | emptyText}}
        Col(span="8")
          FormItem(label="支持柜体:")
            span.mr10(v-for="type in bundleInfo.cabinet_types")
              | {{type.name}}
        Col(span="8")
          FormItem(label="footprint:") {{bundleInfo.footprint | emptyText}}
      Row.info-box
        Col(span="8")
          FormItem(label="创建时间:") {{bundleInfo.create_time | fmtLocalTime}}
      Row.info-title 审核信息
      Row.info-box
        Col(span='8')
          FormItem(label='审核状态：')
            VerifyStatusTag(:bundle="bundleInfo")
        Col(span='8')
          FormItem(label='审核时间：') {{bundleInfo.reviewed_at | fmtLocalTime | emptyText}}
      Row.info-box
        Col(span="8")
          FormItem(label="审核人：") {{bundleInfo.reviewer_id | emptyText}}
        Col(span="8")
          FormItem(label="审核备注：") {{bundleInfo.review_comment | emptyText}}
      Row.info-title 状态相关
      Row.info-box
        Col(span="8")
          FormItem(label="商品组状态:")
            Tag(v-if="bundleInfo.status === bundleStatus.approval.id", color="success") 可用
            Tag(v-else, color="error") 不可用
        Col(span="8")
          FormItem(label="QC状态：")
            Tag(v-if="bundleInfo.is_qc_learned", color="green") 已确认
            Tag(v-else, color="red") 未确认
        Col(span="8")
          FormItem(label="训练状态：")
            template
              router-link(v-if="bundleInfo && bundleInfo.id && bundleInfo.vision_id",
                :to="{name:'v2-sku-bundle-detail',params:{skuBundleId: bundleInfo.id}, query: {footprint: bundleInfo.footprint, visionId: bundleInfo.vision_id, tabName: 'trainList'}}")
                | 查看
              span(v-else) --

</template>

<script lang="ts">
import Component, { mixins } from 'vue-class-component';
import ValidFormMixin, { ValidFormOptions } from '@/mixins/validForm';
import { DefaultApiType, MetaType } from '@/interface';
import { Model, Prop, Watch } from 'vue-property-decorator';
import {
  getSkuBundlesV2$,
  GetSkuBundlesV2Params,
  SkuBundleV2Data,
  updateSkuBundleV2$,
  UpdateSkuBundleV2Params
} from '@/api/sku-bundle';
import LoadPageMixin, { LoadPageMixinInstance } from '@/mixins/loadPage';
import ComponentOptionsMixin from '@/mixins/componentOptions';
import { skuBundleReviewedStatus } from '@/const/data/sku-bundle';
import VerifyStatusTag from '@/view/sku-bundle-v2/components/VerifyStatusTag.vue';

@Component({
  components: { VerifyStatusTag },
  data() {
    return {
      rules: {
        name: [{ required: true, message: '必填', trigger: 'blur' }]
      }
    };
  }
})
export default class SkuBundleInfo
  extends mixins<ValidFormMixin<any, MetaType>, ComponentOptionsMixin>(
    ValidFormMixin,
    LoadPageMixin
  )
  implements ValidFormOptions, LoadPageMixinInstance {
  @Prop() bundleId!: string;
  @Model('change', { type: Boolean, default: false })
  submitStatus!: boolean;
  bundleStatus = skuBundleReviewedStatus;
  defaultApi: DefaultApiType = getSkuBundlesV2$;
  formApi: DefaultApiType = updateSkuBundleV2$;
  defaultParams: GetSkuBundlesV2Params = {
    bundleId: Number(this.bundleId)
  };
  fetchOnce: boolean = true;
  form: any = {
    name: undefined,
    description: undefined
  };
  formName: string = 'skuBundleForm';
  uploadLoading: boolean = false;

  transformParams(params: any) {
    return params;
  }

  transformFormParams(): UpdateSkuBundleV2Params {
    return {
      id: Number(this.bundleId),
      dealer_id: (this.bundleInfo as SkuBundleV2Data).dealer_id,
      name: this.form.name,
      description: this.form.description,
      audited_status: undefined
    };
  }

  @Watch('data', { immediate: true })
  dataChange(v: any) {
    if (v) {
      this.state.isFetching = false;
    }
  }

  @Watch('state.isFetching', { deep: true, immediate: true })
  isFetchingChange(v: boolean) {
    this.$emit('change', v);
  }

  @Watch('bundleInfo')
  bundleInfoChange(info: SkuBundleV2Data) {
    this.form.name = info.name;
    this.form.description = info.description;
    this.$emit('dealerId', info.dealer_id);
  }

  get bundleInfo(): SkuBundleV2Data | object {
    if (this.state.isFulfill) {
      return (this.state.payload!.data as any).bundles[0];
    }
    return {};
  }

  public submit() {
    return this.validAndHandleForm$();
  }
}
</script>

<style scoped>
.mr10 {
  margin-right: 10px;
}
</style>
