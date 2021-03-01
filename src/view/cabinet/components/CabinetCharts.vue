<template lang="pug">
  .charts
    Row(:gutter="24")
      Col(span="8")
        Card
          highcharts.chart-box(:options='chart1', ref='chart1')
          Spin(size='large' fix v-if='cabinetStatusInfo.isFetching')
      Col(span="8")
        Card
          highcharts.chart-box(:options='chart2', ref='chart2')
          Spin(size='large' fix v-if='cabinetRuntimeStatusInfo.isFetching')
      Col(span="8")
        Card
          highcharts.chart-box(:options='chart3', ref='chart3')
          Spin(size='large' fix v-if='cabinetErrorStatusInfo.isFetching')
</template>

<script lang="ts">

  import {Prop, Watch} from "vue-property-decorator";

  const totalChartsOptions1 = {
    credits: {
      enabled: false
    },
    chart: {
      type: 'pie',
      height: 600,
      margin: [80,0,150,0]
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        // dataLabels: {
        //     enabled: false
        // },
        showInLegend: true
      }
    },
    title: {
      text: '运营状态分布图',
      // margin: 30,
      // verticalAlign: 'bottom'
    },
    tooltip: {
      shared: true,
      pointFormat: '<span style="color:{point.color}">\u25CF</span> {series.name}: <b>{point.y}</b><br/>',
      // valueDecimals: 2
    },
    series: [{
      name: '数量',
      data: [{
        name: '可用',
        y: 0,
        dataLabels: 'available',
        sliced: true,
        selected: true,
        color: '#66CD00'
      }, {
        name: '待关联服务',
        dataLabels: 'authorized',
        y: 0,
        color: '#EEEE00'
      }, {
        name: '待激活',
        dataLabels: 'disable',
        y: 0,
        color: '#2db7f5'
      }, {
        name: '下线',
        dataLabels: 'logout',
        y: 0,
        color: '#FF4500'
      }]
    }]
  };

  const totalChartsOptions2 = {
    credits: {
      enabled: false
    },
    chart: {
      type: 'pie',
      height: 600,
      margin: [80,0,150,0]
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        // dataLabels: {
        //     enabled: false
        // },
        showInLegend: true
      }
    },
    title: {
      text: '运行状态分布图',
      // margin: 30,
      // verticalAlign: 'bottom'
    },
    tooltip: {
      shared: true,
      pointFormat: '<span style="color:{point.color}">\u25CF</span> {series.name}: <b>{point.y}</b><br/>',
      // valueDecimals: 2
    },
    series: [{
      name: '数量',
      data: [{
        name: '正常',
        dataLabels: 'available',
        y: 0,
        sliced: true,
        selected: true,
        color: '#66CD00'
      }, {
        name: '未知',
        dataLabels: 'unsupported',
        y: 0,
        color: '#2db7f5'
      }, {
        name: '未联网激活',
        dataLabels: 'unactivated',
        y: 0,
        color: '#CD950C'
      }, {
        name: '异常',
        dataLabels: 'exceptional',
        y: 0,
        color: '#EEEE00'
      }, {
        name: '已锁定',
        dataLabels: 'locked_down',
        y: 0,
        color: '#000080'
      }, {
        name: '维护中',
        dataLabels: 'maintenance',
        y: 0,
        color: '#BEBEBE'
      }, {
        name: '离线',
        dataLabels: 'offline',
        y: 0,
        color: '#FF4500'
      }]
    }]
  };

  const totalChartsOptions3 = {
    credits: {
      enabled: false
    },
    chart: {
      type: 'pie',
      height: 600,
      margin: [80,0,150,0]
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        // dataLabels: {
        //     enabled: false
        // },
        showInLegend: true
      }
    },
    title: {
      text: '货柜异常Top10分布图',
      // margin: 30,
      // verticalAlign: 'bottom'
    },
    tooltip: {
      shared: true,
      pointFormat: '<span style="color:{point.color}">\u25CF</span> {series.name}: <b>{point.y}</b><br/>',
      // valueDecimals: 2
    },
    series: [{
      name: '数量',
      colorByPoint: true,
      data: []
    }]
  };

  import Vue from 'vue';
  import Component from 'vue-class-component';

  @Component({})
  export default class CabinetCharts extends Vue {
    @Prop() cabinetStatusInfo: any;
    @Prop() cabinetRuntimeStatusInfo: any;
    @Prop() cabinetErrorStatusInfo: any;
    chart1: any = {...totalChartsOptions1};
    chart2: any = {...totalChartsOptions2};
    chart3: any = {...totalChartsOptions3};

    @Watch('cabinetStatusInfo', {immediate: true})
    cabinetStatusInfoChange(val: any) {
      this.setChart1Data({...val});
    }

    @Watch('cabinetRuntimeStatusInfo', {immediate: true})
    cabinetRuntimeStatusInfoChange(val: any) {
      this.setChart2Data({...val});
    }

    @Watch('cabinetErrorStatusInfo', {immediate: true})
    cabinetErrorStatusInfoChange(val: any) {
      this.setChart3Data({...val});
    }

    setChart1Data(info: any) {
      if (info.isFulfill) {
        const {results} = info.payload.data;
        const {series} = this.chart1;
        this.charts1Clear();
        results.forEach((e: any) => {
          const data = series[0].data.filter((d: any) => d.dataLabels === e.status);
          if (data && data.length > 0) {
            data[0].y = e.count;
          }
        });
      }
    }

    setChart2Data(info: any) {
      if (info.isFulfill) {
        const {results} = info.payload.data;
        const {series} = this.chart2;
        this.charts2Clear();
        results.forEach((e: any) => {
          const data = series[0].data.filter((d: any) => d.dataLabels === e.status);
          if (data && data.length > 0) {
            data[0].y = e.count;
          }
        });
      }
    }

    setChart3Data(info: any) {
      if (info.isFulfill) {
        const {results} = info.payload.data;
        const {series} = this.chart3;
        this.charts3Clear();
        results.forEach((e: any, i: number) => {
          if(i <10){
            series[0].data.push({
              name: e.name || '暂无',
              y: e.count
              // e.code
              // e.desc,
              // e.solution
            })
          }
        });
      }
    }

    charts1Clear() {
      const { chart }: any = this.$refs.chart1;
      const { series } = this.chart1;
      series[0].data.forEach((d: any) => {
        d.y = 0
      });
      chart.update(this.chart1);
    }

    charts2Clear() {
      const { chart }: any = this.$refs.chart2;
      const { series } = this.chart2;
      series[0].data.forEach((d: any) => {
        d.y = 0
      });
      chart.update(this.chart2);
    }

    charts3Clear() {
      const { chart }: any = this.$refs.chart3;
      const { series } = this.chart3;
      series[0].data = [];
      chart.update(this.chart3);
    }
  }
</script>

<style scoped>
  .chart-box {
    margin-top: 20px;
  }

</style>
