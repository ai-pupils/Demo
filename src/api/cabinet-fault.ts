import rxios from '@/utils/rxios';
import buildRequest from '@/utils/buildRequest';
import { DataResponse, SearchParamsSchema } from '@/interface';
import { Subject } from 'rxjs';
import { GetCabinetTypesByIdParams, GetCabinetTypesData } from '@/api/cabinet';
import moment from 'moment';
import { parseDateRange } from '@/utils/misc';

const apiPrefix = '/v2';

// 定义Subject，用于更新货柜故障状态时，接收广播更新数据
export const refreshCabinetFaults$ = new Subject();

export interface GetCabinetParams extends SearchParamsSchema {
  status?: string;
  runtimeStatus?: string;
  dealerId?: string; // 商户id，用于商户详情页面的货柜Tab
  bundleId?: string;
  modelId?: string;
  cabinetTypeId?: string;
}

export interface GetCabinetFaultParams extends SearchParamsSchema {
  id?: number;
  cabinetId?: number;
  status?: string;
  desc?: string;
  exception_id?: number;
  source?: string;
  type?: string;
  fixer_comment?: string;
  is_vandalism?: number;
}

export interface GetCabinetFaultData {
  created_at: string;
  desc: string;
  exception_id: number;
  id: number;
  source: string;
  status: string;
  type?: string;
  fixer_comment?: string;
  is_vandalism?: number;
}

// 故障详情
export const getFaultsDetails$ = buildRequest<
  GetCabinetFaultParams,
  DataResponse<GetCabinetFaultData[]>
>(params => {
  const {
    cabinetId,
    id
  } = params;
  return rxios.request({
    url: `${apiPrefix}/cabinets/${cabinetId}/faults/${id}.fl`,
    method: 'GET'
  });
});

// 查询单个货柜所有故障列表
export const getCabinetFaults$ = buildRequest<
  GetCabinetFaultParams,
  DataResponse<GetCabinetFaultData[]>
>(params => {
  if (params.status === 'all') {
    delete params.status;
  }

  const {
    cabinetId,
    status,
    pageIndex,
    pageSize,
    sortBy,
    sortDirection,
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
    url: `${apiPrefix}/cabinets/${cabinetId}/faults.fl`,
    method: 'GET',
    params: {
      status,
      page_index: Number(pageIndex - 1),
      page_size: Number(pageSize),
      sort_by: sortBy,
      sort_direction: sortDirection,
      from: start,
      to: end
    }
  });
});

// 货柜异常转故障
export const createCabinetFault$ = buildRequest<
  GetCabinetFaultParams,
  DataResponse<GetCabinetFaultData>
>(params => {
  const { cabinetId, exception_id, source, desc } = params;
  return rxios.request({
    url: `${apiPrefix}/cabinets/${cabinetId}/faults.fl`,
    method: 'POST',
    data: {
      exception_id,
      source,
      desc
    }
  });
});

// 更新货柜故障
export const updateCabinetFault$ = buildRequest<
  GetCabinetFaultParams,
  DataResponse<GetCabinetFaultData>
>(params => {
  const {
    cabinetId,
    exception_id,
    source,
    desc,
    id,
    fixer_comment,
    is_vandalism,
    type,
    status
  } = params;
  return rxios.request({
    url: `${apiPrefix}/cabinets/${cabinetId}/faults/${id}.fl`,
    method: 'PUT',
    data: {
      exception_id,
      source,
      desc,
      fixer_comment,
      is_vandalism,
      type,
      status
    }
  });
});
