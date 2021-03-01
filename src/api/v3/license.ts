import { PageType, SortType, DataResponse } from '@/interface';
import { SearchParamsV3, apiPrefix, fixParams } from './apiVersion';
import buildRequest from '@/utils/buildRequest';
import rxios from '@/utils/rxios';

export interface GetLicenseParams extends PageType, SortType, SearchParamsV3 {
  dealer_id?: number;
  license_key?: string;
}

export interface GetCabinetKeysParams
  extends PageType,
    SortType,
    SearchParamsV3 {
  status?: string;
  key: string;
}

export interface GetCabinetKeysData {
  id: number;
  cabinet_key: string;
  create_time: string;
  cabinet_serial_id: string;
  expire_time: string;
  license_key: string;
  status: string;
}

export interface GetLicenseData {
  cabinet_key_duration: number;
  create_time: string;
  expire_time: string;
  id: number;
  license_key: string;
  operator: string;
  total_count: number;
  used_count: number;
  user_id: number;
  user_name: string;
}

/**
 * 获取所有license
 * @see https://gitlab.malong.com/retailai/rai-portal-dashboard/wikis/%E8%8E%B7%E5%8F%96%E6%89%80%E6%9C%89license
 */
export const getLicense$ = buildRequest<
  GetLicenseParams,
  DataResponse<GetLicenseData[]>
>((params: GetLicenseParams) => {
  params = { ...params, ...fixParams(params) };
  const {
    query,
    order_by,
    page_index,
    page_size,
    dealer_id,
    license_key
  } = params;
  return rxios.request({
    url: `${apiPrefix}/licenses.fl`,
    method: 'GET',
    params: {
      query,
      order_by,
      page_index,
      page_size,
      dealer_id,
      license_key
    }
  });
});

/**
 * 获取license下所有的cabinet_key
 * @see https://gitlab.malong.com/retailai/rai-portal-dashboard/wikis/%E8%8E%B7%E5%8F%96license%E4%B8%8B%E6%89%80%E6%9C%89%E7%9A%84cabinet_key
 */
export const getLicenseCabinetKeys$ = buildRequest<
  GetCabinetKeysParams,
  DataResponse<GetCabinetKeysData[]>
>((params: GetCabinetKeysParams) => {
  params = { ...params, ...fixParams(params) };
  const { key, query, order_by, page_index, page_size, status } = params;
  return rxios.request({
    url: `${apiPrefix}/licenses/${key}/cabinet_keys.fl`,
    method: 'GET',
    params: {
      query,
      order_by,
      page_index,
      page_size,
      status
    }
  });
});
