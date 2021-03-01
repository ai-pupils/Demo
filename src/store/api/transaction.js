import axios from '@/utils/axios';
import {parseQueryDate} from '@/utils/misc';

// 获取所有交易的宏观数据
const TRANSACTIONS = '/transactions.fl';
export const getTransactions = ({start, limit, isErrorOnly, verifyStatusChecked, sortBy = ['serial_id', 'desc'],
                                 keyword = '', from, to}) => {
  const queryDate = parseQueryDate(from, to);
  const params = {
    page_index: start,
    page_size: limit,
    search_text: keyword ? String(keyword).trim() : keyword,
    is_error_only: isErrorOnly,
    verify_status: verifyStatusChecked,
    sort_by: sortBy[0],
    sort_direction: sortBy[1],
    start_time: queryDate.from,
    end_time: queryDate.to
  };

  return axios.get(TRANSACTIONS, {params});
};

// 获取指定交易详细数据，包含inventory、detect-result、image-url、概况数据等
export const getTransactionDetails = ({serialId}) => axios.get(`/transactions/${serialId}.fl`);

// 审核transaction的用户feedback
export const setVerifyContent = (reportId, queryParam) => axios.post(
  `/transactions/report/${reportId}.fl`, queryParam, {paramType: 'form'});
