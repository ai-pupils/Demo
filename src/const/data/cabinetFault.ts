export const CabinetFaultResovedStatus = [
  {
    label: '待处理',
    id: 'PENDING'
  },
  {
    label: '已处理',
    id: 'RESOLVED'
  }
];

export const CabinetFaultTypes = [
  {
    label: '软件故障',
    id: 'SOFTWARE_FAILURE'
  },
  {
    label: '硬件故障',
    id: 'HARDWARE_FAILURE'
  },
  {
    label: '其他故障',
    id: 'OTHER'
  }
];

export const CabinetFaultSource = {
  EXCEPTION: {
    label: '异常转故障',
    id: 'EXCEPTION'
  },
  REPORT: {
    label: '上报故障',
    id: 'REPORT'
  }
};

export const CabinetFaultStatus = [
  {
    label: '无',
    id: 'NORMAL'
  },
  {
    label: '故障中',
    id: 'ABNORMAL'
  }
];
