import {generateAsyncAction} from '@/store/generateAsync';
import * as api from '@/store/api/transaction';
import * as types from './mutationTypes';

export default {
  getTransactions: generateAsyncAction(api.getTransactions, {mutateType: types.LOAD_TRANSACTIONS}),
  getTransactionDetails: generateAsyncAction(
    api.getTransactionDetails, {mutateType: types.LOAD_TRANSACTION_DETAILS}
  ),
};
