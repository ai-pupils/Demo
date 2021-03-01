import {generateAsyncMutation} from '@/store/generateAsync';
import * as types from './mutationTypes';

export default {
  ...generateAsyncMutation(undefined, {mutateType: types.LOAD_SKUS, statePath: 'skus'}),
};
