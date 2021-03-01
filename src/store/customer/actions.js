import {generateAsyncAction} from '@/store/generateAsync';
import * as api from '@/store/api/customer';
import * as types from './mutationTypes';

export default {
  getCustomers: generateAsyncAction(api.getCustomers, {mutateType: types.LOAD_CUSTOMERS}),
  getCustomerLicenses: generateAsyncAction(api.getCustomerLicenses,
    {mutateType: types.LOAD_CUSTOMER_LICENSES})
};
