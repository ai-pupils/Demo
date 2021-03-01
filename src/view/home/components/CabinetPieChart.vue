<template lang="pug">
  section
    Card
      .mb10
        h3(style="height: 32px") 今日设备占比
      highcharts(v-if="isMounted", :options="chartsOptions", ref="highcharts")
</template>

<script lang="ts">
import Vue from 'vue';
import Component, { mixins } from 'vue-class-component';
import { pieChartsOptions } from '@/const/data/home';
import LoadPageMixin, { LoadPageMixinInstance } from '@/mixins/loadPage';
import SearchMixin, { SearchMixinInstance } from '@/mixins/search';
import { DefaultApiType, MetaType } from '@/interface';
import { getCabinetDailyCount$, getCabinetCountParams } from '@/api/home';
import {Prop, Watch} from 'vue-property-decorator';
import AppDatePicker from '@/components/shared/AppDatePicker.vue';
import {createEmptyTrackMeta} from "@/utils/misc";

@Component({
  components: { AppDatePicker }
})
export default class CabinetPieChart extends Vue {
  @Prop() params!: any;
  chartsOptions = pieChartsOptions;
  isMounted = false;
  // 货柜总数
  all_count = 0;
  // 饼图向右的偏移量
  chartMl = 0;
  // 饼图向下的偏移量
  chartMb = 0;
  searchSchema: getCabinetCountParams = {
    dealer_id: undefined,
    cabinet_type_id: undefined
  };
  state: any = createEmptyTrackMeta();

  mounted() {
    this.isMounted = true;
    window.onresize = this.screenWidthChanged;
  }

  screenWidthChanged(){
    const chart = (this.$refs.highcharts as any).chart;
    const width = document!.documentElement!.clientWidth;
    const {
      title,
      chart: chartOpt
    }: any = this.chartsOptions;

    if(width > 1800) {
      this.chartMl = 0;
      this.chartMb = 0;
    }

    if(width < 1800) {
      this.chartMl = 5;
      this.chartMb = 2;
    }
    if(width < 1700) {
      this.chartMl = 10;
      this.chartMb = 2;
    }
    if(width < 1600) {
      this.chartMl = 16;
      this.chartMb = 5;
    }
    if(width < 1500) {
      this.chartMl = 18;
      this.chartMb = 7;
    }

    title.y = (chartOpt.height - 50 - this.chartMb) / 2;
    if(width < 1400) {
      title.y = 20;
    }
    title.text = `<div style="font-size: 1rem; margin-left: ${this.chartMl}px">
                    <div><b>设备总数</b></div>
                    <div style="text-align: center;">${this.all_count}台</div>
                  </div>`;
    chart.update(this.chartsOptions);
  }

  fetchData(){
    getCabinetDailyCount$({...this.searchSchema}).subscribe((state: MetaType) => {
      if (state.isFulfill) {
        this.state = { ...state };
        this.clear();
        this.initChart();
      }
    });
  }

  @Watch('params', {immediate: true, deep: true})
  paramsChanged(p: getCabinetCountParams){
    this.searchSchema.dealer_id = p.dealer_id;
    this.searchSchema.cabinet_type_id = p.cabinet_type_id;
    this.fetchData();
  }

  @Watch('state', { immediate: true })
  queryDateRangeChange(state: MetaType) {
    if (state.isFulfill) {
      this.clear();
      this.initChart();
    }
  }

  initChart() {
    const chart = (this.$refs.highcharts as any).chart;
    const { payload: { data: results } }: any = this.state;
    const {
      series,
      plotOptions,
      title,
      chart: chartOpt
    }: any = this.chartsOptions;

    this.all_count = Number(results.available_count || 0) + Number(results.disabled_count ||0);

    this.screenWidthChanged();
    plotOptions.pie.point.events.mouseOver = this.mouseOverFn;
    plotOptions.pie.point.events.mouseOut = this.mouseOutFn;

    for(let k in  results) {
      const data = series[0].data.filter((d: any) => d.dataLabels === k);
      if (data && data.length > 0) {
        data[0].y = results[k];
      }
    }
    chart.update(this.chartsOptions);
  }

  mouseOverFn(e: any) {
    const chart = (this.$refs.highcharts as any).chart;
    chart.setTitle({
      text: `<div style="font-size: 1rem; margin-left: ${this.chartMl}px">
              <div><b>${e.target.name}</b></div>
              <div style="text-align: center;">${e.target.y}台</div>
            </div`
    });
  }
  mouseOutFn(e: any) {
    const chart = (this.$refs.highcharts as any).chart;
    chart.setTitle({
      text: `<div style="font-size: 1rem; margin-left: ${this.chartMl}px">
              <div><b>设备总数</b></div>
              <div style="text-align: center; margin-left: ${this.chartMl}px">${this.all_count}台</div>
            </div>`
    });
  }

  clear() {
    const chart = (this.$refs.highcharts as any).chart;
    const { series } = this.chartsOptions;
    series![0].data.forEach((d: any) => {
      d.y = 0;
    });
    chart.update(this.chartsOptions);
  }
}
</script>

<style scoped>
</style>
