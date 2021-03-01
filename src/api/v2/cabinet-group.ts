import rxios from '@http';
import buildRequest from '@/utils/buildRequest';
import http from '@http';
import {
  DefaultDataResponse,
  PageType,
  SortType
} from '@/interface';

export interface GetCabinetGroupsParams extends PageType, SortType {
  query?: string;
  creator_id?: number;
  cabinet_group_id?: number;
}

export interface CreateCabinetGroupParams {
  name: string;
  cabinet_ids: number[];
  description?: string;
  deleted?: boolean;
  cabinet_group_id?: number;
}

export interface GetCabinetGroupsData {}

/**
 * 获取货柜组信息
 * @see https://gitlab.malong.com/retailai/rai-portal-dashboard/wikis/%E8%8E%B7%E5%8F%96%E8%B4%A7%E6%9F%9C%E7%BB%84%E4%BF%A1%E6%81%AF
 */
export const getCabinetGroups$ = buildRequest<
  GetCabinetGroupsParams,
  DefaultDataResponse<GetCabinetGroupsParams>
>((params: GetCabinetGroupsParams) => {
  const {
    pageIndex,
    pageSize,
    order_by,
    query,
    creator_id,
    cabinet_group_id
  } = params;

  return http.request({
    url: '/v2/cabinets/groups.fl',
    method: 'get',
    params: {
      page_index: pageIndex ? Number(pageIndex - 1) : undefined,
      page_size: pageSize ? Number(pageSize) : undefined,
      order_by,
      query,
      creator_id,
      cabinet_group_id
    }
  });
});

/**
 * 创建货柜组
 * @see https://gitlab.malong.com/retailai/rai-portal-dashboard/wikis/%E5%88%9B%E5%BB%BA%E8%B4%A7%E6%9F%9C%E7%BB%84
 */
export const CreateCabinetGroup$ = buildRequest<
  CreateCabinetGroupParams,
  DefaultDataResponse<GetCabinetGroupsParams>
>((params: CreateCabinetGroupParams) => {
  const { name, cabinet_ids, description } = params;

  return http.request({
    url: '/v2/cabinets/groups.fl',
    method: 'post',
    data: {
      name,
      cabinet_ids,
      description
    }
  });
});

/**
 * 修改货柜组
 * @see https://gitlab.malong.com/retailai/rai-portal-dashboard/wikis/%E4%BF%AE%E6%94%B9%E8%B4%A7%E6%9F%9C%E7%BB%84
 */
export const UpdateCabinetGroup$ = buildRequest<
  CreateCabinetGroupParams,
  DefaultDataResponse<GetCabinetGroupsParams>
>((params: CreateCabinetGroupParams) => {
  const { name, cabinet_ids, description, deleted, cabinet_group_id } = params;

  return http.request({
    url: `/v2/cabinets/groups/${cabinet_group_id}.fl`,
    method: 'put',
    data: {
      name,
      cabinet_ids,
      description,
      deleted
    }
  });
});
