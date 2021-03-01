import moment from 'moment';
import rxios from '@/utils/rxios';
import { DataResponse } from '@/interface';
import buildRequest from '@/utils/buildRequest';
import { parseDateRange } from '@/utils/misc';
import { apiPrefix, fixParams, searchParamsV2 } from '@/api/v2/apiVersion';
import {Subject} from "rxjs";

export interface GetCabinetLockedLogsParams extends searchParamsV2 {
  pageIndex?: number;
  pageSize?: number;
  sortBy: string;
  sortDirection: string;
  cabinet_id: number;
  is_deleted?: number;
  codes?: string;
}

export interface GetCabinetLockedLogsData {
  cabinet_id: number;
  cabinet_serial: string;
  cabinet_type_id: number;
  code: number;
  desc: number;
  ended_at: string;
  id: number;
  is_deleted: boolean;
  name: string;
  priority: string;
  started_at: string;
  status: string;
}

// 定义Subject，用于更新货柜故障状态时，接收广播更新数据
export const refreshCabinetExceptions$ = new Subject();

// 查询单个货柜所有锁柜记录
export const getCabinetLockedLogs$ = buildRequest<
  GetCabinetLockedLogsParams,
  DataResponse<GetCabinetLockedLogsData>
>(params => {
  params = { ...params, ...fixParams(params) };
  const {
    cabinet_id,
    pageIndex,
    pageSize,
    order_by,
    codes,
    from = parseDateRange('last week', false)()[0],
    to = parseDateRange('last week', false)()[1]
  } = params;

  const start = moment(from).toDate();
  const end = moment(to)
    .add(1, 'd')
    .toDate();

  return rxios.request({
    url: `${apiPrefix}/exceptions/cabinets/locked/his.fl`,
    method: 'GET',
    params: {
      page_index: Number(pageIndex - 1),
      page_size: Number(pageSize),
      order_by,
      from: start,
      to: end,
      cabinet_id,
      codes
    }
  });
});
