import _ from 'lodash';

const toFixed = (val, digit = 2) => {
  if (_.isNumber(+val)) {
    return val.toFixed(digit);
  }
  return val;
};

export default {
  install(Vue) {
    Vue.filter('toFixed', toFixed);
    Vue.filter('percent', (v) => {
      if (_.isNumber(v)) {
        return `${(v * 100).toFixed(2)}%`;
      }
      return v;
    });
  }
};
