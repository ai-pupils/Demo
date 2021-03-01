<template lang="pug">
  section
    Card.card-box
      Row(:gutter="10")
        Col.card-img.text-center(span="12")
          LazyloadImg.img-example(:src="data.appearance_url")
        Col.content-box(span="12")
          .bold.ellipsis.mb5 {{data.appearance_name}}
          div.mb5 {{data.barcodes}}
          div {{data.appearance_desc | emptyText}}
          a.pa.view-btn(href="javascript:;", @click="showDetail") 查看详情
    ProposalComparedModal(ref="modal", :proposalImages="proposalImages", :appearancesImages="appearancesImages")
</template>


<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import LazyloadImg from '@/components/shared/LazyloadImg.vue';
import ProposalComparedModal from '@/view/sku-v2/verify/components/ProposalComparedModal.vue';
import { proposalHdImageMap } from '@/const/data/sku';

@Component({
  components: { ProposalComparedModal, LazyloadImg }
})
export default class AppearancesCard extends Vue {
  @Prop() data: any;
  @Prop() proposalImages: any;

  get appearancesImages() {
    let images: any = {};
    if (this.data) {
      proposalHdImageMap.forEach((key: string) => {
        images[key] = (this.data as any)[key];
      });
    }
    return images;
  }

  showDetail() {
    const modalRef = this.$refs['modal'] as ProposalComparedModal;
    modalRef.open();
  }
}
</script>

<style lang="scss">
.card-box .card-img .status-box {
  position: static;
  height: 150px;
}
.content-box {
  height: 150px;
}
.view-btn {
  position: absolute;
  right: 5px;
  bottom: 0;
}
</style>
