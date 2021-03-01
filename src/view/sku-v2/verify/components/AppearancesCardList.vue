<template lang="pug">
  section
    Row(v-for="(row,index) in list", :gutter="10", :key="index")
      Col(span="6", v-for="appearances in row", :key="appearances.id")
        AppearancesCard(:data="appearances", :proposalImages="HdImages")
</template>


<script lang="ts">
import Component, { mixins } from 'vue-class-component';
import LoadPageMixin, { LoadPageMixinInstance } from '@/mixins/loadPage';
import { DefaultApiType, DefaultDataResponse } from '@/interface';
import { getSku$, GetSkuData, GetSkuParams } from '@/api/sku';
import { Prop } from 'vue-property-decorator';
import AppearancesCard from '@/view/sku-v2/verify/components/AppearancesCard.vue';
import ComponentOptionsMixin from '@/mixins/componentOptions';
import { proposalHdImageMap } from '@/const/data/sku';
import { of } from 'rxjs';
import { bufferCount, concatAll, toArray } from 'rxjs/operators';

@Component({
  components: { AppearancesCard }
})
export default class AppearancesCardList
  extends mixins<ComponentOptionsMixin<DefaultDataResponse<GetSkuData>>>(
    LoadPageMixin
  )
  implements LoadPageMixinInstance {
  @Prop() skuId!: string;
  @Prop() proposalInfo!: any;
  defaultApi: DefaultApiType = getSku$;
  defaultParams: GetSkuParams = {
    id: this.skuId
  };

  transformParams(params: any) {
    return params;
  }

  get list() {
    let list:any[] = [];
    if (this.state.isFulfill) {
      of(this.state.payload!.data.sku_appearances)
        .pipe(
          concatAll(),
          bufferCount(6),
          toArray()
        )
        .subscribe((data: any) => {
          list = data;
        });
    }
    return list;
  }

  get HdImages() {
    let images: any = {};
    if (this.proposalInfo) {
      proposalHdImageMap.forEach((key: string) => {
        images[key] = this.proposalInfo[key];
      });
      return images;
    }
  }
}
</script>
