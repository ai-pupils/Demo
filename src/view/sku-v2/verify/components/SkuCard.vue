<template lang="pug">
  section
    Card.mb10
      .card-box
        LazyloadImg.card-img.img-example.mb10.text-center(:src="sku.sku_url", style="width:100%;max-height:150px;margin-bottom:10px")
        div.mb5 {{sku.sku_id}}
        div.mb10.bold.ellipsis(style="font-size: 16px", :title="sku.sku_name") {{sku.sku_name}}
        div.mb5.clearfix
          div.fl {{sku.trade_mark_cn || sku.trade_mark_en}}
          div.fr {{sku.package_type | getSkuPackageTypes}}
        div.clearfix
          div.fl {{sku.sku_appearance_count||0}}个商品包装
          router-link.fr(:to="goTo()") 查看详情
</template>


<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Inject, Prop } from 'vue-property-decorator';
import LazyloadImg from '@/components/shared/LazyloadImg.vue';

@Component({
  components: { LazyloadImg }
})
export default class SkuCard extends Vue {
  @Prop() sku!: any;
  @Inject('getProposalId') getProposalId!: () => string;

  proposalId: string = '';

  mounted() {
    this.proposalId = this.getProposalId();
  }

  goTo() {
    return {
      name: 'v2-sku-verify-proposal-appearances',
      params: { proposalId: this.proposalId, skuId: this.sku.sku_id },
      query: { skuName: this.sku.sku_name }
    };
  }
}
</script>

<style lang="scss">
.card-box .card-img .status-box {
  position: static;
  height: 150px;
}
</style>
