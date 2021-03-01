export const barChartsOptions = {
  credits: {
    enabled: false
  },
  chart: {
    type: 'column',
    zoomType: 'xy',
    height: 400
  },
  title: {
    text: '',
    useHTML: true,
    verticalAlign: 'middle'
  },
  xAxis: [
    {
      categories: [],
      crosshair: true
    }
  ],
  tooltip: {
    headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
    pointFormat:
      '<table><tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
      '<td style="padding:0"><b>{point.y}</b></td></tr></table>',
    footerFormat: '</table>',
    shared: true,
    useHTML: true,
    followPointer: true
  },
  yAxis: [
    {
      min: 0,
      max: null,
      labels: {
        format: '{value}',
        style: {
          color: '#000'
        }
      },
      title: {
        text: ''
      }
    }
  ],
  series: [
    {
      name: '运营设备',
      data: [],
      color: '#66CD00'
    },
    {
      name: '离线设备',
      data: [],
      color: 'rgba(139,139,122)'
    },
    {
      name: '故障锁柜',
      data: [],
      color: 'rgba(238, 201, 0)'
    },
    {
      name: '非故障锁柜',
      data: [],
      color: 'rgba(255, 127, 36)'
    }
  ]
};

export const pieChartsOptions = {
  credits: {
    enabled: false
  },
  chart: {
    type: 'pie',
    spacing: [40, 0, 40, 0],
    height: 400
  },
  title: {
    floating: true,
    text: '',
    useHTML: true
  },
  tooltip: {
    pointFormat: '{series.name}: <b>{point.y}</b>'
  },
  plotOptions: {
    pie: {
      allowPointSelect: true,
      cursor: 'pointer',
      dataLabels: {
        enabled: true,
        format: '<b>{point.name}</b>: {point.percentage:.1f} %'
      },
      point: {
        events: {
          mouseOver: (e: any) => {}
        }
      }
    }
  },
  series: [
    {
      innerSize: '80%',
      name: '数量',
      data: [
        {
          name: '运营设备',
          dataLabels: 'available_count',
          color: '#66CD00',
          y: 0
        },
        {
          name: '离线设备',
          dataLabels: 'offline_count',
          color: 'rgba(139,139,122)',
          y: 0
        },
        {
          name: '故障锁柜',
          dataLabels: 'fault_count',
          color: 'rgba(238, 201, 0)',
          y: 0
        },
        {
          name: '非故障锁柜',
          dataLabels: 'locked_count',
          color: 'rgba(255, 127, 36)',
          y: 0
        }
      ]
    }
  ]
};

export const lineChartsOptions: any = {
  credits: {
    enabled: false
  },
  chart: {
    type: 'line',
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
      labels: {
        format: '{value}%',
        style: {
          color: '#000'
        }
      },
      title: {
        text: ''
      }
    }
  ],
  tooltip: {
    shared: true,
    pointFormat:
      '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
      '<td style="padding:0"><b>{point.y}</b></td></tr>',
    footerFormat: '</table>',
    valueSuffix: ' %'
  },
  series: [
    {
      name: '设备故障率',
      data: [],
      color: '#2db7f5'
    }
  ]
};
