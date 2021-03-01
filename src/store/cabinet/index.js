import actions from './actions';
import mutations from './mutations';

export default {
  namespaced: true,
  state: {
    cabinets: {}
  },
  getters: {
    cabinets(state) {
      const {cabinets} = state;
      if (cabinets.isFulfill) {
        return cabinets;
      }
      return cabinets;
    }
  },
  actions,
  mutations
};

