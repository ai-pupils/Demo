import _ from 'lodash';
import axios from '@/utils/axios';
import { getLabel } from '@/utils/misc';
import {
  SkuPackageTypes,
  SkuBarcodeTypes,
  SkuStatus,
  reviewedStatus,
  SkuTypes
} from '@/const/data/sku';


export const SKUS = '/skus.fl';
export const getSkus = ({
  start,
  limit,
  sortBy = ['created_at', 'down'],
  keyword = '',
  packageType = '',
  skuStatus = '',
  skuType
}) => {
  const params = {
    page_index: start,
    page_size: limit,
    search_text: String(keyword).trim(),
    sort_by: sortBy[0],
    sort_direction: sortBy[1],
    package_type: packageType,
    sku_status: skuStatus,
    sku_type: skuType
  };

  return axios.get(SKUS, { params });
};

const CREATE_SKU = '/skus.fl';
export const createSku = data => axios.post(CREATE_SKU, data);

const GET_SKU = id => `/skus/${id}.fl`;
export const getSku = id => axios.get(GET_SKU(id));

const UPDATE_SKU = id => `/skus/${id}.fl`;
export const updateSku = (id, data) => axios.put(UPDATE_SKU(id), data);
export const updateSkuStatus = (id, status) =>
  axios.put(UPDATE_SKU(id), { status });

export const UPLOAD_SKU_IMAGE = '/skus/images/upload.fl';

export const getSkuPackageTypeLabel = _.partial(getLabel, SkuPackageTypes);
export const getSkuTypeLabel = _.partial(getLabel, SkuTypes);
export const getSkuBarcodeTypeLabel = _.partial(getLabel, SkuBarcodeTypes);
export const getSkuStatusLabel = _.partial(getLabel, SkuStatus);
export const getSkuIngeressionStatusLabel = _.partial(getLabel, reviewedStatus);
