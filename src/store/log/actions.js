import {generateAsyncAction} from '@/store/generateAsync';
import {
  getLogs
} from '@/store/api/log';
import {
  OPERATION_LOGS
} from './mutationTypes';

export default {
  getLogs: generateAsyncAction(getLogs, {mutateType: OPERATION_LOGS})
};
