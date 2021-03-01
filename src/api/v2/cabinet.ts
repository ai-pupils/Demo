import buildRequest from '@/utils/buildRequest';
import { DataResponse, MetaType, PageType, SortType } from '@/interface';
import rxios from '@http';
import { apiPrefix } from '@/api/v2/apiVersion';
import { map } from 'rxjs/operators';

export interface GetCabinetParams extends PageType, SortType {
  query?: string;
  runtime_status?: string;
  status?: string;
  dealer_id?: number;
  bundle_id?: number;
  cabinet_type_id?: number;
  model_id?: number;
  cabinet_ids?: number;
}
export interface GetCabinetData {}

export interface UpdateCabinetParams {
  id: number;
  name?: string;
  desc?: string;
  location?: string;
  hybrid_enable?: boolean;
  model_id?: string;
  status?: string;
  is_breakdown_lock?: boolean;
  lock_desc?: string;
}

export interface UpdateCabinetData {}

export interface BindBundleParams {
  id: number; // cabinet_id
  bundle_id: number;
  manager_cabinet_id: string;
  dealer_id: number;
}

export interface BindBundleData {}

export interface GetVoiceParams {
  cabinet_id: number; // 货柜ID
}

export interface UpdateVoiceParams {
  cabinet_id: number; // 货柜ID
  volume: number; // 音量
  voice_tran: boolean; // 是否设置交易语音
  voice_replenish: boolean; // 是否设置补货语音
}

// 获取所有货柜信息
export const getCabinets$ = buildRequest<
  GetCabinetParams,
  DataResponse<GetCabinetData>
>((params: GetCabinetParams) => {
  const {
    pageIndex,
    pageSize,
    order_by,
    query,
    runtime_status,
    status,
    dealer_id,
    bundle_id,
    cabinet_type_id,
    model_id,
    cabinet_ids
  } = params;

  return rxios.request({
    url: `${apiPrefix}/cabinets/management.fl`,
    method: 'GET',
    params: {
      page_index: pageIndex ? Number(pageIndex - 1) : undefined,
      page_size: pageSize ? Number(pageSize) : undefined,
      order_by,
      query,
      status,
      runtime_status,
      dealer_id,
      bundle_id,
      model_id,
      cabinet_type_id,
      cabinet_ids
    }
  });
});

// FIXME 这个接口还没迁到v2
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
    hybrid_enable,
    model_id,
    status,
    is_breakdown_lock,
    lock_desc
  } = params;

  return rxios.request({
    url: `/cabinets/management/${id}.fl`,
    method: 'PUT',
    data: {
      name,
      desc,
      location,
      hybrid_enable,
      model_id,
      status,
      is_breakdown_lock: Boolean(is_breakdown_lock),
      lock_desc
    }
  });
});

// 绑定商品组到货柜
export const updateBundle$ = buildRequest<
  BindBundleParams,
  DataResponse<BindBundleData>
>((params: BindBundleParams) => {
  const { bundle_id, id, dealer_id } = params;
  return rxios.request({
    url: `/v2/cabinets/${id}/bundles/${bundle_id}.fl`,
    method: 'POST',
    data: {
      dealer_id
    }
  });
});

// 获取货柜音量、声音设置
// @see https://gitlab.malong.com/retailai/rai-portal-dashboard/wikis/%E8%B4%A7%E6%9F%9C%E4%BA%A4%E6%98%93%E5%8F%8A%E6%8D%A2%E8%B4%A7%E8%AF%AD%E9%9F%B3%E8%AE%BE%E7%BD%AE
export const getCabinetVoice$ = buildRequest<
  UpdateVoiceParams,
  DataResponse<any>
>((params: UpdateVoiceParams) => {
  const { cabinet_id } = params;
  return rxios
    .request({
      url: `/cabinets/${cabinet_id}/voice.fl`,
      method: 'GET'
    })
    .pipe(
      map((res: any) => {
        if (res.status === 50000) {
          return {
            data: {
              voice_config: { error: true }
            },
            status: 0
          };
        }
        return res;
      })
    );
});

// 货柜交易及换货语音设置
// @see https://gitlab.malong.com/retailai/rai-portal-dashboard/wikis/%E8%B4%A7%E6%9F%9C%E4%BA%A4%E6%98%93%E5%8F%8A%E6%8D%A2%E8%B4%A7%E8%AF%AD%E9%9F%B3%E8%AE%BE%E7%BD%AE
export const updateCabinetVoice$ = buildRequest<
  UpdateVoiceParams,
  DataResponse<any>
>((params: UpdateVoiceParams) => {
  const { cabinet_id, voice_replenish, voice_tran, volume } = params;
  return rxios.request({
    url: `/v2/cabinets/${cabinet_id}/voice.fl`,
    method: 'PUT',
    data: {
      cabinet_id,
      volume,
      voice_tran,
      voice_replenish
    }
  });
});
