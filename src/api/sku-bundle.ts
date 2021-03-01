import rxios from '@/utils/rxios';
import buildRequest from '@/utils/buildRequest';
import http from '@http';
import { DefaultDataResponse, SearchParamsSchema } from '@/interface';

const SKU_BUNDLES = '/bundles.fl';
const SKU_BUNDLE = (id: any) => `/bundles/${id}.fl`;
const V2_SKU_BUNDLE = (id: any) => `/v2/bundles/${id}/skus.fl`;
const SKU_FROM_BUNDLE = (id: any) => `/bundles/${id}/skus.fl`;
const DEALER_BUNDLES = (dealerId: any) => `/dealer/${dealerId}/bundles.fl`;

export interface GetSkuBundlesParams {
  pageIndex: number;
  pageSize: number;
  sortBy?: string;
  sortDirection?: string;
  keyword?: string;
  dealerId?: number;
}

export interface ExportSkuBundlesParams {
  dealer_id: number;
  bundles: string;
}

// 获取所有商品包
export const getSkuBundles$ = buildRequest<GetSkuBundlesParams, any>(
  (params: GetSkuBundlesParams) => {
    const {
      pageIndex,
      pageSize,
      sortBy,
      sortDirection,
      keyword,
      dealerId
    } = params;

    return rxios.request({
      url: SKU_BUNDLES,
      method: 'GET',
      params: {
        page_index: Number(pageIndex - 1),
        page_size: Number(pageSize),
        sort_by: sortBy,
        sort_direction: sortDirection,
        search_text: keyword ? String(keyword).trim() : keyword,
        dealer_id: dealerId
      }
    });
  }
);

// 获取单个商品包详情
export const getSkuBundle$ = buildRequest(id =>
  rxios.request({
    url: SKU_BUNDLE(id),
    method: 'GET',
    params: { id }
  })
);

// 获取单个商品包详情
export const getV2SkuBundle$ = buildRequest(id =>
  rxios.request({
    url: V2_SKU_BUNDLE(id),
    method: 'GET',
    params: { id }
  })
);

// 创建商品包
export const postSkuBundles$ = buildRequest(params => {
  const { dealerId, name, description, cabinetTypeId, visionId }: any = params;

  return rxios.request({
    url: SKU_BUNDLES,
    method: 'POST',
    data: {
      dealer_id: dealerId,
      name,
      description,
      cabinet_type_id: cabinetTypeId,
      vision_id: visionId
    }
  });
});

// 删除商品包
export const deleteSkuBundles$ = buildRequest((id: any, dealerId: any) =>
  rxios.request({
    url: SKU_BUNDLE(id),
    method: 'DELETE',
    data: {
      dealer_id: dealerId
    }
  })
);

// 修改商品包
export const updateSkuBundles$ = buildRequest((id, params) => {
  const { dealerId, name, description } = params;
  return rxios.request({
    url: SKU_BUNDLE(id),
    method: 'PUT',
    data: {
      dealer_id: dealerId,
      name,
      description
    }
  });
});

// 添加商品到商品包
export const postSkuToBundle$ = buildRequest((id, params) => {
  const { dealerId, barcodes } = params;

  return rxios.request({
    url: SKU_FROM_BUNDLE(id),
    method: 'POST',
    data: {
      dealer_id: dealerId,
      barcodes
    }
  });
});

// 从商品包删除商品
export const deleteSkuFromBundle$ = buildRequest((id, params) => {
  const { dealerId, barcodes } = params;

  return rxios.request({
    url: SKU_FROM_BUNDLE(id),
    method: 'DELETE',
    data: {
      dealer_id: dealerId,
      barcodes
    }
  });
});

export interface GetSkuBundlesV2Params extends SearchParamsSchema {
  dealerId?: number;
  cabinetTypeId?: string;
  bundleId?: number;
  status?: string;
  comment?: string;
  visionId?: string;
  auditedStatus?: string;
}

export interface SkuBundleV2Data {
  cabinet_type_id: number;
  cabinet_type_info: {
    camera_count: number;
    create_time: string;
    factory_model: string;
    id: number;
    layer_count: number;
    manufacturer: string;
    name: string;
    type: string;
    udpate_time: string;
  };
  create_time: string;
  dealer_id: number;
  dealer_info: {
    comment: string;
    create_time: string;
    key: string;
    key_slave: string;
    user_id: number;
    user_type: string;
  };
  description: string;
  id: number;
  is_available: boolean;
  name: string;
  ready_model_count: number;
  sku_appearance_count: number;
  sku_count: number;
  status: string;
  udpate_time: string;
  footprint: string;
  audited_status: string;
  audited_comment: string;
  auditor_id: number;
  auditor_name: string;
  audited_at: string;
  is_qc_learned: boolean;
}

export interface GetSkuBundlesV2Data {
  error_code: number;
  total: number;
  bundles: SkuBundleV2Data[];
}

/**
 * 获取所有商品组
 * @see http://rai-showdoc.c3f7b5c5fbf6c444eacaaff28e0bfa82a.cn-hangzhou.alicontainer.com/web/#/1?page_id=63
 */
export const getSkuBundlesV2$ = buildRequest<
  GetSkuBundlesV2Params,
  DefaultDataResponse<GetSkuBundlesV2Data>
