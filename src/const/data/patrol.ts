export const PatrolStatus: any[] = [
  {
    id: 'CREATED',
    label: '未完成'
  },
  {
    id: 'SUBMITTED',
    label: '已完成'
  }
];

export const PatrolAbnormalTypes: any[] = [
  {
    id: 'U_RULE_VOILATED',
    label: '未遵循U型摆放规则'
  },
  {
    id: 'GOODS_STACKED',
    label: '商品堆叠摆放'
  },
  {
    id: 'UNSUPPORTED_OBJECT',
    label: '放入异物（非售卖商品）'
  },
  {
    id: 'CAMERA',
    label: '摄像头异常'
  },
  {
    id: 'LIGHT',
    label: '灯带异常（灯带熄灭）'
  },
  {
    id: 'OTHER',
    label: '其他异常'
  }
];

export const PatrolItemStates: any[] = [
  {
    id: 'ABNORMAL',
    label: '运营异常'
  },
  {
    id: 'NORMAL',
    label: '无异常'
  }
];
