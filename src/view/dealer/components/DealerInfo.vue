<template lang="pug">
  section
    Row.info-title 基本信息
    Row.info-box
      Form(inline, :label-width='110', label-position='left')
        Col(span='8')
          FormItem(label='商户ID:') {{dealerInfo.user_id}}
        Col(span='8')
          FormItem(label='商户类型:') {{dealerInfo.user_type | emptyText}}
        Col(span='8')
          FormItem(label='创建时间:') {{dealerInfo.create_time | fmtLocalTime}}
    Row.info-box
      Form(inline, :label-width='110', label-position='left')
        Col(span='8')
          FormItem(label='商户名称:') {{dealerInfo.name | emptyText}}
        Col(span='8')
          FormItem(label='商户邮箱:') {{dealerInfo.email | emptyText}}
        Col(span='8')
          FormItem(label='备注:') {{dealerInfo.comment | emptyText}}
    Row.info-box
      TrxStatisticsChart(:dealerId="id")
</template>

<script lang="ts">

  import {mixins} from "vue-class-component";
  import LoadPageMixin, {LoadPageMixinInstance} from "@/mixins/loadPage";
  import {Component, Prop, Watch} from "vue-property-decorator";
  import {DefaultApiType} from "@/interface";
  import {getCustomers$, GetCustomersParams} from "@/api/v2/users";
  import TableBox from '@/components/shared/TableBox.vue';
  import PaginationInnerBox from "@/components/shared/PaginationInnerBox.vue";
  import TrxStatisticsChart from "./TrxStatisticsChart.vue";

  @Component({
    components: {PaginationInnerBox, TableBox, TrxStatisticsChart}
  })
  export default class DealerInfo extends mixins(LoadPageMixin)
    implements LoadPageMixinInstance {
    @Prop() id!: string;
    dealerInfo: any = {};
    defaultApi: DefaultApiType = getCustomers$;
    defaultParams: GetCustomersParams = {
      pageIndex: 1,
      pageSize: Number(process.env.PAGE_SIZE),
      customerId: this.id
    };

    transformParams(params: GetCustomersParams) {
      return params;
    }

    @Watch('state', {immediate: true})
    stateChange(info: any) {
      if (info.isFulfill) {
        const {results} = info.payload.data;
        if (results && results.length > 0) {
          this.dealerInfo = results[0];
        }
      }
    }
  }

</script>

<style scoped>

</style>
