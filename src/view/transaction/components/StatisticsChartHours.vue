<template lang="pug">
  Card.mt20
    Form
      div.card-statistics-title 24小时统计图
      FormItem(label="日期:")
        Button(:type="this.dateType === 'last week' ? 'primary':'default'", @click="changeDateRange('last week')") 最近一周
        Button.ml5(:type="this.dateType === 'last month' ? 'primary':'default'", @click="changeDateRange('last month')") 最近一个月
    .charts
      Row
        Col
          highcharts.chart-box(:options="chartsOptions", ref="dayshighcharts")
    Spin(size="large", fix, v-if="isFetching")
</template>


<script lang="ts">
import Component, { mixins } from 'vue-class-component';
import AppDatePicker from '@/components/shared/AppDatePicker.vue';
import ComponentOptionsMixin from '@/mixins/componentOptions';
import { fomatFloat, parseDateRange } from '@/utils/misc';
import { Watch } from 'vue-property-decorator';
import { getTrxCount$ } from '@/api/transaction';
import { MetaType } from '@/interface';
import { finalize, mergeMap } from 'rxjs/operators';

const chartsOptions: any = {
  credits: {
    enabled: false
  },
  chart: {
    zoomType: 'xy'
  },
  title: {
    text: ''
  },
  xAxis: [
    {
      categories: [],
      crosshair: true
    }
  ],
  yAxis: [
    {
      min: 0,
      max: null,
      opposite: true,
      labels: {
        format: '{value}',
        style: {
          color: '#ed4014'
        }
      },
      visible: false
    },
    {
      //   gridLineWidth: 0,
      title: {
        text: '',
        style: {
          color: '#000'
        }
      },
      labels: {
        format: '{value} ',
        style: {
          color: '#000'
        }
      }
    }
  ],
  tooltip: {
    shared: true
  },
  series: [
    {
      name: '交易商品数',
      type: 'column',
      yAxis: 1,
      data: [],
      // tooltip: {
      //     valueSuffix: ' '
      // },
      color: '#66CD00'
    },
    {
      name: '交易数',
      type: 'column',
      yAxis: 1,
      data: [],
      // tooltip: {
      //     valueSuffix: ' '
      // },
      color: '#2db7f5'
    },
    {
      name: '失败交易数',
      type: 'column',
      yAxis: 1,
      data: [],
      // tooltip: {
      //     valueSuffix: ' '
      // },
      color: '#ff9900'
    },
    {
      name: '错误交易数',
      type: 'column',
      yAxis: 1,
      data: [],
      // tooltip: {
      //     valueSuffix: ' '
      // },
      color: '#ed4014'
    }
  ]
};

@Component({
  components: { AppDatePicker }
})
export default class StatisticsChartDay extends mixins(ComponentOptionsMixin) {
  dateType: string = 'last week';
  queryDateRange: Date[] = parseDateRange(this.dateType, false)();
  skuCount: number = 0;
  skuTransactionCount: number = 0;
  trxErrorRatio: number = 0;
  trxAnomalyRatio: number = 0;
  chartsOptions = { ...chartsOptions };

  created() {
    this.changeDateRange(this.dateType);
  }

  queryDateRangeChange(date: any[]) {
    this.startFetch$()
      .pipe(
        mergeMap(() =>
          getTrxCount$({
            startTime: date[0],
            endTime: date[1],
            groupBy: '24hours'
          })
        ),
        finalize(() => {
          this.endFetch();
        })
      )
      .subscribe((state: MetaType) => {
        if (state.isFulfill) {
          this.state = { ...state };
          this.clear();
          this.initChart();
        }
      });
  }

  initChart() {
    const chart = (this.$refs.dayshighcharts as any).chart;
    const { results }: any = this.stateData;
    const { xAxis, series }: any = this.chartsOptions;
    xAxis[0].categories = results.map(
      (e: any) => `${Number(e.time)}-${Number(e.time) + 1}时`
    );
    results.forEach((e: any) => {
      series[0].data.push(e.sku_transaction_count);
      series[1].data.push(e.trx_count);
      series[2].data.push(e.trx_anomaly_count);
      series[3].data.push(e.trx_error_count);
    });

    chart.update(this.chartsOptions as any);
  }

  clear() {
    const chart = (this.$refs.dayshighcharts as any).chart;
    const { series } = this.chartsOptions;

    series[0].data = [];
    series[1].data = [];
    series[2].data = [];
    series[3].data = [];
    chart.update(this.chartsOptions as any);
  }

  changeDateRange(range: string) {
    this.dateType = range;
    this.queryDateRange = parseDateRange(this.dateType, false)();
    this.queryDateRangeChange(this.queryDateRange);
  }
}
</script>
