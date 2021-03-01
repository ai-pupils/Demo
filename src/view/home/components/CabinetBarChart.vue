<template lang="pug">
  section
    Card
      .header.mb10
        h3(style="height: 32px") 设备数量
        AppDatePicker(v-model="queryDateRange")
      highcharts(v-if="isMounted", :options="chartsOptions", ref="highcharts")
</template>

<script lang="ts">
import Vue from 'vue';
import Component, { mixins } from 'vue-class-component';
import { barChartsOptions } from '@/const/data/home';
import LoadPageMixin, { LoadPageMixinInstance } from '@/mixins/loadPage';
import SearchMixin, { SearchMixinInstance } from '@/mixins/search';
import { DefaultApiType, MetaType } from '@/interface';
import { createEmptyTrackMeta, parseDateRange } from '@/utils/misc';
import { getCabinetHisCount$, getCabinetCountParams } from '@/api/home';
import { Prop, Watch } from 'vue-property-decorator';
import { finalize, mergeMap, take, takeUntil } from 'rxjs/operators';
import AppDatePicker from '@/components/shared/AppDatePicker.vue';
import moment from 'moment';
import { merge, Subject } from 'rxjs';

const subject1$ = new Subject();
const subject2$ = new Subject();
const params$ = merge(subject1$, subject2$);

@Component({
  components: { AppDatePicker }
})
export default class CabinetBarChart extends Vue {
  @Prop() params!: any;
  chartsOptions = barChartsOptions;
  isMounted = false;
  queryDateRange: Date[] = parseDateRange('last week', false)();
  defaultParams: getCabinetCountParams = {
    from_day: this.queryDateRange[0],
    to_day: this.queryDateRange[1]
  };
  searchSchema: getCabinetCountParams = {
    ...this.defaultParams,
    dealer_id: undefined,
    cabinet_type_id: undefined
  };
  state: any = createEmptyTrackMeta();

  created() {
    // 销毁订阅
    let beforeDestroy$ = this.$eventToObservable('hook:beforeDestroy').pipe(
      take(1)
    );
    params$.pipe(takeUntil(beforeDestroy$)).subscribe((p: any) => {
      this.searchSchema = { ...p };
      this.fetchData();
    });
  }
  mounted() {
    this.isMounted = true;
  }

  @Watch('params', { immediate: true, deep: true })
  paramsChanged(p: getCabinetCountParams) {
    subject1$.next({ ...this.searchSchema, ...p });
  }

  @Watch('queryDateRange', { immediate: true })
  queryDateRangeChange(date: any[]) {
    subject2$.next({
      ...this.searchSchema,
      from_day: date[0],
      to_day: date[1]
    });
  }

  fetchData() {
    getCabinetHisCount$({ ...this.searchSchema }).subscribe(
      (state: MetaType) => {
        if (state.isFulfill) {
          this.state = { ...state };
          this.clear();
          this.initChart();
        }
      }
    );
  }

  initChart() {
    const chart = (this.$refs.highcharts as any).chart;
    const { results }: any = this.state.payload!.data;
    const { xAxis, series }: any = this.chartsOptions;
    xAxis[0].categories = results.map(
      (e: any) => `${moment(e.day).format('YYYY-MM-DD')}`
    );
    results.forEach((e: any) => {
      series[0].data.push(e.available_count);
      series[1].data.push(e.offline_count);
      series[2].data.push(e.breakdown_locked_count);
      series[3].data.push(e.locked_count - e.breakdown_locked_count);
    });
    chart.update(this.chartsOptions);
  }

  clear() {
    const chart = (this.$refs.highcharts as any).chart;
    const { series } = this.chartsOptions;
    series![0].data = [];
    series![1].data = [];
    series![2].data = [];
    series![3].data = [];
    chart.update(this.chartsOptions);
  }
}
</script>

<style scoped>
.header {
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
}
</style>
