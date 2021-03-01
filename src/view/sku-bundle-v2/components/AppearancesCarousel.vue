<template lang="pug">
  section
    Row.mb20(v-if="sku")
      Col(:span="6")
        span.bold.sku-lable 商品名称：{{sku.name | emptyText}}
      Col(:span="4", v-if="sku.appearances")
        span.bold.sku-lable 包装名称：{{sku.appearances[currentShowIndex].name | emptyText}}
      Col(:span="4", v-if="sku.appearances")
        span.bold.sku-lable 包装数：{{sku.appearances.length | emptyText}}
    Carousel.mb20(v-if="sku.appearances", v-model="currentShowIndex", :loop="false", @on-change="indexChanged")
      CarouselItem(v-for="(appearance, index) in sku.appearances", :key="index")
        Row(:gutter="20")
          Col(span="4")
            HDImageThumb(:src="appearance.front_url")
          Col(span="4")
            HDImageThumb(:src="appearance.back_url")
          Col(span="4")
            HDImageThumb(:src="appearance.left_url")
          Col(span="4")
            HDImageThumb(:src="appearance.right_url")
          Col(span="4")
            HDImageThumb(:src="appearance.top_url")
          Col(span="4")
            HDImageThumb(:src="appearance.bottom_url")
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import HDImageThumb from '@/view/sku-v2/verify/components/HDImageThumb.vue';
import {Prop} from "vue-property-decorator";

@Component({
  components: { HDImageThumb }
})
export default class AppearancesCarousel extends Vue {
  @Prop() sku!: any;
  skus: any = [];
  visible: boolean = false;
  currentShowIndex: number = 0;
  currentAppearanceName: string = '';

  indexChanged() {
  }
}
</script>

<style scoped>
.sku-lable {
  font-size: 16px;
}
</style>
