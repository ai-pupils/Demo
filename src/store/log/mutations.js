// import _ from 'lodash';
import {generateAsyncMutation} from '@/store/generateAsync';
import {
  OPERATION_LOGS
} from './mutationTypes';

export default {
  ...generateAsyncMutation(undefined, {mutateType: OPERATION_LOGS, statePath: 'logs'})
};
