import _ from 'lodash';
import Vue from 'vue';

export default {
  namespaced: true,
  state: {
    skus: [],
    // 循环利用
    conflictColors: [
      { bg: '#facc66', type: 'b' }, // 黄
      { bg: '#338cf0', type: 'w' }, // 蓝
      { bg: '#ee4000', type: 'w' }, // 红
      { bg: '#00ee76', type: 'b' }, // 绿
      { bg: '#7b68ee', type: 'w' }, // 紫
      { bg: '#EEA9B8', type: 'b' }, // 粉
      { bg: '#FFA500', type: 'b' }, // 橘
      { bg: '#00EEEE', type: 'b' }, // 青
      { bg: '#1C1C1C', type: 'w' }, // 灰
      { bg: '#EEEED1', type: 'b' }, // 浅黄
      { bg: '#ADD8E6', type: 'b' }, // 浅蓝
      { bg: '#FF6347', type: 'w' }, // 西红柿
      { bg: '#90EE90', type: 'b' }, // 浅绿
      { bg: '#FFAEB9', type: 'b' } // 浅粉
    ]
  },
  getters: {
    skus(state) {
      const { skus } = state;
      return skus;
    },
    conflictColor(state) {
      const { conflictColors } = state;
      const color = conflictColors[0];
      return color;
    }
  },
  mutations: {
    setSkus(state, data) {
      const { skus } = state;
      const { name, selections, row, source } = data;
      if (name === 'single') {
        const index = _.findIndex(skus, sku => sku.id === row.id);
        if (index > -1) {
          skus.splice(index, 1);
        } else {
          skus.push(row);
        }
      } else if (name === 'all') {
        if (selections.length > 0) {
          const items = _.concat([], skus, selections);
          Vue.set(state, 'skus', _.uniq(items));
        } else {
          const arr = [];
          skus.forEach(sku => {
            const index = _.findIndex(source, e => e.id === sku.id);
            if (index === -1) {
              arr.push(sku);
            }
          });
          Vue.set(state, 'skus', arr);
        }
      }
    },
    updateSkuBarcode(state, row) {
      const { skus } = state;
      const { id, barcode } = row;
      const sku = _.find(skus, ['id', id]);
      if (sku) {
        sku.barcode = barcode;
      }
    },
    clearSkus(state) {
      state.skus = [];
    },
    colorMoveToEnd(state) {
      const color = state.conflictColors.shift();
      state.conflictColors.push(color);
    }
  }
};
