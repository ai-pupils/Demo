import {generateAsyncMutation} from '@/store/generateAsync';
import * as types from './mutationTypes';

export default {
  ...generateAsyncMutation(undefined, {mutateType: types.LOAD_TRANSACTIONS, statePath: 'transactions'}),
  ...generateAsyncMutation(undefined, {mutateType: types.LOAD_TRANSACTION_DETAILS, statePath: 'transactionDetails'}),
  setTransactionDetail(state, data) {
    state.transactionDetails = data;
  }
};
