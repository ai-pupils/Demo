import buildRequest from '@/utils/buildRequest';
import { DataListResponse } from '@/interface';
import rxios from '@http';
import { apiPrefix } from '@/api/v2/apiVersion';

export interface GetBundleLogsData {
  created_at: string;
  from_info: {
    audited_comment: string;
    audited_status: string;
    price_data: {};
    status: string;
  };
  operator_name: string;
  to_info: {
    audited_comment: string;
    audited_status: string;
    price_data: {};
    status: string;
  };
}

export const getBundleLogs$ = buildRequest<
  any,
  DataListResponse<GetBundleLogsData>
>((params: any) => {
  return rxios.request({
    url: `${apiPrefix}/bundles/${params.bundleId}/logs.fl`,
    method: 'GET'
  });
});