>((params: GetSkuBundlesV2Params) => {
  const {
    pageIndex,
    pageSize,
    sortBy,
    sortDirection,
    keyword,
    dealerId,
    cabinetTypeId,
    bundleId,
    status,
    visionId,
    auditedStatus
  } = params;

  return http.request({
    url: '/v2/bundles.fl',
    method: 'get',
    params: {
      page_index: pageIndex ? Number(pageIndex - 1) : undefined,
      page_size: pageSize ? Number(pageSize) : undefined,
      sort_by: sortBy,
      sort_direction: sortDirection,
      keyword: keyword ? String(keyword).trim() : keyword,
      dealer_id: dealerId,
      cabinet_type_id: cabinetTypeId,
      bundle_id: bundleId,
      status,
      vision_id: visionId,
      audited_status: auditedStatus
    }
  });
});

export interface BundleSkuData {
  barcode_type: string;
  coc: string;
  created_at: string;
  creator_id: number;
  id: number;
  package_type: string;
  sku_appearances: [
    {
      appearance_desc: string;
      appearance_name: string;
      appearance_url: string;
      back_url: string;
      barcodes: string;
      bottom_url: string;
      created_at: string;
      creator_id: number;
      front_url: string;
      id: number;
      left_url: string;
      right_url: string;
      sku_id: string;
      status: string;
      top_url: string;
    }
  ];
  sku_id: string;
  sku_name: string;
  sku_type: string;
  sku_url: string;
  status: string;
  trade_mark: string;
  weight: number;
  weight_deviation: number;
}

export interface GetBundleSkusV2Data {
  status: number;
  error_code: number;
  sku_appearance_count: number;
  sku_count: number;
  skus: BundleSkuData[];
}

/**
 * 获取单个商品组的skus
 * @see http://rai-showdoc.c3f7b5c5fbf6c444eacaaff28e0bfa82a.cn-hangzhou.alicontainer.com/web/#/1?page_id=64
 */
export const getBundleSkusV2$ = buildRequest<
  any,
  DefaultDataResponse<GetBundleSkusV2Data>
>((params: { id: string }) => {
  return http.request({
    url: `/v2/bundles/${params.id}/skus.fl`,
    method: 'get'
  });
});

/**
 * 获取单个商品组的skus
 * @see http://rai-showdoc.c3f7b5c5fbf6c444eacaaff28e0bfa82a.cn-hangzhou.alicontainer.com/web/#/1?page_id=119
 */
export const getBundleSkus$ = buildRequest<
  any,
  DefaultDataResponse<GetBundleSkusV2Data>
>((params: { id: string }) => {
  return http.request({
    url: `/v2/bundles/${params.id}.fl`,
    method: 'get'
  });
});

export interface BundleModel {
  bundle_id: number;
  bundle_name: string;
  cabinet_count: number;
  cabinet_type_id: number;
  create_time: string;
  dealer_id: number;
  is_allocated: true;
  model_desc: string;
  model_footprint: string;
  model_id: number;
  model_is_default: string;
  model_name: string;
  model_status: string;
  model_url: string;
  update_time: string;
}

export interface GetBundleModelsV2Data {
  error_code: number;
  total: number;
  models: BundleModel[];
}

/**
 * 获取单个商品组的models
 */
export const getBundleModelsV2$ = buildRequest<any, any>(
  (params: { id: string }) => {
    return http.request({
      url: `/v2/bundles/${params.id}/models.fl`,
      method: 'get'
    });
  }
);

export interface UpdateSkuBundleV2Params {
  id: number; // 商品组id
  dealer_id: number; // 商户id
  name?: string;
  description?: string;
  status?: string;
  comment?: string;
  sku_ids?: number[];
  audited_comment?: string;
  audited_status?: string;
  exclusive_items?: string[];
}

/**
 * 修改商品组v2
 * @see http://rai-showdoc.c3f7b5c5fbf6c444eacaaff28e0bfa82a.cn-hangzhou.alicontainer.com/web/#/1?page_id=70
 */
export const updateSkuBundleV2$ = buildRequest<UpdateSkuBundleV2Params, any>(
  (data: UpdateSkuBundleV2Params) => {
    return http.request({
      url: `/v2/bundles/${data.id}.fl`,
      method: 'put',
      data: {
        dealer_id: data.dealer_id,
        name: data.name,
        description: data.description,
        status: data.status,
        comment: data.comment,
        sku_ids: data.sku_ids,
        audited_status: data.audited_status,
        audited_comment: data.audited_comment,
        exclusive_items: data.exclusive_items
      }
    });
  }
);

export interface CreateSkuBundleV2Params {
  dealer_id: number;
  // todo cabinet_type_id在public api 修正之后不需要传，目前写死
  cabinet_type_id: number;
  vision_id: number;
  name: string;
  description: string;
  sku_ids: number[];
}

/**
 * 创建商品组v2
 * @see http://rai-showdoc.c3f7b5c5fbf6c444eacaaff28e0bfa82a.cn-hangzhou.alicontainer.com/web/#/1?page_id=69
 */
export const createSkuBundleV2$ = buildRequest<CreateSkuBundleV2Params, any>(
  (data: CreateSkuBundleV2Params) => {
    return http.request({
      url: `/v2/bundles.fl`,
      method: 'post',
      data
    });
  }
);

export interface GetAvailableSkusV2Params extends SearchParamsSchema {
  packageType?: string;
  skuType?: string;
  bundleId?: number;
  visionId?: number;
}

/**
 * 导出bundles及其skus
 * @see https://gitlab.malong.com/retailai/rai-portal-dashboard/wikis/%E5%AF%BC%E5%87%BAbundles%E5%8F%8A%E5%85%B6skus
 */
export const exportSkuBundlesV2$ = buildRequest<GetAvailableSkusV2Params>(
  (params: ExportSkuBundlesParams) => {
    const { dealer_id, bundles } = params;

    return http.request({
      url: `/v2/bundles/skus.fl`,
      method: 'get',
      params: {
        dealer_id,
        bundles
      },
      responseType: 'arraybuffer'
    });
  }
);
