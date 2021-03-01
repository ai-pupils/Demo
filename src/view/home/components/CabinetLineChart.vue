<template lang="pug">
  section
    Card
      .header.mb10
        Tooltip(content="故障锁柜时长/所有运营柜总时长", placement="right")
          h3(style="height: 32px") 设备故障率
        .font12
          AppDatePicker(v-model="queryDateRange", distance="last month", placement="bottom-end", :options="datePickerOption")
      highcharts(v-if="isMounted", :options="chartsOptions", ref="highcharts")
</template>

<script lang="ts">
import Vue from 'vue';
import Component, { mixins } from 'vue-class-component';
import { lineChartsOptions } from '@/const/data/home';
import { MetaType } from '@/interface';
import {
  createEmptyTrackMeta,
  parseDateRange,
  parseDaterangepickerOption
} from '@/utils/misc';
import { getCabinetCountParams, getCabinetHisCount$ } from '@/api/home';
import { Prop, Watch } from 'vue-property-decorator';
import AppDatePicker from '@/components/shared/AppDatePicker.vue';
import _ from 'lodash';
import { Subject, merge, ReplaySubject } from 'rxjs';
import { take, takeUntil, tap } from 'rxjs/operators';
import moment from 'moment';

const subject1$ = new ReplaySubject(1);
const subject2$ = new Subject();
const params$ = merge(subject1$, subject2$);

@Component({
  components: { AppDatePicker }
})
export default class CabinetLineChart extends Vue {
  @Prop() params!: any;
  queryDateRange: Date[] = parseDateRange('last month', false)();
  chartsOptions = lineChartsOptions;
  isMounted = false;
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

  fetchData() {
    let from_day = this.searchSchema.from_day;
    let to_day = this.searchSchema.to_day;
    const distance = moment(to_day).diff(from_day, 'days');
    // 如果查询时间范围小于7天，则改为7天
    if (distance < 7) {
      from_day = moment(to_day)
        .add('-1', 'week')
        .toDate();
    }
    getCabinetHisCount$({
      dealer_id: this.searchSchema.dealer_id,
      cabinet_type_id: this.searchSchema.cabinet_type_id,
      from_day,
      to_day
    }).subscribe((state: MetaType) => {
      if (state.isFulfill) {
        this.state = { ...state };
        this.clear();
        this.initChart();
      }
    });
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

  initChart() {
    const chart = (this.$refs.highcharts as any).chart;
    let { results }: any = this.state.payload!.data;
    const { xAxis, series }: any = this.chartsOptions;

    // 查询时间除以7，不能整除的天数舍弃
    const extra = results.length % 7;
    if (extra !== 0) {
      // 舍弃靠前的天数
      results = results.slice(extra, results.length);
    }

    const time_group = _.chunk(results, 7);
    time_group.forEach((week: any[]) => {
      xAxis[0].categories.push(`${week[0].day} - ${week[week.length - 1].day}`);
      const locked_time = _.sum(week.map((day: any) => day.locked_time));
      const available_time = _.sum(week.map((day: any) => day.available_time));
      const fault_ratio =
        available_time === 0
          ? 0
          : _.round((locked_time / available_time) * 100, 2);
      series[0].data.push(fault_ratio);
    });
    chart.update(this.chartsOptions);
  }

  clear() {
    const chart = (this.$refs.highcharts as any).chart;
    const { series, xAxis } = this.chartsOptions;
    xAxis[0].categories = [];
    series![0].data = [];
    chart.update(this.chartsOptions);
  }

  get datePickerOption() {
    return parseDaterangepickerOption(
      [
        { text: '最近一个月', distance: 'last month' },
        { text: '最近两个月', distance: 'two month' },
        { text: '最近三个月', distance: 'three month' },
        { text: '最近四个月', distance: 'four month' }
      ],
      false
    );
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
