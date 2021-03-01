import buildRequest from '@/utils/buildRequest';
import {
  DataListResponse,
} from '@/interface';
import rxios from '@http';
import { apiPrefix } from '@/api/v2/apiVersion';

/*
* @see https://gitlab.malong.com/retailai/rai-portal-dashboard/wikis/%E8%8E%B7%E5%8F%96%E5%95%86%E5%93%81%E4%B8%8A%E6%96%B0%E5%9B%BE%E7%89%87
* */
export const getSkuIngressionImages$ = buildRequest<
  any,
  DataListResponse<any>
  >((params: any) => {
  return rxios.request({
    url: `${apiPrefix}/skus/${params.pucode}/ingression/images.fl`,
    method: 'GET',
    params: {
      vision_id: params.vision_id,
      reviewed_status: params.reviewed_status
    }
  });
});
