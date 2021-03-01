<template lang="pug">
  Modal(v-model="visible", fullscreen, title="高清图对比", :footer-hide="true")
    Row.mb20(:gutter="15")
      Col(span="4")
        HDImageThumb(title="前视图", :src="proposalImages.front_url")
      Col(span="4")
        HDImageThumb(title="后视图", :src="proposalImages.back_url")
      Col(span="4")
        HDImageThumb(title="左视图", :src="proposalImages.left_url")
      Col(span="4")
        HDImageThumb(title="右视图", :src="proposalImages.right_url")
      Col(span="4")
        HDImageThumb(title="顶视图", :src="proposalImages.top_url")
      Col(span="4")
        HDImageThumb(title="底视图", :src="proposalImages.bottom_url")
    Row(:gutter="15")
      Col(span="4")
        HDImageThumb(title="前视图", :src="appearancesImages.front_url")
      Col(span="4")
        HDImageThumb(title="后视图", :src="appearancesImages.back_url")
      Col(span="4")
        HDImageThumb(title="左视图", :src="appearancesImages.left_url")
      Col(span="4")
        HDImageThumb(title="右视图", :src="appearancesImages.right_url")
      Col(span="4")
        HDImageThumb(title="顶视图", :src="appearancesImages.top_url")
      Col(span="4")
        HDImageThumb(title="底视图", :src="appearancesImages.bottom_url")
</template>


<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import HDImageThumb from '@/view/sku-v2/verify/components/HDImageThumb.vue';

@Component({
  components: { HDImageThumb }
})
export default class App extends Vue {
  @Prop() appearancesImages!: any;
  @Prop() proposalImages!: any;
  visible: boolean = false;

  public open() {
    this.visible = true;
  }

  public close() {
    this.visible = false;
  }
}
</script>
