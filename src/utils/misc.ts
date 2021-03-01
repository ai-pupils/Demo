import _ from 'lodash';
import moment from 'moment';
import { ConstDataType } from '@/interface';

/* eslint-disable  */
export const parseDateRange = (distance: any, withoutToday = true) => {
  const start = moment();
  const end = moment();
  if (distance !== 'today') {
    if (withoutToday) {
      start.add(-1, 'd');
      end.add(-1, 'd');
    }
    switch (distance) {
      case 'today':
        break;
      case 'last day':
        start.add(-1, 'd');
        break;
      case 'last week':
        start.add(-1, 'w');
        break;
      case 'last month':
        start.add(-1, 'M');
        break;
      case 'three month':
        start.add(-3, 'M');
        break;
      case 'two month':
        start.add(-2, 'M');
        break;
      case 'four month':
        start.add(-4, 'M');
        break;
      case 'last real week':
        start.add(-1, 'w');
        end.add(1, 'd');
        break;
      case 'last real month':
        start.add(-1, 'M');
        end.add(1, 'd');
        break;
      case 'last real three month':
        start.add(-3, 'M');
        end.add(1, 'd');
        break;
    }
  }
  let startDate = moment([
    start.get('year'),
    start.get('month'),
    start.get('date'),
    0,
    0,
    0
  ]).toDate();
  let endDate = moment([
    end.get('year'),
    end.get('month'),
    end.get('date'),
    0,
    0,
    0
  ]).toDate();
  if (distance === 'last hour') {
    startDate = moment()
      .add(-1, 'h')
      .toDate();
  }
  if (distance === 'last 6 hour') {
    startDate = moment()
      .add(-6, 'h')
      .toDate();
  }
  if (
    distance === 'today' ||
    distance === 'last hour' ||
    distance === 'last 6 hour'
  ) {
    endDate = moment().toDate();
  }
  return () => [startDate, endDate];
};

export const parseDaterangepickerOption = (
  shortcuts: any,
  withoutToday = true,
  allowOverToday = false
) => {
  const sc = _.map(shortcuts, ({ text, distance }) => ({
    text,
    value: parseDateRange(distance, withoutToday)
  }));

  return {
    shortcuts: sc,
    disabledDate(date: any) {
      if (allowOverToday) return false;

      return date && date.valueOf() > Date.now();
    }
  };
};

export const parseQueryDate = (
  from: string,
  to: string,
  withoutToday = true
) => {
  return {
    from: moment(from)
      .utc()
      .format('YYYY-MM-DD HH:mm:ss'),
    to: moment(to)
      .add(withoutToday ? 1 : 0, 'd')
      .utc()
      .format('YYYY-MM-DD HH:mm:ss')
  };
};

export const parseDate = (distance: any) => {
  const day = moment();
  if (distance !== 'today') {
    switch (distance) {
      case 'yesterday':
        day.add(-1, 'd');
        break;
      case 'last week':
        day.add(-1, 'w');
        break;
      case 'two week':
        day.add(-2, 'w');
        break;
      case 'three week':
        day.add(-3, 'w');
        break;
      case 'last month':
        day.add(-1, 'M');
        break;
      case 'two month':
        day.add(-2, 'M');
        break;
      case 'three month':
        day.add(-3, 'M');
        break;
    }
  }

  const dayDate = day.toDate();

  return () => dayDate;
};

export const parseDatepickerOption = (shortcuts: any) => {
  const sc = _.map(shortcuts, ({ text, distance }) => ({
    text,
    value: parseDate(distance)
  }));

  return {
    shortcuts: sc,
    disabledDate(date: any) {
      return date && date.valueOf() > Date.now();
    }
  };
};

export const getLabel = (array: any, id: number) => {
  const item = _.find(array, i => i.id === id);
  if (item) {
    return item.label;
  }
  return id;
};

export const createEmptyTrackMeta = (init_payload = null) => {
  return {
    isFetching: true,
    isError: false,
    error: undefined,
    payload: init_payload,
    isFulfill: false
  };
};

export const fomatFloat = (src: number, pos: number) => {
  return Math.round(src * Math.pow(10, pos)) / Math.pow(10, pos);
};

export const getConstDataTypeLabel = (type: ConstDataType, key: string) =>
  type[key] ? type[key].label : '';

// 部分查询接口需要使用特殊时间段查询
export const getRealTime = (queryDate: any) => {
  let start = moment(queryDate[0]);
  let end = moment(queryDate[1]);
  let startData = moment([
    start.get('year'),
    start.get('month'),
    start.get('date'),
    16,
    0,
    0
  ])
    .add(-1, 'd')
    .format('YYYY-MM-DD HH:mm:ss');

  let endData = moment([
    end.get('year'),
    end.get('month'),
    end.get('date'),
    16,
    0,
    0
  ]).format('YYYY-MM-DD HH:mm:ss');

  return [startData, endData];
};

// 401处理
export function toSamlLogin() {
  window.location.replace(
    `/passport/saml_login?redirect=${encodeURIComponent(location.href)}`
  );
}

export const parseQueryDateTime = (queryDate: any) => {
  return [
    moment(queryDate[0])
      .utc()
      .format('YYYY-MM-DD HH:mm:ss'),
    moment(queryDate[1])
      .utc()
      .format('YYYY-MM-DD HH:mm:ss')
  ];
};

export const elParseDaterangepickerOption = (
  shortcuts: any[],
  withoutToday = true,
  allowOverToday = false
) => {
  const sc = _.map(shortcuts, ({ text, distance }) => ({
    text,
    onClick: (picker: any) => datePickerOnClick(picker, distance, withoutToday)
  }));

  return {
    shortcuts: sc,
    disabledDate(date: any) {
      if (allowOverToday) return false;

      return date && date.valueOf() > Date.now();
    }
  };
};

export const datePickerOnClick = (
  picker: any,
  distance: string,
  withoutToday: boolean
) => {
  picker.$emit('pick', parseDateRange(distance, withoutToday)());
};
