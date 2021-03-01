export const skuBundleReviewedStatus: any = {
  initialized: {
    id: 'initialized',
    label: '草稿'
  },
  'in_review+undefined': {
    id: 'in_review+undefined',
    label: '待一次初审',
    color: 'red'
  },
  'in_review+REJECTED_FIRST': {
    id: 'in_review+REJECTED_FIRST',
    label: '待一次初审',
    color: 'red'
  },
  'in_review+REJECTED_SECOND': {
    id: 'in_review+REJECTED_SECOND',
    label: '待一次初审',
    color: 'red'
  },
  'in_review+REJECTED_THIRD': {
    id: 'in_review+REJECTED_THIRD',
    label: '待一次初审',
    color: 'red'
  },
  'in_review+ACCEPTED_FIRST': {
    id: 'in_review+ACCEPTED_FIRST',
    label: '待二次初审',
    color: 'orange'
  },
  'in_review+ACCEPTED_SECOND': {
    id: 'in_review+ACCEPTED_SECOND',
    label: '待复审',
    color: 'geekblue'
  },
  approval: {
    id: 'approval',
    label: '审核通过',
    color: 'success'
  },
  refused: {
    id: 'refused',
    label: '审核未通过',
    color: 'error'
  },
  deploying: {
    id: 'deploying',
    label: '审核通过',
    color: 'success'
  },
  discarded: {
    id: 'discarded',
    label: '已删除'
  }
};

export const skuBundleStatus: any = [
  {
    id: true,
    label: '可用',
    color: 'green'
  },
  {
    id: false,
    label: '不可用',
    color: 'red'
  }
];

export const skuBundleOperationStatus: any = [
  {
    id: 'in_operation',
    label: '无'
  },
  {
    id: 'replenishing',
    label: '换货中'
  }
];

export const skuBundleLogStatus: any = {
  PENDING: '创建商品组',
  REVIEWING: '送审商品组',
  ACCEPTED_FIRST: '运营一次初审',
  ACCEPTED_SECOND: '运营二次初审',
  ACCEPTED_THIRD: '运营总监复审',
  REJECTED_FIRST: '运营一次初审',
  REJECTED_SECOND: '运营二次初审',
  REJECTED_THIRD: '运营总监复审',
  'TRAINING+ACCEPTED_THIRD': "运营总监复审",
  'PENDING+TRAINING': '自动审核',
  'PENDING+ACCEPTED': '自动审核',
  'PENDING+DEPLOYING': '自动审核'
};
