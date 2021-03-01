export const TicketStatusTypes: any = [
  {
    label: '待处理',
    name: 'PENDING,PROCESSING',
    person_type: 'DEALER'
  },
  {
    label: '待商户反馈',
    name: 'PROCESSING',
    person_type: 'STAFF'
  },
  {
    label: '已结单',
    name: 'DONE'
  }
];

export enum TicketStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  DONE = 'DONE'
};
