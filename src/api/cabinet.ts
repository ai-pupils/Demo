import rxios from '@/utils/rxios';
import buildRequest from '@/utils/buildRequest';
import { DataResponse, SearchParamsSchema } from '@/interface';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

const CABINET_TYPES = '/cabinet-types.fl';
const CABINET_TYPES_BY_ID = (id: number) => `/cabinet-types/${id}.fl`;
const CABINETS_MANAGEMENT = '/cabinets/management.fl';
const CABINET_MANAGEMENT = (id: number) => `/cabinets/management/${id}.fl`;
const CABINET_ACTIVATE = (id: number) => `/cabinets/${id}/activate.fl`;
const CABINET_LOGOUT = (id: number) => `/cabinets/${id}/logout.fl`;
const CABINETS_TEST_URL = '/cabinets/test-url.fl';
const CABINETS_RUNTIMET_STATUS = '/cabinets/statistics/runtime-status.fl';
const CABINETS_STATUS = '/cabinets/statistics/operating-status.fl';
const CABINETS_ERROR_STATUS = '/cabinets/statistics/error-code.fl';
const UPDATE_BUNDLE = (id: string, bundle_id: number) =>
  `/v2/cabinets/${id}/bundles/${bundle_id}.fl`;

// 定义Subject，用于更新cabinet绑定商品组时，接收广播更新数据
export const refreshCabinetBundle$ = new Subject();
export const refreshCabinet$ = new Subject();

export interface GetCabinetParams extends SearchParamsSchema {
  status?: string;
  runtimeStatus?: string;
  dealerId?: string; // 商户id，用于商户详情页面的货柜Tab
  bundleId?: string;
  modelId?: string;
  cabinetTypeId?: string;
  cabinet_ids?: string; // 货柜组里面的货柜ID
}

export interface GetCabinetData {
  binding_service: any;
  cabinet_type_info: any;
}

export interface UpdateCabinetParams {
  id: number;
  name?: string;
  desc?: string;
  location?: string;
  hybridEnable?: string;
  modelId?: string;
  status?: string;
  operation_status?: string;
  is_breakdown_lock?: string;
  lock_desc?: string;
}

export interface UpdateCabinetData {
  binding_service: any;
  cabinet_type_info: any;
}

export interface GetCabinetTestUrlParams {
  managerCabinetId: string;
  dealerId: number;
  expire: number;
  cabinetId: number;
  envType: string;
}

export interface GetCabinetTestUrlData {
  link: string;
  created_at: string;
  expired_at: string;
  is_owner: boolean;
  operator: string;
}

export interface GetCabinetChartsParams {
  dealerId?: number;
}

export interface GetCabinetChartsData {
  status: string; // 货柜运行状态
  count: number; // 数量
  ratio: number; // 占比
  total_count: number; // 总数
}

export interface GetCabinetErrorStatusChartsData {
  code: string; // 异常Code
  count: number; // 数量
  ratio: number; // 占比
  name: string; // 异常名称
  desc: string; // 异常描述
  solution: string; // 异常解决方案
  totalCount: number; // 总数
}

export interface GetCabinetTypesParams {
  keyword?: string;
}

export interface GetCabinetTypesByIdParams {
  id: number;
}

export interface GetCabinetTypesData {
  id: number;
  name: string;
  camera_count: number;
  layer_count: number;
  manufacturer: string;
  create_time: string;
  udpate_time: string;
  type: string;
  vision_id: string;
}

export interface BindBundleParams {
  bundle_id: number;
  manager_cabinet_id: string;
  dealer_id: number;
}

export interface BindBundleData {
  cabinets: any;
}

// 获取货柜类型
export const getCabinetTypes$ = buildRequest<
  GetCabinetTypesParams,
  DataResponse<GetCabinetTypesData[]>
>(params => {
  const { keyword } = params;
  return rxios.request({
    url: CABINET_TYPES,
    method: 'GET',
    params: {
      search_text: keyword
    }
  });
});

// 获取货柜类型
export const getCabinetTypesById$ = buildRequest<
  GetCabinetTypesByIdParams,
  DataResponse<GetCabinetTypesData>
>(params => {
  const { id } = params;
  return rxios.request({
    url: CABINET_TYPES_BY_ID(id),
    method: 'GET',
    params: {
      id: id
    }
  });
});

// 获取所有货柜信息
export const getCabinets$ = buildRequest<
  GetCabinetParams,
  DataResponse<GetCabinetData>
