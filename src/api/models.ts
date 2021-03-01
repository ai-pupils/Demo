import rxios from '@/utils/rxios';
import buildRequest from '@/utils/buildRequest';

const MODELS = '/models.fl';
const MODEL = (id: any) => `/models/${id}.fl`;

// 获取所有模型
export const getModels$ = buildRequest(params => {
  const {
    pageIndex,
    pageSize,
    sortBy,
    sortDirection,
    keyword,
    cabinetTypeId,
    dealerId,
    modelStatus
  } = params;

  return rxios.request({
    url: MODELS,
    method: 'GET',
    params: {
      page_index: Number(pageIndex - 1),
      page_size: Number(pageSize),
      sort_by: sortBy,
      sort_direction: sortDirection,
      search_text: keyword ? String(keyword).trim() : keyword,
      cabinet_type_id: cabinetTypeId,
      dealer_id: dealerId,
      model_status: modelStatus
    }
  });
});

// 获取单个模型
export const getModel$ = buildRequest(id =>
  rxios.request({
    url: MODEL(id),
    method: 'GET'
  })
);

// 创建模型
export const postModels$ = buildRequest(params => {
  const { dealerId, bundleId, name, desc } = params;

  return rxios.request({
    url: MODELS,
    method: 'POST',
    data: {
      name,
      desc,
      dealer_id: dealerId,
      bundle_id: bundleId
    }
  });
});

// 修改模型
export const updateModel$ = buildRequest((id, params) => {
  const { dealerId, bundleId, status, name, desc } = params;

  return rxios.request({
    url: MODEL(id),
    method: 'PUT',
    data: {
      dealer_id: dealerId,
      bundle_id: bundleId,
      status,
      name,
      desc
    }
  });
});

/**
 * 绑定model到cabinet
 * @see http://rai-showdoc.c3f7b5c5fbf6c444eacaaff28e0bfa82a.cn-hangzhou.alicontainer.com/web/#/1?page_id=75
 */
export const bindCabinetModelV2 = buildRequest((data: any) => {
  return rxios.request({
    url: `/v2/cabinets/${data.id}/models/${data.model_id}.fl`,
    method: 'POST',
    data: {
      dealer_id: data.dealer_id
    }
  });
});
