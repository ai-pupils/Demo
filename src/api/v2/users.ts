import buildRequest from '@/utils/buildRequest';
import { DataResponse, MetaType, PageType, SortType } from '@/interface';
import rxios from '@http';
import { apiPrefix, fixParams, searchParamsV2 } from '@/api/v2/apiVersion';
import { map } from 'rxjs/operators';

export interface GetCustomersParams extends searchParamsV2 {
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
export const getCustomers$ = buildRequest<
  GetCustomersParams,
  DataResponse<GetCustomersData>
>((params: GetCustomersParams) => {
  params = { ...params, ...fixParams(params) };
  const {
    page_index,
    page_size,
    order_by,
    query,
    customerType,
    customerId
  }: any = params;

  return rxios
    .request({
      url: `${apiPrefix}/users.fl`,
      method: 'GET',
      params: {
        page_index,
        page_size,
        order_by,
        query,
        user_id: customerId,
        customer_type: customerType
      }
    })
    .pipe(
      map((state: DataResponse<GetCustomersData>) => {
        if (state) {
          const {
            data: { results }
          }: any = state;
          results.forEach((r: any) => {
            r.user_id = r.id;
            r.create_time = r.created_at;
          })
        }
        return state;
      })
    );
});
