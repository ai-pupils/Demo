<template lang="pug">
  section
    Card
      Spin(size='large' fix v-if='!proposalInfo.id')
      h6.clearfix(slot='title', style='line-height: 30px')
        span 处理商品详情
        div(style='float: right;')
          Button(:disabled="proposalInfo.status !== 'initialized'", @click="openModal", :loading="deleteLoading") 废弃当前数据
          Button.ml5(:disabled="proposalInfo.status !== 'initialized'", type="primary", @click="goCreateProposal") 新建商品及包装
      section
        Row.info-title 商品注册申请
        Row.info-box
          Form(inline, :label-width='110', label-position='left')
            Col(span='8')
              FormItem(label='注册申请编号:') {{proposalInfo.id}}
            Col(span="8")
              FormItem(label="商户ID:") {{proposalInfo.creator_id}}
            Col(span="8")
              FormItem(label="商品高度:") {{proposalInfo.length | empty}}
        Row.info-box
          Form(inline, :label-width='110', label-position='left')
            Col(span="8")
              FormItem(label="商品名称:") {{proposalInfo.sku_name}}
            Col(span='8')
              FormItem(label='商品条码:') {{proposalInfo.barcodes | emptyText}}
            Col(span="8")
              FormItem(label="商品宽度:") {{proposalInfo.width | empty}}
        Row.info-box
          Form(inline, :label-width='110', label-position='left')
            Col(span="8")
              FormItem(label="商品品牌:") {{proposalInfo.trade_mark}}
            Col(span='8')
              FormItem(label='原产国:')  {{proposalInfo.coc | CocFilter | empty}}
            Col(span="8")
              FormItem(label="商品厚度:") {{proposalInfo.thickness | empty}}
        Row.info-box
          Form(inline, :label-width='110', label-position='left')
            Col(span="8")
              FormItem(label="商品类型:") {{proposalInfo.sku_type | getSkuTypes | emptyText}}
            Col(span="8")
              FormItem(label="包装类型:") {{proposalInfo.package_type | getSkuPackageTypes | emptyText}}
        Row.info-box
          Form(inline, :label-width='110', label-position='left')
            Col(span='8')
              FormItem(label='商品性质:') {{proposalInfo.barcode_type | getSkuBarcodeTypes | emptyText}}
            Col(span='8')
              FormItem(label='备注:') {{proposalInfo.comment | empty}}
        Row.info-box(:gutter="50")
          Form(inline, :label-width="110", label-position="left")
            FormItem(label="多角度高清图:", style="width: 100%")
              Col(span="4")
                HDImageThumb(title="前视图", :src="proposalInfo.front_url")
              Col(span="4")
                HDImageThumb(title="后视图", :src="proposalInfo.back_url")
              Col(span="4")
                HDImageThumb(title="左视图", :src="proposalInfo.left_url")
              Col(span="4")
                HDImageThumb(title="右视图", :src="proposalInfo.right_url")
              Col(span="4")
                HDImageThumb(title="顶视图", :src="proposalInfo.top_url")
              Col(span="4")
                HDImageThumb(title="底视图", :src="proposalInfo.bottom_url")
      VerifyProposalModal(ref='VerifyProposalModal', :proposalInfo="proposalInfo", @ok="confirmHandle")
</template>


<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { ProposalData } from '@/api/sku';
import HDImageThumb from '@/view/sku-v2/verify/components/HDImageThumb.vue';
import VerifyProposalModal from '@/view/sku-v2/verify/components/VerifyProposalModal.vue';

@Component({
  components: { VerifyProposalModal, HDImageThumb }
})
export default class ProposalInfo extends Vue {
  @Prop({ default: () => ({}) })
  proposalInfo!: ProposalData;
  deleteLoading: boolean = false;
  visible: boolean = false;

  goCreateProposal() {
    this.$router.push({
      name: 'v2-sku-create',
      query: { proposalId: String(this.proposalInfo.id) }
    });
  }

  confirmHandle() {
    this.$router.go(-1);
  }

  openModal() {
    const ref: VerifyProposalModal = this.$refs[
      'VerifyProposalModal'
    ] as VerifyProposalModal;
    ref.open();
  }
}
</script>
