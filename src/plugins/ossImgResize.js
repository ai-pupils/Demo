import _ from 'lodash';

function normalizeOption(opt) {
  if (_.isNil(opt)) {
    return '';
  }
  const result = [];
  if (!_.isNaN(+opt)) {
    result.push(`w_${opt}`);
  }

  if (_.isString(opt.mode)) {
    result.push(opt.mode);
  }

  if (!_.isNaN(+opt.width)) {
    result.push(`w_${opt.width}`);
  }
  if (!_.isNaN(+opt.height)) {
    result.push(`h_${opt.height}`);
  }

  return `?x-oss-process=image/resize,${result.join(',')}`;
}
const resizeHostList = [/http:\/\/piu\.productai\.cn/,
/https?:\/\/webapp\.productai\.cn\/oss/];
export const resizeImg = (v, opt) => _.findIndex(resizeHostList, ptn => ptn.test(v) === true) >= 0 ?
  `${v}${normalizeOption(opt)}` :
  v;

export default {
  install(Vue) {
    Vue.filter('ossResize', resizeImg);
  }
};
