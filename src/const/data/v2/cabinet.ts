export const CabinetStatusTypes = {
  AVAILABLE: {
    id: 'AVAILABLE',
    label: '可用'
  },
  DISABLED: {
    id: 'DISABLED',
    label: '待激活'
  },
  AUTHORIZED: {
    id: 'AUTHORIZED',
    label: '待关联服务'
  },
  LOGOUT: {
    id: 'LOGOUT',
    label: '已下线'
  }
};

export const CabinetRuntimeStatusTypes = {
  AVAILABLE: {
    id: 'AVAILABLE',
    label: '正常'
  },
  ABNORMAL: {
    id: 'ABNORMAL',
    label: '异常'
  },
  OPENED: {
    id: 'OPENED',
    label: '使用中'
  },
  LOCKED: {
    id: 'LOCKED',
    label: '已锁定'
  },
  UNDER_MAINTENANCE: {
    id: 'UNDER_MAINTENANCE',
    label: '维护中'
  },
  UNSUPPORTED: {
    id: 'UNSUPPORTED',
    label: '未知'
  },
  UNACTIVATED: {
    id: 'UNACTIVATED',
    label: '未联网激活'
  },
  OFFLINE: {
    id: 'OFFLINE',
    label: '离线'
  }
};

export const CabinetArchTypes = [
  {
    id: 'STATIC',
    label: '静态'
  },
  {
    id: 'S2G',
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
