import actions from './actions';
import mutations from './mutations';

export default {
  namespaced: true,
  state: {
    customers: {},
    customerLicenses: {}
  },
  getters: {
    customers(state) {
      const {customers} = state;
      if (customers.isFulfill) {
        return customers;
      }

      return customers;
    },
  },
  actions,
  mutations
};
