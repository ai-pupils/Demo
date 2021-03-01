import rxios from '@/utils/rxios';
import buildRequest from '@/utils/buildRequest';
import {DataResponse} from "@/interface";

const GetBundles = '/v2/bundles.fl';

export interface GetBundlesParams {
  pageIndex: number; // 页码
  pageSize: number; // 每页Item Size
  sortBy?: string; // 排序字段，默认create_time
  sortDirection?: string; // 顺序，默认sort_direction
  dealerId?: string // 商户id，用于商户详情页面的货柜Tab
  cabinetTypeId?: string
  bundleId?: number
  isAvailable?: number
}

export interface GetBundlesData {
  bundles: any;
}

// 获取商品组列表
export const getBundles$ = buildRequest<GetBundlesParams,
    DataResponse<GetBundlesData>>(params => {
    const {
      pageIndex,
      pageSize,
      dealerId,
      cabinetTypeId,
      isAvailable
    } = params;
    return rxios.request({
      url: GetBundles,
      method: 'GET',
      params: {
        page_index: Number(pageIndex - 1),
        page_size: pageSize,
        dealer_id: dealerId,
        cabinet_type_id: cabinetTypeId,
        is_available: isAvailable
      }
    });
});
