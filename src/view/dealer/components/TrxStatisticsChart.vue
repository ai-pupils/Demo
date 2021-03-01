<template lang="pug">
  Card.mt20
    Form
      div.card-statistics-title 交易日统计图
      FormItem(label="日期:")
        AppDatePicker(v-model="queryDateRange")
    .charts
      Row
        Col.text-center(:span="6")
          div 交易数
          .bold {{skuCount}}
        Col.text-center(:span="6")
          div 交易商品数
          .bold {{skuTransactionCount}}
        Col.text-center(:span="6")
          div 失败交易率
            ElementTooltip(content="异常交易率 = 异常交易数 / 总交易数 × 100%", placement="top")
              Icon.hover-pointer(type="ios-information-circle-outline")
          .bold {{trxAnomalyRatio}}%
        Col.text-center(:span="6")
          div 错误交易率
            ElementTooltip(content="错误交易率 = 错误交易数 / ( 总交易数 - 异常交易数 ) × 100%", placement="top")
              Icon.hover-pointer(type="ios-information-circle-outline")
          .bold {{trxErrorRatio}}%
      Row
        Col
          highcharts.chart-box(:options="chartsOptions", ref="dayshighcharts")
    Spin(size="large", fix, v-if="isFetching")
</template>

<script lang="ts">

  import Vue from 'vue';
  import Component from 'vue-class-component';
  import AppDatePicker from '@/components/shared/AppDatePicker.vue';
  import ComponentOptionsMixin from '@/mixins/componentOptions';
  import {fomatFloat, parseDateRange} from '@/utils/misc';
  import {Prop, Watch} from 'vue-property-decorator';
  import {getTrxCount$} from '@/api/transaction';
  import {MetaType} from '@/interface';
  import {finalize, mergeMap} from 'rxjs/operators';

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
    components: {AppDatePicker}
  })
  export default class TrxStatisticsChart extends ComponentOptionsMixin {
    @Prop() dealerId!: number;
    queryDateRange: Date[] = parseDateRange('last week', false)();
    skuCount: number = 0;
    skuTransactionCount: number = 0;
    trxErrorRatio: number = 0;
    trxAnomalyRatio: number = 0;
    chartsOptions = {...chartsOptions};

    @Watch('queryDateRange')
    queryDateRangeChange(date: any[]) {
      this.startFetch$()
        .pipe(
          mergeMap(() =>
            getTrxCount$({
              dealerId: this.dealerId,
              startTime: date[0],
              endTime: date[1],
              groupBy: 'day'
            })
          ),
          finalize(() => {
            this.endFetch();
          })
        )
        .subscribe((state: MetaType) => {
          if (state.isFulfill) {
            this.state = {...state};
            this.setTotalCount();
            this.clear();
            this.initChart();
          }
        });
    }

    setTotalCount() {
      const {total} = this.stateData;
      this.skuCount = total.trx_count || 0;
      this.skuTransactionCount = total.sku_transaction_count || 0;
      this.trxErrorRatio = fomatFloat((total.trx_error_ratio || 0) * 100, 2);
      this.trxAnomalyRatio = fomatFloat((total.trx_anomaly_ratio || 0) * 100, 2);
    }

    initChart() {
      const chart = (this.$refs.dayshighcharts as any).chart;
      const {results}: any = this.stateData;
      const {xAxis, series}: any = this.chartsOptions;
      xAxis[0].categories = results.map((e: any) => `${String(e.time)}`);
      results.forEach((e: any) => {
        series[0].data.push(e.sku_transaction_count);
        series[1].data.push(e.trx_count);
        series[2].data.push(e.trx_anomaly_count);
        series[3].data.push(e.trx_error_count);
      });
      chart.update(this.chartsOptions);
    }

    clear() {
      const chart = (this.$refs.dayshighcharts as any).chart;
      const {series} = this.chartsOptions;
      series![0].data = [];
      series![1].data = [];
      series![2].data = [];
      series![3].data = [];
      chart.update(this.chartsOptions);
    }

  }
</script>

<style scoped>

</style>