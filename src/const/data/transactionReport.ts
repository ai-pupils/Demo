export const reportType: any = {
  error: {
    tagColor: 'warning',
    text: '错误'
  },
  success: {
    tagColor: 'success',
    text: '正确'
  }
};

export const verifyStatus: any = {
  waiting: {
    tagColor: 'red',
    text: '待处理',
    name: 'waiting'
  },
  resolved: {
    tagColor: 'green',
    text: '已处理',
    name: 'resolved'
  },
  rejected: {
    tagColor: 'blue',
    text: '无法处理',
    name: 'rejected'
  }
};

export const tags: any = [
  {
    label: '无法定位错误',
    errorCode: 33000,
    isChecked: false,
    color: 'orange'
  },
  {
    label: '识别错误',
    errorCode: 34000,
    isChecked: false,
    color: 'orange'
  },
  {
    label: '识别多框',
    errorCode: 31000,
    isChecked: false,
    color: 'orange'
  },
  {
    label: '识别少框',
    errorCode: 31001,
    isChecked: false,
    color: 'orange'
  },
  {
    label: '识别错框',
    errorCode: 31002,
    isChecked: false,
    color: 'orange'
  },
  {
    label: '起雾',
    errorCode: 32000,
    isChecked: false,
    color: 'orange'
  },
  {
    label: '有色条纹',
    errorCode: 32001,
    isChecked: false,
    color: 'orange'
  },
  {
    label: '对焦不准',
    errorCode: 32002,
    isChecked: false,
    color: 'orange'
  },
  {
    label: '脏污/裂纹',
    errorCode: 32003,
    isChecked: false,
    color: 'orange'
  },
  {
    label: '过曝',
    errorCode: 32004,
    isChecked: false,
    color: 'orange'
  },
  {
    label: '欠曝',
    errorCode: 32005,
    isChecked: false,
    color: 'orange'
  },
  {
    label: '灯光暗/熄灭',
    errorCode: 32006,
    isChecked: false,
    color: 'orange'
  },
  {
    label: '变色',
    errorCode: 32007,
    isChecked: false,
    color: 'orange'
  },
  {
    label: '多扣钱',
    errorCode: 40009,
    isChecked: false,
    color: 'orange'
  }
];
