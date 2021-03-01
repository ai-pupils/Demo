<template lang="pug">
  section.wrap
    Layout
      Content
        Row.mb20(v-for="(imageChuck, index) in images", :key="index", :gutter="20")
          Col(span="6", v-for="(image,i) in imageChuck", :key="i")
            LazyLoadImage.image-box(:src="image.url")
              span.image-text() TaskID: {{image.id}}
</template>

<script lang="ts">
import _ from 'lodash';
import Vue from 'vue';
import Component from 'vue-class-component';
import LazyLoadImage from '@/components/shared/LazyLoadImage.vue';
import { getSkuIngressionImages$ } from '@/api/v2/sku';

@Component({
  components: { LazyLoadImage }
})
export default class IngressionImages extends Vue {
  images: any[] = [];

  created() {
    const { id, vision_id } = this.$route.query;
    getSkuIngressionImages$({
      reviewed_status: 'accepted',
      pucode: id,
      vision_id
    }).subscribe({
      next: (res: any) => {
        if (res.isFulfill) {
          const images = res.payload.data.data.map((image: any) => ({
            url: image.image_url,
            id: image.id
          }));
          this.images = _.chunk(images, 4);
        }
      }
    });
  }
}
</script>

<style scoped lang="scss">
.wrap {
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
}
.image-box {
  position: relative;
}
.image-text {
  position: absolute;
  left: 10px;
  bottom: 10px;
  color: #fff;
  font-size: 14px;
}
</style>
