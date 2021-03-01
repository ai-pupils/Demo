import _ from 'lodash';
import Vue from 'vue';

export default {
  namespaced: true,
  state: {
    cabinets: []
  },
  getters: {
    cabinets(state) {
      const { cabinets } = state;
      return cabinets;
    }
  },
  mutations: {
    setCabinets(state, data) {
      const { cabinets } = state;
      const { name, row, rows = [], pageData = [] } = data;
      if (name === 'single') {
        const index = _.findIndex(cabinets, c => c.id === row.id);
        if (index > -1) {
          cabinets.splice(index, 1);
        } else {
          cabinets.push(row);
        }
      } else if (name === 'all') {
        if (rows.length > 0) {
          rows.forEach(c => {
            const index = _.findIndex(cabinets, e => e.id === c.id);
            if (index === -1) {
              cabinets.push(c);
            }
          });
        } else {
          const arr = [];
          cabinets.forEach(c => {
            const index = _.findIndex(pageData, e => e.id === c.id);
            if (index === -1) {
              arr.push(c);
            }
          });
          Vue.set(state, 'cabinets', arr);
        }
      }
    },
    clearCabinets(state) {
      state.cabinets = [];
    }
  }
};
