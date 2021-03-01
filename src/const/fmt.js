import moment from 'moment';

const toMoment = (o) => moment(typeof o === 'string' && !/Z$/.test(o) ? `${o}Z` : o);
const fmt = {
  formatDate: (utc) => utc ? toMoment(utc).format('YYYY-MM-DD HH:mm:ss') : '',
  parseDate: (date) => moment(date).toISOString().substring(0, 19),
  getTimesDiff: (utc) => moment(utc).diff(moment(), 'seconds'),
  moment
};

export default fmt;
