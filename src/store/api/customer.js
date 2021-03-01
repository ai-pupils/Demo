import axios from '@/utils/axios';


const CUSTOMERS = '/customers.fl';
export const getCustomers = ({start, limit, sortBy = ['user_id', 'desc'],
                               keyword = ''}) => {
  const params = {
    page_index: start,
    page_size: limit,
    search_text: keyword ? String(keyword).trim() : keyword,
    sort_by: sortBy[0],
    sort_direction: sortBy[1]
  };

  return axios.get(CUSTOMERS, {params});
};

const CUSTOMERLICENSES = '/licenses.fl';
export const getCustomerLicenses = ({customerId, customerType}) => {
  const params = {
    customer_id: customerId,
    customer_type: customerType
  };
  return axios.get(CUSTOMERLICENSES, {params});
};