>(params => {
  const {
    pageIndex,
    pageSize,
    sortBy,
    sortDirection,
    keyword,
    status,
    runtimeStatus,
    dealerId,
    bundleId,
    cabinetTypeId,
    modelId,
    cabinet_ids
  } = params;

  return rxios.request({
    url: CABINETS_MANAGEMENT,
    method: 'GET',
    params: {
      page_index: pageIndex ? Number(pageIndex - 1) : undefined,
      page_size: pageSize ? Number(pageSize) : undefined,
      sort_by: sortBy,
      sort_direction: sortDirection,
      search_text: keyword ? String(keyword).trim() : keyword,
      status,
      runtime_status: runtimeStatus,
      dealer_id: dealerId,
      bundle_id: bundleId,
      model_id: modelId,
      cabinet_type_id: cabinetTypeId,
      cabinet_ids
    }
  });
});

// 获取单个货柜信息
export const getCabinet$ = buildRequest((id: number) =>
  rxios.request({
    url: CABINET_MANAGEMENT(id),
    method: 'GET'
  })
);

// 激活货柜
export const activateCabinet$ = buildRequest((id: number) =>
  rxios.request({
    url: CABINET_ACTIVATE(id),
    method: 'PUT'
  })
);

// 修改货柜信息
export const updateCabinet$ = buildRequest<
  UpdateCabinetParams,
  DataResponse<UpdateCabinetData>
>((params: UpdateCabinetParams) => {
  const {
    id,
    name,
    desc,
    location,
    hybridEnable,
    modelId,
    status,
    operation_status,
    is_breakdown_lock,
    lock_desc
  } = params;

  return rxios
    .request({
      url: CABINET_MANAGEMENT(id),
      method: 'PUT',
      data: {
        name,
        desc,
        location,
        hybrid_enable: hybridEnable,
        model_id: modelId,
        status,
        operation_status,
        is_breakdown_lock: Boolean(is_breakdown_lock),
        lock_desc
      }
    })
    .pipe(
      map((state: any) => {
        if (state.api_code === -1) {
          let msg = '操作失败';
          if(state.content && state.content.resp_content && state.content.resp_content.error_code){
            const error_code = state.content.resp_content.error_code;
            switch (error_code.toString()) {
              case '40427':
                msg = '设备未激活';
                break;
              case '503060':
                msg = '设备未锁定';
                break;
              case '503061':
                msg = '设备已锁定';
                break;
              case '40313':
                msg = '设备正在交易';
                break;
            }
          }
          return {
            error_msg: msg
          };
        }
        return state;
      })
    );
});

// 注销货柜
export const logoutCabinet$ = buildRequest((id: number) =>
  rxios.request({
    url: CABINET_LOGOUT(id),
    method: 'PUT'
  })
);

// 获取货柜测试URL
export const getCabinetTestUrl$ = buildRequest<
  GetCabinetTestUrlParams,
  DataResponse<GetCabinetTestUrlData>
>(params => {
  const { expire, cabinetId, envType } = params;
  return rxios.request({
    url: CABINETS_TEST_URL,
    method: 'GET',
    params: {
      expire: expire,
      cabinet_id: cabinetId,
      env_type: envType
    }
  });
});

// 获取货柜运行状态
export const getCabinetStatus$ = buildRequest<
  GetCabinetChartsParams,
  DataResponse<GetCabinetChartsData[]>
>(params => {
  const { dealerId } = params;
  return rxios.request({
    url: CABINETS_STATUS,
    method: 'GET',
    params: {
      dealer_id: dealerId
    }
  });
});

// 获取货柜运行状态统计图
export const getCabinetStatusCharts$ = buildRequest<
  GetCabinetChartsParams,
  DataResponse<GetCabinetChartsData>
>(params => {
  const { dealerId } = params;
  return rxios.request({
    url: CABINETS_STATUS,
    method: 'GET',
    params: {
      dealer_id: dealerId
    }
  });
});

// 获取货柜运行状态统计图
export const getCabinetRuntimeStatusCharts$ = buildRequest<
  GetCabinetChartsParams,
  DataResponse<GetCabinetChartsData>
>(params => {
  const { dealerId } = params;
  return rxios.request({
    url: CABINETS_RUNTIMET_STATUS,
    method: 'GET',
    params: {
      dealer_id: dealerId
    }
  });
});

// 获取货柜异常状态统计图
export const getCabinetErrorStatusCharts$ = buildRequest<
  GetCabinetChartsParams,
  DataResponse<GetCabinetErrorStatusChartsData>
>(params => {
  const { dealerId } = params;
  return rxios.request({
    url: CABINETS_ERROR_STATUS,
    method: 'GET',
    params: {
      dealer_id: dealerId
    }
  });
});

// 绑定商品组到货柜
export const updateBundle$ = buildRequest<
  BindBundleParams,
  DataResponse<BindBundleData>
>(params => {
  const { bundleId, id, dealerId } = params;
  return rxios.request({
    url: UPDATE_BUNDLE(id, bundleId),
    method: 'POST',
    data: {
      dealer_id: dealerId
    }
  });
});
