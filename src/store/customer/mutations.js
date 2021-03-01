import {generateAsyncMutation} from '@/store/generateAsync';
import * as types from './mutationTypes';

export default {
  ...generateAsyncMutation(undefined, {mutateType: types.LOAD_CUSTOMERS, statePath: 'customers'}),
  ...generateAsyncMutation(undefined, {mutateType: types.LOAD_CUSTOMER_LICENSES, statePath: 'customerLicenses'})
};
