/**
 * @deprecated import SkuPackageTypes from '@/const/data/sku'  instead
 */
export const packageType = [
  {
    value: 'BOTTLE',
    label: '瓶装',
    tagColor: 'red'
  },
  {
    value: 'CAN',
    label: '罐装',
    tagColor: 'green'
  },
  {
    value: 'BOX',
    label: '盒装',
    tagColor: 'blue'
  },
];

export const taskStatus = [
  {
    value: 'unfinished',
    label: '未完成',
    tagColor: 'blue'
  },
  {
    value: 'finished',
    label: '已完成',
    tagColor: 'green'
  }
];

export const JOB_STATUS_EMPTY = 'empty';
export const JOB_STATUS_UNREVIEWED = 'unreviewed';
export const JOB_STATUS_ACCEPTED = 'accepted';
export const JOB_STATUS_REJECTED = 'rejected';

export const jobStatus = [
  {
    value: JOB_STATUS_EMPTY,
    label: '未拍摄',
    tagColor: 'default'
  },
  {
    value: JOB_STATUS_UNREVIEWED,
    label: '待审核',
    tagColor: 'blue'
  },
  {
    value: JOB_STATUS_ACCEPTED,
    label: '审核通过',
    tagColor: 'green'
  },
  {
    value: JOB_STATUS_REJECTED,
    label: '审核不通过',
    tagColor: 'red'
  }
];

export const REVIEW_ACTION_STATUS_ACCEPT = 'accepted';
export const REVIEW_ACTION_STATUS_REJECT = 'rejected';
