import buildRequest from '@/utils/buildRequest';
import {
  DataListResponse,
  DefaultDataResponse,
  SearchParamsSchema
} from '@/interface';
import http from '@http';
import { parseQueryDate } from '@/utils/misc';
import moment from 'moment';
import { map } from 'rxjs/operators';

export type PatrolStatus =
  | 'CREATED' // 巡检还未提交，默认状态
  | 'SUBMITTED'; // 巡检已提交（此后不能修改）

export type PatrolItemState =
  | 'UNKNOWN' // 未知
  | 'NORMAL' // 巡检正常
  | 'ABNORMAL'; // 巡检发现异常

export type PatrolAbnormalType =
  | 'U_RULE_VOILATED' // 未遵循U型摆放规则
  | 'GOODS_STACKED' // 商品堆叠摆放
  | 'UNSUPPORTED_OBJECT' // 放入异物（非售卖商品）
  | 'CAMERA' // 摄像头异常
  | 'LIGHT' // 灯带异常（灯带熄灭）
  | 'OTHER'; // 其他异常

export type TrxType =
  | 'TRANSACTION' // 正常交易
  | 'RESTOCKING'; // 补货

export interface PatrolInfo {
  id: number; // 巡检ID
  name: string; // 巡检名
  status: PatrolStatus; // 巡检状态
  from_time: string; // 巡检时间范围的开始时间
  to_time: string; // 巡检时间范围的结束
  creator_id: string; // 创建者，注意是字符串，可以填登陆用户的email
  dealer_id: number; // 商户id
  dealer_name: string; // 商户名
  total_count: number; // 巡检条目数量
  pending_count: number; // 未完成的巡检条目数
  finished_count: number; // 完成巡检的条目数
  created_at: string; // 创建时间
}

export interface LayerBasicInfo {
  layer_index: number; // layer编号
  start_image: string; // 对巡检不返回
  end_image: string; // layer关门图片
}

export interface PatrolTrxInfo {
  id: number; // 交易id
  sn: string; // 交易sn
  model_id: number; // 交易用的模型id
  type: TrxType; // 交易类型
  layers: LayerBasicInfo[]; // 交易各层信息
  created_at: string; // 创建时间
  closed_at: string; // 关门时间
}

export interface PatrolItemInfo {
  id: number; // 巡检条目id（非交易id）
  cabinet_id: number; // 交易货柜id
  handler_id: string; // 巡检员id（可以是email）
  trx_info: PatrolTrxInfo; // 巡检条目对应的交易信息
  state: PatrolItemState; // 巡检条目状态
  abnormal_types: PatrolAbnormalType[]; // 异常类型（只有异常的巡检条目才有）
  comment: string; // 描述（只有异常的巡检条目才有）
  solution: string; // 解决方案（只有异常的巡检条目才有）
  created_at: string; // 创建时间
}

export interface GetPatrolsParams extends SearchParamsSchema {
  query?: string;
  from: string;
  to: string;
  status?: string;
}

export interface PostPatrolsParams {
  name: string;
  from_time: string;
  to_time: string;
  dealer_id: number;
  creator_id: string;
}

export interface GetPatrolData extends PatrolInfo {}

export interface GetPatrolItemsParams {
  id: number;
  page_size: 1;
  page_index: number;
  state: any;
}

export interface PostPatrolItemParams {
  id: number;
  itemId: number;
  state: PatrolItemState;
  abnormal_types?: PatrolAbnormalType[];
  comment?: string;
  solution?: string;
  handler_id: number;
}

/**
 * 巡检查询
 * @see http://rai-showdoc.c3f7b5c5fbf6c444eacaaff28e0bfa82a.cn-hangzhou.alicontainer.com/web/#/1?page_id=135
 */
export const getPatrols$ = buildRequest<
  GetPatrolsParams,
  DefaultDataResponse<any>
>((params: GetPatrolsParams) => {
  const {
    pageIndex = 1,
    pageSize = process.env.PAGE_SIZE,
    from,
    to,
    status,
    sortBy,
    sortDirection
  } = params;

  let startTime, endTime;
  if (from !== 'all' && to !== 'all') {
    const parseDate = parseQueryDate(from, to, false);
    startTime = parseDate.from;
    endTime = parseDate.to;
  }

  return http.request({
    url: '/v2/patrols.fl',
    method: 'get',
    params: {
      page_index: Number(pageIndex - 1),
      page_size: Number(pageSize),
      from: startTime,
      to: endTime,
      status: status === 'all' ? undefined : status,
      order_by:
        sortBy && sortDirection
          ? `${sortBy} ${sortDirection === 'down' ? 'desc' : 'asc'}`
          : ''
    }
  });
});

