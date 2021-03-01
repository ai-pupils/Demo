import moment from 'moment';

export function greaterThan(n) {
  return (rule, value, cb) => {
    if (value > n) {
      cb();
    } else {
      cb(new Error(`expected ${value} > ${n}`));
    }
  };
}

export function afterDate(target) {
  target = moment(target).startOf('day').add(1, 'day');
  return (rule, value, cb) => {
    const source = moment(value);
    if (source.isSame(target) || source.isAfter(target)) {
      cb();
    } else {
      cb(new Error(`expected ${source} after ${target}`));
    }
  };
}

export function afterToday() {
  return afterDate(new Date());
}

export function startFromToday() {
  return afterDate(moment().subtract(1, 'day'));
}
