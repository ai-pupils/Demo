import moment from 'moment';
import fmt from '@/const/fmt';

export const DATE_FORMAT = 'YYYY-MM-DD';
export const DATETIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';
export const parse = (utcText) => moment(`${utcText}Z`);
export const toDate = (utcText) => utcText ? parse(utcText).format(DATE_FORMAT) : '-';
export const toDatetime = (utcText) => utcText ? parse(utcText).format(DATETIME_FORMAT) : '-';

export default {
  install(Vue) {
    Vue.filter('date', toDate);
    Vue.filter('datetime', toDatetime);
    Vue.filter('fmtLocalTime', (utc) => fmt.formatDate(utc));
    Vue.filter('timeDiff', ([end, start]) => {
      if (end && start) {
        const diff = moment.duration(moment(end) - moment(start), 'ms').locale('zh-cn');
        return `${diff.hours()}h ${diff.minutes()}m`;
      }
      return '-';
    });
  }
};
