import rxios from '@/utils/rxios';
import buildRequest from '@/utils/buildRequest';
import http from '@http';
import {
  DefaultDataResponse,
  SearchParamsSchema,
  DataResponse
} from '@/interface';
import _ from 'lodash';
import { map, mergeMap } from 'rxjs/operators';
import { getBundleSkus$, getBundleSkusV2$ } from '@/api/sku-bundle';
import { of } from 'rxjs';

const BARCODE = (barcode: string) => `/barcode/${barcode}.fl`;

export const UPLOAD_SKU_IMAGE = '/skus/images/upload.fl';

// 校验barcode是否存在
export const isValidBarcode$ = buildRequest((barcode: string) =>
  rxios.request({
    url: BARCODE(barcode),
    method: 'GET',
    params: { barcode }
  })
);

export interface GetSkusParams extends SearchParamsSchema {
  keyword?: string;
  packageType?: string;
  skuType?: string;
  skuName?: string;
  barcode?: string;
  visionId?: string;
  ingressionType?: string;
  visionType?: string;
  bundleId?: number; // 自定义参数
}

export interface GetSkusData {
  error_code: number;
  skus: Array<{
    barcode_type: string;
    coc: string;
    created_at: string;
    creator_id: string;
    id: number;
    package_type: string;
    sku_appearance_count: number;
    sku_id: string;
    sku_name: string;
    sku_type: string;
    sku_url: string;
    status: string;
    trade_mark: string;
    trade_mark_cn: string;
    trade_mark_en: string;
    weight: number;
    weight_deviation: number;
  }>;
  total: number;
}

/**
 * 获取所有商品
 * @see http://rai-showdoc.c3f7b5c5fbf6c444eacaaff28e0bfa82a.cn-hangzhou.alicontainer.com/web/#/1?page_id=51
 */
export const getSkus$ = buildRequest<
  GetSkusParams,
  DefaultDataResponse<GetSkusData>
>((params: GetSkusParams) => {
  const {
    pageIndex,
    pageSize,
    keyword,
    sortBy,
    sortDirection,
    packageType,
    skuType,
    skuName,
    barcode,
    ingressionType,
    visionType
  } = params;
  return http.request({
    url: '/v2/skus.fl',
    method: 'get',
    params: {
      page_index: pageIndex ? Number(pageIndex - 1) : undefined,
      page_size: pageSize ? Number(pageSize) : undefined,
      keyword: keyword ? String(keyword).trim() : keyword,
      sort_by: sortBy,
      sort_direction: sortDirection,
      package_type: packageType,
      sku_type: skuType,
      sku_name: skuName,
      barcode,
      ingression_type: ingressionType,
      vision_type: visionType
    }
  });
});

/**
 * 获取所有商品，合并bundle中的商品信息，skus的变形接口
 */
export const getSkusBundles$ = buildRequest<
  GetSkusParams,
  DefaultDataResponse<GetSkusData>
>((params: GetSkusParams) => {
  const {
    pageIndex,
    pageSize,
    keyword,
    sortBy,
    sortDirection,
    packageType,
    skuType,
    skuName,
    barcode,
    bundleId,
    visionId
  } = params;
  return http
    .request({
      url: `/v2/skus/vision/${visionId}.fl`,
      method: 'get',
      params: {
        page_index: pageIndex ? Number(pageIndex - 1) : undefined,
        page_size: pageSize ? Number(pageSize) : undefined,
        query: keyword ? String(keyword).trim() : keyword,
        sort_by: sortBy,
        sort_direction: sortDirection,
        package_type: packageType,
        sku_type: skuType,
        sku_name: skuName,
        barcode
      }
    })
    .pipe(
      mergeMap((state: any) => {
        if (state.data) {
          const {
            data: { results }
          } = state;
          results.forEach((e: any) => {
            e.barcodes = e.appearance_barcodes || [];
            e.barcode = e.barcodes[0];
          });
          let skus = [];
          state.data.bundle_skus = [];
          if (bundleId) {
            return getBundleSkus$({ id: bundleId }).pipe(
              map(info => {
                if (info.isFulfill) {
                  state.data.bundle_skus = info.payload!.data.skus;
                  results.map((e: any) => {
                    let sku = undefined;
                    if (state.data.bundle_skus.length > 0) {
                      sku = _.find(state.data.bundle_skus, ['id', e.id]);
                    }
                    if (sku) {
                      e.barcode = sku.appearances[0].selected_barcode;
                    } else {
                      e.barcode = e.barcodes[0];
                    }
                  });
                }
                return state;
              })
            );
          }
        }
        return of(state);
      })
    );
});

