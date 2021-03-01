import actions from './actions';
import mutations from './mutations';

export default {
  namespaced: true,
  state: {
    transactions: {},
    transactionDetails: {},
  },
  getters: {
    transactions(state) {
      const {transactions} = state;
      if (transactions.isFulfill) {
        return transactions;
      }
      return transactions;
    },
    transactionDetails(state) {
      const {transactionDetails} = state;
      if (transactionDetails.isFulfill) {
        return transactionDetails;
      }
      return transactionDetails;
    },
  },
  actions,
  mutations
};
