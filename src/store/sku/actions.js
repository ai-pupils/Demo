import { generateAsyncAction } from '@/store/generateAsync';
import * as api from '@/store/api/sku';
import * as types from './mutationTypes';

export default {
  getSkus: generateAsyncAction(api.getSkus, {
    mutateType: types.LOAD_SKUS
  })
};
