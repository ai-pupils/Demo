<template lang="pug">
  section
    GoBack
    Card(:title="'商户详情(商户ID:'+id+', 商户名称: '+(dealerName?dealerName: '--')+')'")
      TabsBox(v-model="tabName", :tabs="tabs")
        template(slot="dealer")
          DealerInfo(v-show="tabName === 'dealer'", :id="id")
        template(slot="cabinet")
          CabinetInfo(v-show="tabName === 'cabinet'", :id="id")
        template(slot="skuBundle")
          SkuBundleInfo(v-show="tabName === 'skuBundle'", :id="id")
        template(slot="transaction")
          TransactionHistory(v-show="tabName === 'transaction'", :id="id")
</template>


<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import TabsBox, { TabPaneType } from '@/components/shared/TabsBox.vue';
import { getRouteQuery } from '@/utils/observables';
import CabinetInfo from './components/CabinetInfo.vue';
import SkuBundleInfo from './components/SkuBundleInfo.vue';
import DealerInfo from './components/DealerInfo.vue';
import TransactionHistory from './components/TransactionHistory.vue';
import GoBack from "@/components/shared/GoBack.vue";

@Component({
  components: {GoBack, TransactionHistory, SkuBundleInfo, CabinetInfo, TabsBox, DealerInfo }
})
export default class DealerDetail extends Vue {
  @Prop() id!: string;
  dealerName: string = '';
  tabName: string = 'dealer';
  tabs: TabPaneType[] = [
    {
      label: '商户信息',
      name: 'dealer'
    },
    {
      label: '货柜信息',
      name: 'cabinet'
    },
    {
      label: '商品组',
      name: 'skuBundle'
    },
    {
      label: '历史交易',
      name: 'transaction'
    }
  ];

  created() {
    const query: any = getRouteQuery(this);
    this.dealerName = query.name;
  }
}
</script>
