// import _ from 'lodash';
import actions from './actions';
import mutations from './mutations';

export default {
  namespaced: true,
  state: {
    logs: {},
  },
  actions,
  mutations
};
