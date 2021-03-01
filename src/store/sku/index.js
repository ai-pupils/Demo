import actions from './actions';
import mutations from './mutations';

export default {
  namespaced: true,
  state: {
    skus: {}
  },
  getters: {
    skus(state) {
      const { skus } = state;
      if (skus.isFulfill) {
        return skus;
      }

      return skus;
    }
  },
  actions,
  mutations
};
