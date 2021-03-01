<template lang="pug">
  section
    Row(v-for="(row,index) in list", :key="index", :gutter="50")
      Col(span="6", v-for="(sku, index) in row", :key="index")
        SkuCard(:sku="sku")
    Alert(v-if="skus.length === 0", type="warning", show-icon) 搜索结果无相似商品
</template>


<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import SkuCard from '@/view/sku-v2/verify/components/SkuCard.vue';
import { of } from 'rxjs';
import { bufferCount, concatAll, toArray } from 'rxjs/operators';

@Component({
  components: { SkuCard }
})
export default class SkusCardList extends Vue {
  @Prop() skus!: any[];
  list: any[] = [];

  @Watch('skus', { immediate: true })
  skusChange(skus: any[]) {
    if (skus.length > 0) {
      of(skus)
        .pipe(
          concatAll(),
          bufferCount(4),
          toArray()
        )
        .subscribe((data: any) => {
          this.list = data;
        });
    } else {
      this.list = [];
    }
  }
}
</script>
