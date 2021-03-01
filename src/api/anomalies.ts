import rxios from '@/utils/rxios';
import buildRequest from '@/utils/buildRequest';
import {DataResponse} from "@/interface";
import moment from 'moment';
import {parseDateRange} from "@/utils/misc";

const Anomalies = '/anomalies.fl';

export interface GetAnomaliesParams {
  pageIndex: number; // 页码
  pageSize: number; // 每页Item Size
  keyword?: string; // 模糊搜索keyword，支持商户ID、客户名称、货柜ManagerID、交易SN
  sortBy?: string;
  sortDirection?: string;
  status?: string;
  cabinetId?: number;
}

export interface GetAnomaliesData {
  binding_service: any;
  cabinet_type_info: any;
}

// 获取所有货柜异常
export const getAnomalies$ = buildRequest<GetAnomaliesParams,
  DataResponse<GetAnomaliesData>>(params => {
  if (params.status === 'all') {
    delete params.status;
  }
  const {
    pageIndex,
    pageSize,
    sortBy,
    sortDirection,
    keyword,
    status,
    cabinetId,
    from = parseDateRange('last week', false)()[0],
    to = parseDateRange('last week', false)()[1]
  } = params;

  const start = moment(from)
    .utc()
    .format('YYYY-MM-DD HH:mm:ss');
  const end = moment(to)
    .add(1, 'd')
    .utc()
    .format('YYYY-MM-DD HH:mm:ss');


  return rxios.request({
    url: Anomalies,
    method: 'GET',
    params: {
      page_index: Number(pageIndex - 1),
      page_size: Number(pageSize),
      sort_by: sortBy,
      sort_direction: sortDirection,
      keyword: keyword ? String(keyword).trim() : keyword,
      status,
      cabinet_id: cabinetId,
      from: start,
      to: end
    }
  });
});