export interface GetSkuParams {
  id: string;
}

export interface GetSkuData {
  barcode_type: string;
  coc: string;
  created_at: string;
  creator_id: string;
  error_code: string;
  id: number;
  package_type: string;
  sku_appearance_count: number;
  sku_appearances: Array<{
    appearance_name: string;
    appearance_url: string;
    back_url: string;
    barcodes: string;
    bottom_url: string;
    created_at: string;
    creator_id: number;
    appearance_desc: string;
    front_url: string;
    id: number;
    ingression_status: Array<any>;
    left_url: string;
    right_url: string;
    sku_id: string;
    status: string;
    top_url: string;
  }>;
  sku_id: string;
  sku_name: string;
  sku_type: string;
  status: string;
  trade_mark: string;
  trade_mark_cn: string;
  trade_mark_en: string;
  weight: number;
  weight_deviation: number;
  sku_url: string;
  comment: string;
}

// todo: 适配新格式
/**
 * 获取单个商品详情
 * @see http://rai-showdoc.c3f7b5c5fbf6c444eacaaff28e0bfa82a.cn-hangzhou.alicontainer.com/web/#/1?page_id=52
 */
export const getSku$ = buildRequest<
  GetSkuParams,
  DefaultDataResponse<GetSkuData>
>((params: GetSkuParams) => {
  return http.request({
    url: `/v2/skus/${params.id}.fl`,
    method: 'get'
  });
});

export interface UpdateSkuParams {
  id: string;
  sku_name: string;
  sku_url: string;
  weight: number;
  comment?: string;
}

// 修改商品
export const updateSku$ = buildRequest((data: UpdateSkuParams) => {
  const { id, sku_url, sku_name, weight, comment } = data;
  return http.request({
    url: `/v2/skus/${id}.fl`,
    method: 'put',
    data: {
      sku_name,
      sku_url,
      weight: !_.isNil(weight) ? Number(weight) : undefined,
      comment
    }
  });
});

export interface GetSkuAppearancesParams {
  id: string; //商品包装id
}

export interface GetSkuAppearancesData {
  appearance_name: string;
  appearance_url: string;
  back_url: string;
  barcodes: string;
  bottom_url: string;
  created_at: string;
  creator_id: number;
  appearance_desc: string;
  error_code: number;
  front_url: string;
  id: number;
  ingression_status: Array<any>;
  left_url: string;
  right_url: string;
  sku: {
    barcode_type: string;
    coc: string;
    created_at: string;
    creator_id: number;
    id: number;
    package_type: string;
    sku_id: string;
    sku_name: string;
    sku_type: string;
    sku_url: string;
    status: string;
    trade_mark: string;
    trade_mark_cn: string;
    trade_mark_en: string;
    weight: number;
    weight_deviation: number;
  };
  sku_id: string;
  status: string;
  top_url: string;
}

// todo: 适配新格式
/**
 * 获取单个商品包装详情
 * @see http://rai-showdoc.c3f7b5c5fbf6c444eacaaff28e0bfa82a.cn-hangzhou.alicontainer.com/web/#/1?page_id=53
 */
export const getSkuAppearances$ = buildRequest<
  GetSkuAppearancesParams,
  DefaultDataResponse<GetSkuAppearancesData>
>((params: GetSkuAppearancesParams) => {
  return http.request({
    url: `/v2/skus/appearances/${params.id}.fl`,
    method: 'get',
    params: {}
  });
});

export interface GetSkuProposalsParams extends SearchParamsSchema {
  packageType?: string;
  skuType?: string;
  proposalId?: number;
  status?: string;
  dealer_id?: number;
}

export interface ProposalData {
  back_url: string;
  barcode_type: string;
  barcodes: string;
  bottom_url: string;
  created_at: string;
  creator_id: number;
  front_url: string;
  id: number;
  left_url: string;
  package_type: string;
  right_url: string;
  sku_name: string;
  sku_type: string;
  status: string;
  top_url: string;
  trade_mark: string;
  coc: string;
}

