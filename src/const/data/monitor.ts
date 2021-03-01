export const ExceptionTypes: any = [
  {
    label: '全部',
    name: 'all',
    codes: undefined
  },
  {
    label: '柜内环境异常',
    name: 'cab-env',
    codes: '10001,10002,10003,40417,40418,61200,73000,74030'
  },
  {
    label: '货柜离线',
    name: 'cab-logout',
    codes: '20000,20013'
  },
  {
    label: '锁异常',
    name: 'cab-lock',
    codes: '20002,74040'
  },
  {
    label: '摄像头异常',
    name: 'cab-camera',
    codes: '20003,50008,61000,61100'
  },
  {
    label: '灯异常',
    name: 'cab-light',
    codes: '10004'
  },
  {
    label: '商品放回异常',
    name: 'sku-put-back',
    codes: '74010'
  }
];

export const ExceptionPriorities = [
  { id: 'EXCEPTION', label: '高', color: 'red' },
  { id: 'WARNING', label: '中', color: 'gold' },
  { id: 'INFO', label: '低', color: 'green' },
  { id: 'DEBUG', label: 'Debug', color: 'lime' }
];

export const ExceptionStatus: any = {
  RESOLVED: {
    label: '已解决',
    id: 'RESOLVED',
    color: 'green'
  },
  PENDING: {
    label: '未解决',
    id: 'PENDING',
    color: 'red'
  },
  FALSE_ALARM: {
    label: '误报',
    id: 'FALSE_ALARM',
    color: 'purple'
  },
  HANDLING: {
    label: '解决中',
    id: 'HANDLING',
    color: 'blue'
  }
};

export const RecognitionAggregateList = [
  { id: 'dealer_id', label: '按商户统计' },
  { id: 'cabinet_type_id', label: '按柜体统计' },
  { id: 'cabinet_id', label: '按货柜统计' },
  { id: 'bundle_id', label: '按商品组统计' },
  { id: 'model_id', label: '按模型统计' },
  ];
