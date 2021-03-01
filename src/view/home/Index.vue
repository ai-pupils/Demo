<template lang="pug">
  section
    Card.mb20
      .header
        h3 设备监控
        .select
          Select(v-model="searchSchema.dealer_id", style="width:200px", placeholder="请选择商户", clearable)
            Option(v-for="item in dealer_list", :value="item.id", :key="item.id") {{ item.label }}
          Select.ml5(v-model="searchSchema.cabinet_type_id", style='width: 200px', placeholder="请选择柜体", clearable)
            Option(v-for="item in cabinet_type_list", :value="item.id", :key="item.id", :label="`${item.id}（${item.name}）`")
    Row.mb20(:gutter="20")
      Col(:span="16")
        cabinet-bar-chart(:params="searchSchema")
      Col(:span="8")
        cabinet-pie-chart(:params="searchSchema")
    Row(:gutter="20")
      Col(:span="24")
        cabinet-line-chart(:params="searchSchema")
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import CabinetBarChart from '@/view/home/components/CabinetBarChart.vue';
import CabinetLineChart from '@/view/home/components/CabinetLineChart.vue';
import CabinetPieChart from '@/view/home/components/CabinetPieChart.vue';
import { getCustomers$ } from '@/api/v2/users';
import LoadPageMixin, { LoadPageMixinInstance } from '@/mixins/loadPage';
import { DefaultApiType, StateListData } from '@/interface';
import { getCabinetTypes$, GetCabinetTypesData } from '@/api/cabinet';
import { Watch } from 'vue-property-decorator';

@Component({
  components: { CabinetBarChart, CabinetLineChart, CabinetPieChart }
})
export default class Index extends LoadPageMixin
  implements LoadPageMixinInstance {
  defaultApi: DefaultApiType = getCabinetTypes$;
  defaultParams: any = {};
  searchSchema: any = {
    dealer_id: undefined,
    cabinet_type_id: undefined
  };
  transformParams(params: any) {
    return params;
  }
  dealer_list = [];
  cabinet_type_list: any[] = [];

  @Watch('state', { immediate: true })
  stateChanged(state: StateListData<GetCabinetTypesData>) {
    if (state.isFulfill) {
      this.cabinet_type_list = state.payload!.data.results.map(type => {
        return { id: type.id, name: type.name };
      });
    }
  }

  mounted() {
    this.getDealerList();
  }

  getDealerList() {
    getCustomers$({ pageIndex: 1, pageSize: 99999 }).subscribe(state => {
      if (state.isFulfill) {
        const {
          payload: {
            data: { results }
          }
        } = state as any;
        this.dealer_list = results.map((r: any) => {
          return {
            id: r.user_id.toString(),
            name: r.name,
            // note: select列表必须转成字符串，否则有bug
            label: r.name ? r.user_id + ' - ' + r.name : r.user_id.toString()
          };
        });
      }
    });
  }
}
</script>

<style type="text/less" lang="less" scoped>
.header {
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
}
.main {
  .content-wrapper {
    padding: 18px;
    height: calc(100% - 80px);
    overflow: auto;
    overflow-x: hidden !important;
  }
}
</style>
