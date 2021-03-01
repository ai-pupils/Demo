<template lang="pug">
  section
    H3.text-center.mb20 多角度高清图
    Row(:gutter="20", v-if="proposal")
      Col(:span="4")
        HDImageThumb(title="前视图", :src="proposal.front_url")
      Col(:span="4")
        HDImageThumb(title="后视图", :src="proposal.back_url")
      Col(:span="4")
        HDImageThumb(title="左视图", :src="proposal.left_url")
      Col(:span="4")
        HDImageThumb(title="右视图", :src="proposal.right_url")
      Col(:span="4")
        HDImageThumb(title="顶视图", :src="proposal.top_url")
      Col(:span="4")
        HDImageThumb(title="底视图", :src="proposal.bottom_url")
    Divider
    H3.mb20 请选择采集类型：
    Row(v-if="ingressionTypes", :gutter="20")
      Col.mb10(v-for="(type, index) in ingressionTypes", :span="3", :key="type.id")
        .card.card-border.cursor-pointer(:class="{ selected: type.selected}", @click="selectedIngressionType(index)")
          .card-body
            LazyLoadImage(:src="type.image_example", :link="false", height="100px")
          .footer.cursor-pointer(:class="{ 'color-blue': type.selected}")
            .ivu-divider.ivu-divider-default.divider-horizontal
            .text-center
              p.pd6(:class="{ 'color-white': type.selected}") {{type.name}}
    Divider
    H3.mb20 请选择视觉类型：
    Row(v-if="visionTypes.length > 0", :gutter="20")
      Col.mb10(v-for="(type, index) in visionTypes", :span="3", :key="type.id")
        .card.card-border.cursor-pointer(:class="{ selected: type.selected}", @click="selectedVisionType(index)")
          .card-body
            LazyLoadImage(:src="type.image_example", :link="false", height="100px")
          .footer.cursor-pointer(:class="{ 'color-blue': type.selected}")
            .ivu-divider.ivu-divider-default.divider-horizontal
            .text-center
              p.pd6(:class="{ 'color-white': type.selected}") {{type.name}}
    Divider
    .btn-group
      Button(@click="goBack") 上一步
      Button.ml20(type="primary", @click="submit") 下一步
</template>

<script lang="ts">
import Vue from 'vue';
import Component, { mixins } from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import { ProposalData } from '@/api/sku';
import HDImageThumb from '@/view/sku-v2/verify/components/HDImageThumb.vue';
import LoadPageMixin, { LoadPageMixinInstance } from '@/mixins/loadPage';
import { DefaultApiType, MetaType } from '@/interface';
import { getSkuIngressionTypes$ } from '@/api/v2/skus';
import LazyLoadImage from '@/components/shared/LazyLoadImage.vue';

@Component({
  components: {
    HDImageThumb,
    LazyLoadImage
  }
})
export default class ChooseSkuCategory extends Vue {
  @Prop() proposal!: ProposalData;
  defaultApi: DefaultApiType = getSkuIngressionTypes$;
  defaultParams: any = {
    pageIndex: 1,
    pageSize: Number(process.env.PAGE_SIZE)
  };
  ingressionTypes: any[] = [];
  visionTypes: any[] = [];

  mounted() {
    getSkuIngressionTypes$().subscribe((state: any) => {
      if (state.isFulfill) {
        const {
          payload: {
            data: { ingression_types }
          }
        } = state;
        this.ingressionTypes = ingression_types;
      }
    });
  }

  selectedIngressionType(index: number) {
    this.clearIngressionType();
    const type = this.ingressionTypes[index];
    type.selected = true;
    this.visionTypes = type.vision_types;
  }

  selectedVisionType(index: number) {
    this.clearVisionType();
    const type = this.visionTypes[index];
    type.selected = true;
  }

  clearIngressionType() {
    this.ingressionTypes.forEach((type: any) => {
      type.selected = false;
    });
    this.clearVisionType();
  }
  clearVisionType() {
    this.visionTypes.forEach((type: any) => {
      type.selected = false;
    });
  }
  submit() {
    const ingressionType = this.ingressionTypes.filter((type: any) => {
      return type.selected == true;
    });
    const visionType = this.visionTypes.filter((type: any) => {
      return type.selected == true;
    });

    if (ingressionType.length === 0) {
      this.$Message.error('请选择采集类型');
      return;
    }
    if (visionType.length === 0) {
      this.$Message.error('请选择视觉类型');
      return;
    }
    this.$emit('next', {
      ingression_type: ingressionType[0].id.toString(),
      vision_type: visionType[0].id.toString()
    });

    this.$router.replace({
      name: 'v2-sku-create',
      query: { ...this.$route.query, step: '2' }
    });
  }
  goBack() {
    this.$router.replace({
      name: 'v2-sku-create',
      query: { ...this.$route.query, step: '0' }
    });
  }
}
</script>

<style scoped>
.ivu-card-body {
  padding: 20px !important;
}
.selected {
  border-color: #2d8cf0 !important;
}
.card-border {
  border: 1px solid #dcdee2;
  border-color: #e8eaec;
}
.card {
  background: #fff;
  border-radius: 4px;
  font-size: 14px;
  position: relative;
  transition: all 0.2s ease-in-out;
}
.card-body {
  padding: 16px;
}
.divider-horizontal {
  display: block;
  height: 1px;
  width: 100%;
  min-width: 100%;
  margin: 0;
  clear: both;
}
.color-blue {
  background-color: #2d8cf0;
}
.pd6 {
  padding: 6px;
}
.color-white {
  color: white;
}
.cursor-pointer {
  cursor: pointer;
}
</style>
