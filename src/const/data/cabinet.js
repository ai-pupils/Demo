export const CabinetStatusTypes = [
  {
    id: 'available',
    label: '可用'
  },
  {
    id: 'disable',
    label: '待激活'
  },
  {
    id: 'authorized',
    label: '待关联服务'
  },
  {
    id: 'logout',
    label: '已下线'
  }
];

export const CabinetRuntimeStatusTypes = [
  {
    id: 'available',
    label: '正常'
  },
  {
    id: 'exceptional',
    label: '异常'
  },
  {
    id: 'locked_down',
    label: '已锁定'
  },
  {
    id: 'maintenance',
    label: '维护中'
  },
  {
    id: 'unsupported',
    label: '未知'
  },
  {
    id: 'unactivated',
    label: '未联网激活'
  },
  {
    id: 'offline',
    label: '离线'
  }
];

export const CabinetArchTypes = [
  {
    id: 'static',
    label: '静态'
  },
  {
    id: 's2g',
    label: '动态'
  }
];

export const CabinetTemperatureTypes = [
  {
    id: 'room_temperature',
    label: '常温'
  },
  {
    id: 'freezer',
    label: '冷冻'
  }
];

export const CabinetSinrMonitorChartsOptions = {
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
      crosshair: true,
      type: 'datetime',
      // categories: [], 如果type=datetime, data格式是[]里面带有时间，那么就不能写categories
      dateTimeLabelFormats: {
        millisecond: '%Y-%m-%d %H:%M',
        second: '%Y-%m-%d %H:%M',
        minute: '%Y-%m-%d %H:%M',
        hour: '%Y-%m-%d %H:%M',
        day: '%m-%d',
        week: '%m-%d',
        month: '%Y-%m',
        year: '%Y'
      }
    }
  ],
  tooltip: {
    headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
    pointFormat:
      '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
      '<td style="padding:0"><b>{point.y} dBm</b></td></tr>',
    footerFormat: '</table>',
    shared: true,
    useHTML: true,
    followPointer: true,
    valueDecimals: 2,
    dateTimeLabelFormats: {
      millisecond: '%Y-%m-%d %H:%M',
      second: '%Y-%m-%d %H:%M',
      minute: '%Y-%m-%d %H:%M',
      hour: '%Y-%m-%d %H:%M',
      day: '%m-%d',
      week: '%m-%d',
      month: '%Y-%m',
      year: '%Y'
    }
  },
  yAxis: [
    {
      min: null,
      max: null,
      labels: {
        format: '{value} %',
        style: {
          color: '#000'
        },
        // 格式化y坐标
        formatter: v => {
          if (v.value) {
            return v.value.toFixed(2);
          }
          return v.value;
        },
        enabled: true // 是否纵坐标显示坐标轴标签
      },
      title: {
        text: ''
      },
      gridLineColor: 'rgba(255,255,255,0)',
      plotOptions: {
        series: {
          marker: {
            enabled: false
          }
        }
      },
      plotBands: [
        {
          from: 0,
          to: 3,
          color: '#f8a7ad',
          label: {
            text: '极差点',
            style: {
              color: '#606060'
            }
          }
        },
        {
          from: 3,
          to: 10,
          color: '#fbd6a5',
          label: {
            text: '差点',
            style: {
              color: '#606060'
            }
          }
        },
        {
          from: 10,
          to: 15,
          color: '#fdeeda',
          label: {
            text: '中点',
            style: {
              color: '#606060'
            }
          }
        },
        {
          from: 15,
          to: 25,
          color: '#d8f6ee',
          label: {
            text: '好点',
            style: {
              color: '#606060'
            }
          }
        },
        {
          from: 25,
          to: 100,
          color: '#c5f2c9',
          label: {
            text: '极好点',
            style: {
              color: '#606060'
            }
          }
        }
      ]
    }
  ],
  series: [
    {
      name: '信噪比',
      data: [],
      color: '#3da1ee'
    }
  ]
};

