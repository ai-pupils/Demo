<template lang="pug">
  section
    p.text-center.font18.mb20.mt20 信噪比（SNIR）
    Form.ml50
      FormItem
        radio-group(v-model="timeRadio", type="button", @on-change="radioChange")
          radio(label="today") 今天
          radio(label="last 6 hour") 近六个小时
          radio(label="last hour") 近一小时
        el-date-picker.ml5(v-model='queryDateTimeRange', placeholder='查询时间', :width="300", @change='dateChange',
          :options="datePickerOption", type="datetimerange", distance="last day", format="yyyy-MM-dd HH:mm:ss")
        Button.ml5(type='primary', searchSchemahtml-type='submit', :loading='state.isFetching', @click.prevent='search', html-type="submit", icon='ios-search') 查询
    highcharts(v-if="isMounted", :options="chartsOptions", ref="highcharts")
</template>

<script lang="ts">
import Vue from 'vue';
import Component, { mixins } from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import { CabinetSinrMonitorChartsOptions } from '@/const/data/cabinet';
import {
  elParseDaterangepickerOption,
  parseDateRange,
  parseDaterangepickerOption
} from '@/utils/misc';
import LoadPageMixin, { LoadPageMixinInstance } from '@/mixins/loadPage';
import SearchMixin, { SearchMixinInstance } from '@/mixins/search';
import { DefaultApiType } from '@/interface';
import { getCabinetHardwareInfo$ } from '@/api/monitor';
import ElDatePicker from '@/components/shared/ElDatePicker.vue';

@Component({
  components: { ElDatePicker }
})
export default class SnirMonitor extends mixins(LoadPageMixin, SearchMixin)
  implements LoadPageMixinInstance, SearchMixinInstance {
  @Prop() cabinetId!: any;
  queryDateTimeRange: Date[] = parseDateRange('today', false)();
  defaultApi: DefaultApiType = getCabinetHardwareInfo$;
  defaultParams: any = {
    cabinet_id: this.cabinetId,
    from: this.queryDateTimeRange[0],
    to: this.queryDateTimeRange[1],
    info_type: 'SNIR'
  };
  isMounted = false;
  chartsOptions = { ...CabinetSinrMonitorChartsOptions };
  // 限制搜索范围7天
  limit = 7;
  timeRadio = 'today';

  mounted() {
    this.isMounted = true;
  }

  searchSchema: any = {
    ...this.defaultParams
  };

  @Watch('state', { immediate: true })
  stateChanged(state: any) {
    if (state.isFulfill) {
      const {
        payload: { data }
      } = state;
      this.chartsClear();
      const chart = (this.$refs.highcharts as any).chart;
      const { xAxis, series }: any = this.chartsOptions;

      data.forEach((e: any) => {
        series[0].data.push([e.time, e.signal_noise_ratio]);
      });

      chart.update(this.chartsOptions as any);
    }
  }

  radioChange(v: string) {
    if (v) {
      this.queryDateTimeRange = parseDateRange(v, false)();
      this.search();
    }
  }

  search() {
    this.searchSchema.from = this.queryDateTimeRange[0];
    this.searchSchema.to = this.queryDateTimeRange[1];
    this.loadDefaultApi({ ...this.searchSchema });
  }

  transformParams(params: any) {
    return params;
  }

  chartsClear() {
    const { chart }: any = this.$refs.highcharts;
    const { series } = this.chartsOptions;
    series[0].data = [];
    chart.update(this.chartsOptions);
  }

  dateChange(v: any) {
    this.timeRadio = '';
    const diff = (v[1] - v[0]) / (1000 * 60 * 60 * 24);
    if (Math.abs(diff) >= this.limit) {
      this.$Message.error(`时间范围应小于${this.limit}天`);
      this.queryDateTimeRange = parseDateRange('last day', false)();
    }
  }

  get datePickerOption() {
    return elParseDaterangepickerOption(
      [
        { text: '今天', distance: 'today' },
        { text: '近六个小时', distance: 'last 6 hour' },
        { text: '近一小时', distance: 'last hour' }
      ],
      false
    );
  }
}
</script>

<style scoped>
.font18 {
  font-size: 18px;
}
.mt20 {
  margin-top: 20px;
}
</style>
