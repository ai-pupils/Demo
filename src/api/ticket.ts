import rxios from '@/utils/rxios';
import buildRequest from '@/utils/buildRequest';
import {
  DataListResponse,
  DataResponse,
  SearchParamsSchema
} from '@/interface';
import { getRealTime, parseDateRange } from '@/utils/misc';

export interface GetTicketsParams extends SearchParamsSchema {
  id?: number;
  from?: string;
  to?: string;
  handler_id?: number;
  handler_name?: string;
  status?: string;
  person_type?: string;
}

export interface CreateTicketsParams {
  id: number;
  message?: string;
  attachments?: string;
}

export interface GetTicketsData {
  id: number;
  type_id: number;
  description: string;
  attachments: any;
  is_urgent: boolean;
  status: string;
  reporter_id: number;
  reporter_email: string;
  reporter_name: string;
  reporter_phone: string;
  handler_id: number;
  handler_name: string;
  finisher_id: number;
  finisher_name: string;
  latest_work_order_log_id: number;
  created_at: string;
  latest_work_order_log: any;
  type_name: string;
  type_description: string;
}

/** 查询所有工单
 * @see http://rai-showdoc.c3f7b5c5fbf6c444eacaaff28e0bfa82a.cn-hangzhou.alicontainer.com/web/#/1?page_id=131
 */
export const getTickets$ = buildRequest<
  GetTicketsParams,
  DataListResponse<GetTicketsData>
>(params => {
  let {
    keyword,
    from,
    to,
    handler_id,
    handler_name,
    status,
    person_type,
    pageIndex,
    pageSize,
    sortBy
  }: GetTicketsParams = params;

  let dateRange: any[] = [];
  if (from && to) {
    dateRange = getRealTime([from, to]);
  } else {
    let dataArray = parseDateRange('last week', false)();
    dateRange = getRealTime(dataArray);
  }

  return rxios.request({
    url: `/v2/work-orders.fl`,
    method: 'GET',
    params: {
      from: dateRange[0],
      to: dateRange[1],
      handler_id,
      handler_name,
      status,
      latest_person_type: person_type,
      query: keyword,
      page_index: pageIndex ? Number(pageIndex - 1) : undefined,
      page_size: pageSize ? Number(pageSize) : undefined,
      order_by: sortBy
    }
  });
});

/** 查询工单详情
 * @see http://rai-showdoc.c3f7b5c5fbf6c444eacaaff28e0bfa82a.cn-hangzhou.alicontainer.com/web/#/1?page_id=134
 */
export const getTicket$ = buildRequest<
  GetTicketsParams,
  DataListResponse<GetTicketsData>
>(params => {
  let { id }: GetTicketsParams = params;

  return rxios.request({
    url: `/v2/work-orders/${id}.fl`,
    method: 'GET'
  });
});

/** 创建工单记录
 * @see http://rai-showdoc.c3f7b5c5fbf6c444eacaaff28e0bfa82a.cn-hangzhou.alicontainer.com/web/#/1?page_id=134
 */
export const createTicket$ = buildRequest<
  CreateTicketsParams,
  DataListResponse<GetTicketsData>
>(params => {
  let { id, message, attachments }: CreateTicketsParams = params;

  return rxios.request({
    url: `/v2/work-orders/${id}/logs.fl`,
    method: 'POST',
    data: {
      message,
      attachments
    }
  });
});

/** 工单结单
 * @see http://rai-showdoc.c3f7b5c5fbf6c444eacaaff28e0bfa82a.cn-hangzhou.alicontainer.com/web/#/1?page_id=133
 */
export const putTicket$ = buildRequest<
  CreateTicketsParams,
  DataListResponse<GetTicketsData>
>(params => {
  let { id }: CreateTicketsParams = params;
  return rxios.request({
    url: `/v2/work-orders/${id}.fl`,
    method: 'PUT'
  });
});