export const CabinetSignalsMonitorChartsOptions = {
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
      crosshair: true,
      type: 'datetime',
      // categories: [], 如果type=datetime, data格式是[]里面带有时间，那么就不能写categories
      dateTimeLabelFormats: {
        millisecond: '%Y-%m-%d %H:%M',
        second: '%Y-%m-%d %H:%M',
        minute: '%Y-%m-%d %H:%M',
        hour: '%Y-%m-%d %H:%M',
        day: '%m-%d',
        week: '%m-%d',
        month: '%Y-%m',
        year: '%Y'
      }
    }
  ],
  tooltip: {
    headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
    pointFormat:
      '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
      '<td style="padding:0"><b>{point.y} dBm</b></td></tr>',
    footerFormat: '</table>',
    shared: true,
    useHTML: true,
    followPointer: true,
    valueDecimals: 2,
    dateTimeLabelFormats: {
      millisecond: '%Y-%m-%d %H:%M',
      second: '%Y-%m-%d %H:%M',
      minute: '%Y-%m-%d %H:%M',
      hour: '%Y-%m-%d %H:%M',
      day: '%m-%d',
      week: '%m-%d',
      month: '%Y-%m',
      year: '%Y'
    }
  },
  yAxis: [
    {
      min: null,
      max: null,
      labels: {
        format: '{value}',
        style: {
          color: '#000'
        },
        // 格式化y坐标
        formatter: v => {
          if (v.value) {
            return v.value.toFixed(2);
          }
          return v.value;
        },
        enabled: true // 是否纵坐标显示坐标轴标签
      },
      title: {
        text: ''
      },
      gridLineColor: 'rgba(255,255,255,0)',
      plotOptions: {
        series: {
          marker: {
            enabled: false
          }
        }
      },
      plotBands: [
        {
          from: -999,
          to: -115,
          color: '#f8a7ad',
          label: {
            text: '极差点',
            style: {
              color: '#606060'
            }
          }
        },
        {
          from: -115,
          to: -105,
          color: '#fbd6a5',
          label: {
            text: '差点',
            style: {
              color: '#606060'
            }
          }
        },
        {
          from: -105,
          to: -95,
          color: '#fdeeda',
          label: {
            text: '中点',
            style: {
              color: '#606060'
            }
          }
        },
        {
          from: -95,
          to: -85,
          color: '#d8f6ee',
          label: {
            text: '好点',
            style: {
              color: '#606060'
            }
          }
        },
        {
          from: -85,
          to: 999,
          color: '#c5f2c9',
          label: {
            text: '极好点',
            style: {
              color: '#606060'
            }
          }
        }
      ]
    }
  ],
  series: [
    {
      name: '信号强度',
      data: [],
      color: '#3da1ee'
    }
  ]
};

export const CabinetTemperatureMonitorChartsOptions = {
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
      crosshair: true,
      type: 'datetime',
      // categories: [], 如果type=datetime, data格式是[]里面带有时间，那么就不能写categories
      dateTimeLabelFormats: {
        millisecond: '%Y-%m-%d %H:%M',
        second: '%Y-%m-%d %H:%M',
        minute: '%Y-%m-%d %H:%M',
        hour: '%Y-%m-%d %H:%M',
        day: '%m-%d',
        week: '%m-%d',
        month: '%Y-%m',
        year: '%Y'
      }
    }
  ],
  tooltip: {
    headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
    pointFormat:
      '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
      '<td style="padding:0"><b>{point.y} ℃</b></td></tr>',
    footerFormat: '</table>',
    shared: true,
    useHTML: true,
    followPointer: true,
    valueDecimals: 2,
    dateTimeLabelFormats: {
      millisecond: '%Y-%m-%d %H:%M',
      second: '%Y-%m-%d %H:%M',
      minute: '%Y-%m-%d %H:%M',
      hour: '%Y-%m-%d %H:%M',
      day: '%m-%d',
      week: '%m-%d',
      month: '%Y-%m',
      year: '%Y'
    }
  },
  yAxis: [
    {
      min: null,
      max: null,
      labels: {
        format: '{value}',
        style: {
          color: '#000'
        },
        // 格式化y坐标
        formatter: v => {
          if (v.value) {
            return v.value.toFixed(2);
          }
          return v.value;
        },
        enabled: true // 是否纵坐标显示坐标轴标签
      },
      title: {
        text: ''
      },
      // gridLineColor: 'rgba(255,255,255,0)',
      plotOptions: {
        series: {
          marker: {
            enabled: false
          }
        }
      }
    }
  ],
  series: [
    {
      name: '温度',
      data: [],
      color: '#3da1ee'
    }
  ]
};