/**
 * 创建巡检
 * @see http://rai-showdoc.c3f7b5c5fbf6c444eacaaff28e0bfa82a.cn-hangzhou.alicontainer.com/web/#/1?page_id=139
 */
export const postPatrols$ = buildRequest<
  PostPatrolsParams,
  DefaultDataResponse<any>
>((data: PostPatrolsParams) => {
  const { to_time, creator_id, dealer_id, from_time, name } = data;

  let startTime, endTime;
  if (from_time !== 'all' && to_time !== 'all') {
    startTime = moment(from_time)
      .utc()
      .format('YYYY-MM-DD HH:mm:ss');
    endTime = moment(to_time)
      .utc()
      .format('YYYY-MM-DD HH:mm:ss');
  }

  return http.request({
    url: '/v2/patrols.fl',
    method: 'post',
    data: {
      from_time: startTime,
      to_time: endTime,
      creator_id,
      dealer_id,
      name
    },
    suppressWarning: {
      100001: true
    }
  });
});

/**
 * 巡检任务详情
 * @see https://gitlab.malong.com/retailai/rai-portal-dashboard/wikis/获得单个巡检
 */
export const getPatrol$ = buildRequest<any, DefaultDataResponse<GetPatrolData>>(
  (params: { id: number }) => {
    return http.request({
      url: `/v2/patrols/${params.id}.fl`,
      method: 'get'
    });
  }
);

/**
 * 查询巡检条目
 * @see https://gitlab.malong.com/retailai/rai-portal-dashboard/wikis/查询巡检条目
 */
export const getPatrolImtes$ = buildRequest<
  GetPatrolItemsParams,
  DataListResponse<any>
>((params: GetPatrolItemsParams) => {
  return http
    .request({
      url: `/v2/patrols/${params.id}/items.fl`,
      method: 'get',
      params: {
        page_index: Number(params.page_index) - 1,
        page_size: 1,
        state: params.state
      },
      suppressWarning: {
        200001: true
      }
    })
    .pipe(
      map((state: any) => {
        let layers = state.data.results[0].trx_info.layers;
        // 拼接图片url
        layers = layers.map((layer: any) => {
          const host: string = '/v2/images';
          const reg: RegExp = /[http|https]:\/\//;

          if (!reg.test(layer.start_image)) {
            layer.start_image = host + layer.start_image;
          }
          if (!reg.test(layer.end_image)) {
            layer.end_image = host + layer.end_image;
          }
          return layer;
        });
        return state;
      })
    );
});

/**
 * 更新巡检
 * @see https://gitlab.malong.com/retailai/rai-portal-dashboard/wikis/更新巡检
 */
export const postPatrol$ = buildRequest<any, DefaultDataResponse<any>>(
  (data: { id: number; name?: string; status?: PatrolStatus }) => {
    return http.request({
      url: `/v2/patrols/${data.id}.fl`,
      method: 'post',
      data: {
        name: data.name,
        status: data.status
      }
    });
  }
);

/**
 * 更新巡检条目
 * @see https://gitlab.malong.com/retailai/rai-portal-dashboard/wikis/更新巡检条目
 */
export const postPatrolItem$ = buildRequest<
  PostPatrolItemParams,
  DefaultDataResponse<any>
>((data: PostPatrolItemParams) => {
  return http.request({
    url: `/v2/patrols/${data.id}/${data.itemId}.fl`,
    method: 'post',
    data
  });
});

/**
 * 导出巡检
 * @see https://gitlab.malong.com/retailai/rai-portal-dashboard/wikis/%E5%AF%BC%E5%87%BA%E5%B7%A1%E6%A3%80
 */
export const exportPatrols$ = buildRequest<any, DefaultDataResponse<any>>(
  (params: { id: string }) => {
    return http.request({
      url: `/v2/patrols/${params.id}/export.fl`,
      method: 'get',
      responseType: 'arraybuffer'
    });
  }
);
