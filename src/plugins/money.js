export const toRaw = (yuan) => yuan * 100;
export const toYuan = (raw) => (raw / 100).toFixed(2);
export const currencySymbol = {
  1: '￥',
  2: '$'
};
export const toHuman = (raw, type) => `${currencySymbol[type]} ${toYuan(raw).replace(/(\d)(?=(\d{3})+\b)/g, '$1,')}`;

export default {
  install(Vue) {
    Vue.filter('money', (raw, type = 1, format = 'human') => (format === 'human' ? toHuman : toYuan)(raw, type));
    Vue.filter('moneySymbol', (type) => type ? currencySymbol[type] : '');
  }
};