export interface GetSkuProposalsData {
  error_code: number;
  sku_proposals: Array<ProposalData>;
  total: number;
}

/**
 * 获取所有商品proposals
 * @see http://rai-showdoc.c3f7b5c5fbf6c444eacaaff28e0bfa82a.cn-hangzhou.alicontainer.com/web/#/1?page_id=54
 */
export const getSkuProposals$ = buildRequest<
  GetSkuProposalsParams,
  DefaultDataResponse<GetSkuProposalsData>
>((params: GetSkuProposalsParams) => {
  const {
    pageIndex,
    pageSize,
    keyword,
    sortBy,
    sortDirection,
    packageType,
    skuType,
    proposalId,
    status,
    dealer_id
  } = params;
  return http.request({
    url: `/v2/skus/proposals.fl`,
    method: 'get',
    params: {
      page_index: pageIndex ? Number(pageIndex - 1) : undefined,
      page_size: pageSize ? Number(pageSize) : undefined,
      keyword: keyword ? String(keyword).trim() : keyword,
      sort_by: sortBy,
      sort_direction: sortDirection,
      package_type: packageType,
      sku_type: skuType,
      proposal_id: proposalId,
      status,
      dealer_id
    }
  });
});

export interface GetTradeMarksData {
  error_code: number;
  total: number;
  trademarks: Array<{
    chinese: string;
    english: string;
    vendor_code: string;
  }>;
}

/**
 * 获取所有商标
 * @see http://rai-showdoc.c3f7b5c5fbf6c444eacaaff28e0bfa82a.cn-hangzhou.alicontainer.com/web/#/1?page_id=50
 */
export const getTradeMarks$ = buildRequest<
  void,
  DefaultDataResponse<GetTradeMarksData>
>(() => {
  return http.request({
    url: `/v2/skus/trademarks.fl`,
    method: 'get'
  });
});

export interface CreateSkuParams {
  sku: {
    coc: string;
    trade_mark: string;
    sku_url: string;
    weight: number;
    weight_deviation: number;
    sku_name: string;
    package_type: string;
    sku_type: string;
    barcode_type: string;
  };
  sku_appearance: {
    appearance_name: string;
    appearance_url: string;
    barcodes: string[];
    appearance_desc: string;
    hd_infos: {
      front_url: string;
      back_url: string;
      left_url: string;
      right_url: string;
      top_url: string;
      bottom_url: string;
    };
  };
}

/**
 * 创建商品及包装
 * ＠see http://rai-showdoc.c3f7b5c5fbf6c444eacaaff28e0bfa82a.cn-hangzhou.alicontainer.com/web/#/1?page_id=57
 */
export const createSku$ = buildRequest((data: CreateSkuParams) => {
  return http.request({
    url: '/v2/skus.fl',
    method: 'post',
    data
  });
});

export interface UpdateSkuAppearancesParams {
  id: number;
  appearance_name: string;
  appearance_url: string;
  barcodes?: string[];
  appearance_desc?: string;
  hd_infos: {
    front_url: string;
    back_url: string;
    left_url: string;
    right_url: string;
    top_url: string;
    bottom_url: string;
  };
}

/**
 * 修改商品包装
 * @see http://rai-showdoc.c3f7b5c5fbf6c444eacaaff28e0bfa82a.cn-hangzhou.alicontainer.com/web/#/1?page_id=55
 */
export const updateSkuAppearaces$ = buildRequest(
  (data: UpdateSkuAppearancesParams) => {
    return http.request({
      url: `/v2/skus/appearances.fl`,
      method: 'put',
      data: {
        sku_appearance: {
          id: data.id,
          appearance_name: data.appearance_name,
          appearance_url: data.appearance_url,
          barcodes: data.barcodes,
          appearance_desc: data.appearance_desc,
          hd_infos: data.hd_infos
        }
      }
    });
  }
);

export interface verifySkuProposalParams {
  proposal_id: string;
  status: 'approval' | 'refused' | 'existed';
  appearance_id?: number;
  refused_reason?: string;

