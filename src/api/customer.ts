import rxios from '@/utils/rxios';
import buildRequest from '@/utils/buildRequest';
import {DataResponse} from "@/interface";

const CUSTOMERS = '/customers.fl';

export interface GetCustomersParams {
  pageIndex: number;
  pageSize: number;
  sortBy?: string;
  sortDirection?: string;
  keyword?: string;
  customerType?: string;
  customerId?: string;
}

export interface GetCustomersData {
  link: string;
  created_at: string;
  expired_at: string;
  is_owner: boolean;
  operator: string;
}

// 获取客户
export const getCustomers$ = buildRequest<GetCustomersParams,
  DataResponse<GetCustomersData>>(params => {
  const {
    pageIndex,
    pageSize,
    sortBy,
    sortDirection,
    keyword,
    customerType,
    customerId
  }: any = params;

  return rxios.request({
    url: CUSTOMERS,
    method: 'GET',
    params: {
      customer_type: customerType,
      page_index: Number(pageIndex - 1),
      page_size: Number(pageSize),
      sort_by: sortBy || 'user_id',
      sort_direction: sortDirection || 'up',
      search_text: keyword ? String(keyword).trim() : keyword,
      customer_id: customerId
    }
  });
});
