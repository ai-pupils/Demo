import {generateAsyncAction} from '@/store/generateAsync';
import * as api from '@/store/api/cabinet';
import * as types from './mutationTypes';

export default {
  getCabinets: generateAsyncAction(api.getCabinets, {mutateType: types.LOAD_CABINETS})
};