  approval_sku?: {
    sku_id?: string;
    sku_info?: {
      coc: number;
      trade_mark: string;
      sku_url: string;
      weight: number;
      weight_deviation: number;
      sku_name: string;
      package_type: string;
      sku_type: string;
      barcode_type: string;
      ingression_type: string;
      vision_type: string;
      comment: string;
    };
  };
  approval_appearance?: {
    appearance_name: string;
    appearance_url: string;
    barcodes: string[];
    appearance_desc: string;
    front_url: string;
    back_url: string;
    left_url: string;
    right_url: string;
    top_url: string;
    bottom_url: string;
  };
}

/**
 * 审核商品Proposal
 * @see http://rai-showdoc.c3f7b5c5fbf6c444eacaaff28e0bfa82a.cn-hangzhou.alicontainer.com/web/#/1?page_id=68
 */
export const verifySkuProposal$ = buildRequest(
  (data: verifySkuProposalParams) => {
    return http.request({
      url: `/v2/skus/proposals/${data.proposal_id}.fl`,
      method: 'put',
      data: {
        status: data.status,
        appearance_id: data.appearance_id
          ? Number(data.appearance_id)
          : undefined,
        approval_sku: data.approval_sku,
        approval_appearance: data.approval_appearance,
        refused_reason: data.refused_reason
      }
    });
  }
);

export interface CreateSkuAppearancesParams {
  sku_appearance: {
    sku_id: string;
    appearance_name: string;
    appearance_url: string;
    barcodes: string[];
    desc: string;
    hd_infos: {
      front_url: string;
      back_url: string;
      left_url: string;
      right_url: string;
      top_url: string;
      bottom_url: string;
    };
  };
}

/**
 * 创建商品包装
 * @see http://rai-showdoc.c3f7b5c5fbf6c444eacaaff28e0bfa82a.cn-hangzhou.alicontainer.com/web/#/1?page_id=58
 */
export const createSkuAppearances$ = buildRequest(
  (data: CreateSkuAppearancesParams) => {
    return http.request({
      url: '/v2/skus/appearances.fl',
      method: 'post',
      data
    });
  }
);

export interface DeleteAppearancesParams {
  appearance_id: number;
}

/**
 * 删除商品包装
 * @see http://rai-showdoc.c3f7b5c5fbf6c444eacaaff28e0bfa82a.cn-hangzhou.alicontainer.com/web/#/1?page_id=59
 */
export const deleteAppearances$ = buildRequest(
  (data: DeleteAppearancesParams) => {
    return http.request({
      url: `/v2/skus/appearances/${data.appearance_id}.fl`,
      method: 'delete'
    });
  }
);

export interface CreateTradeMarkParams {
  chinese: string;
  english: string;
}

/**
 * 创建商标
 */
export const createTradeMark$ = buildRequest((data: CreateTradeMarkParams) => {
  return http.request({
    url: '/v2/skus/trademark.fl',
    method: 'post',
    data: {
      trademark: data
    }
  });
});

export interface GetAppearancesIngressionParams extends SearchParamsSchema {
  appearance_id?: number;
  proposal_id?: number;
  status?: 'unreviewed' | 'accepted' | 'rejected';
}

export interface GetAppearancesIngressionData {
  error_code: number;
  ingression_status: Array<{
    accepted_instruction_count: number;
    appearance_id: number;
    cabinet_type_id: number;
    cabinet_type_info: {
      camera_count: number;
      comment: string;
      create_time: string;
      factory_model: string;
      id: number;
      layer_count: number;
      manufacturer: string;
      name: string;
      type: string;
      udpate_time: string;
    };
    id: number;
    instruction_count: number;
    missing_instruction_count: number;
    pending_instruction_count: number;
    proposal_id: number;
    rejected_instruction_count: number;
    status: string;
  }>;
  total: number;
}

export interface DetectAnImageParams {
  skuId: string;
  visionId: string;
  skuImageUrl: string;
}

export const detectAnImage$ = buildRequest<DetectAnImageParams, DataResponse>(
  (params: DetectAnImageParams) => {
    const { skuId, visionId, skuImageUrl } = params;
    return http.request({
      url: `/v2/skus/${skuId}/detect-results.fl`,
      method: 'get',
      params: {
        vision_id: visionId,
        sku_image: skuImageUrl
      }
    });
  }
);
