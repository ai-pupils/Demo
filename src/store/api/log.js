// import _ from 'lodash';
import axios from '@/utils/axios';
// import moment from 'moment';
// import {SERVICE_DATE_FORMAT} from '@/const';

export const getLogs = query => axios.get('/operation_logs.fl', {params: query});
