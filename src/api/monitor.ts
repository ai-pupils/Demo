import rxios from '@/utils/rxios';
import buildRequest from '@/utils/buildRequest';
import {
  DataListResponse,
  DataResponse,
  SearchParamsSchema
} from '@/interface';
import { getRealTime, parseDateRange, parseQueryDateTime } from '@/utils/misc';
import { map } from 'rxjs/operators';
import _ from 'lodash';

export interface GetExceptionParams extends SearchParamsSchema {
  from?: string;
  to?: string;
  dealer_id?: number;
  cabinet_id?: number;
  cabinet_name?: string;
  cabinet_imei?: string;
  cabinet_serial?: string;
  cabinet_type_id?: number;
  trx_sn?: string;
  codes?: string;
  status?: string;
  priority?: string;
  is_deleted?: boolean;
}

export interface GetCabinetHardwareInfoParams {
  from: string;
  to: string;
  cabinet_id: number;
  info_type: string;
}

export interface GetCabinetHardwareInfoData {
  time: number;
  signal_strength?: number;
  temperature?: number;
  signal_noise_ratio?: number;
}

export interface GetExceptionsData {
  cabinet_id: number;
  cabinet_name: string;
  cabinet_serial: string;
  cabinet_type_id: number;
  code: string;
  desc: string;
  ended_at: string;
  id: number;
  is_deleted: boolean;
  name: string;
  started_at: string;
  status: string;
}

export interface GetRecognitionsParams extends SearchParamsSchema {
  from?: string;
  to?: string;
  dealer_id?: number;
  cabinet_id?: number;
  cabinet_serial?: string;
  cabinet_type_id?: number;
  bundle_id?: number;
  model_id?: number;
  aggregate_field?: string;
}

export interface GetRecognitionsData {
  bundle: any;
  cabinet: any;
  created_at: string;
  date_hour: string;
  dealer: any;
  id: number;
  model_id: number;
  model_correct_count: number;
  model_correct_ratio: string;
  payment_correct_count: number;
  payment_correct_ratio: string;
  system_correct_count: number;
  system_correct_ratio: string;
}

// 获取异常列表
export const getExceptions$ = buildRequest<
  GetExceptionParams,
  DataListResponse<GetExceptionsData>
>(params => {
  let {
    keyword,
    from,
    to,
    dealer_id,
    cabinet_id,
    cabinet_serial,
    cabinet_type_id,
    trx_sn,
    codes,
    status,
    priority,
    is_deleted,
    pageIndex,
    pageSize,
    sortBy
  }: GetExceptionParams = params;

  let dateRange: any[] = [];
  if (from && to) {
    dateRange = getRealTime([from, to]);
    from = dateRange[0];
    to = dateRange[1];
  }

  return rxios
    .request({
      url: `/v2/exceptions.fl`,
      method: 'GET',
      params: {
        from,
        to,
        dealer_id,
        cabinet_id,
        cabinet_serial,
        cabinet_type_id,
        trx_sn,
        codes,
        status,
        priority,
        is_deleted,
        query: keyword,
        page_index: pageIndex ? Number(pageIndex - 1) : undefined,
        page_size: pageSize ? Number(pageSize) : undefined,
        order_by: sortBy
      }
    })
    .pipe(
      map(state => {
        if (state.data) {
          const {
            data: { results }
          } = state as any;
          results.forEach((result: any) => {
            result.error_code = result.code;
            result.serial = result.cabinet_serial;
          });
        }
        return state;
      })
    );
});

/** 获取识别准确率统计
 * @see http://rai-showdoc.c3f7b5c5fbf6c444eacaaff28e0bfa82a.cn-hangzhou.alicontainer.com/web/#/1?page_id=125
 */
export const getRecognitions$ = buildRequest<
  GetRecognitionsParams,
  DataListResponse<GetRecognitionsData>
>(params => {
  let {
    keyword,
    from,
    to,
    dealer_id,
    cabinet_id,
    cabinet_serial,
    cabinet_type_id,
    bundle_id,
    model_id,
    aggregate_field,
    pageIndex,
    pageSize,
    sortBy
  }: GetRecognitionsParams = params;

  let dateRange: any[] = [];
  if (from && to) {
    dateRange = getRealTime([from, to]);
  } else {
    let dataArray = parseDateRange('last week', false)();
    dateRange = getRealTime(dataArray);
  }

  return rxios
    .request({
      url: `/statistics/recognition.fl`,
      method: 'GET',
      params: {
        from: dateRange[0],
        to: dateRange[1],
        dealer_id,
        cabinet_id,
        cabinet_serial,
        cabinet_type_id,
        bundle_id,
        model_id,
        aggregate_field,
        query: keyword,
        page_index: pageIndex ? Number(pageIndex - 1) : undefined,
        page_size: pageSize ? Number(pageSize) : undefined,
        order_by: sortBy
      }
    })
    .pipe(
      map(state => {
        if (state.data) {
          const {
            data: { results }
          } = state as any;
          results.forEach((result: any) => {
            result.model_correct_ratio =
              _.round(result.model_correct_ratio * 100, 2) + '%';
            result.payment_correct_ratio =
              _.round(result.payment_correct_ratio * 100, 2) + '%';
            result.system_correct_ratio =
              _.round(result.system_correct_ratio * 100, 2) + '%';
          });
        }
        return state;
      })
    );
});

// 修改异常状态
export const updateExceptionStatus$ = buildRequest(params => {
  const { exception_id, status } = params;

  return rxios.request({
    url: `/v2/exceptions/${exception_id}.fl`,
    method: 'PUT',
    data: {
      status
    }
  });
});

/** 获取硬件信息
 * @see https://gitlab.malong.com/retailai/rai-portal-dashboard/wikis/%E8%B4%A7%E6%9F%9C%E7%A1%AC%E4%BB%B6%E4%BF%A1%E6%81%AF
 */
export const getCabinetHardwareInfo$ = buildRequest<
  GetCabinetHardwareInfoParams,
  DataListResponse<GetCabinetHardwareInfoData>
>(params => {
  let {
    from,
    to,
    cabinet_id,
    info_type
  }: GetCabinetHardwareInfoParams = params;

  let dateTimeRange: any[] = [];
  if (from && to) {
    dateTimeRange = parseQueryDateTime([from, to]);
  } else {
    let dataTimeArray = parseDateRange('today', false)();
    dateTimeRange = parseQueryDateTime(dataTimeArray);
  }

  return rxios
    .request({
      url: `/v2/cabinets/${cabinet_id}/hardware.fl`,
      method: 'GET',
      params: {
        from: dateTimeRange[0],
        to: dateTimeRange[1],
        info_type
      }
    })
    .pipe(
      map(state => {
        if (state.data) {
          const { data } = state;
          data.forEach((t: any) => {
            if (!_.isNumber(t.time)) {
              data.splice(data.indexOf(t), 1);
            }
            let val;
            switch (info_type) {
              case 'SNIR':
                val = t.signal_noise_ratio;
                break;
              case 'SIGNAL':
                val = t.signal_strength;
                break;
              case 'TEMPERATURE':
                val = t.temperature;
                break;
            }
            if (!_.isNumber(val)) {
              data.splice(data.indexOf(t), 1);
            }
          });
          data.forEach((t: any) => {
            if (_.isNumber(t.time)) {
              t.time = t.time * 1000;
            }
          });
        }
        return state;
      })
    );
});

// 导出准确率数据
export const exportRecognitionData$ = buildRequest<
  GetRecognitionsParams,
  DataListResponse<GetRecognitionsData>
>(params => {
  let {
    keyword,
    from,
    to,
    dealer_id,
    cabinet_id,
    cabinet_serial,
    cabinet_type_id,
    bundle_id,
    model_id,
    aggregate_field,
    sortBy
  }: GetRecognitionsParams = params;

  let dateRange: any[] = [];
  if (from && to) {
    dateRange = getRealTime([from, to]);
  } else {
    let dataArray = parseDateRange('last week', false)();
    dateRange = getRealTime(dataArray);
  }

  return rxios.request({
    url: `/statistics/recognition/export.csv?`,
    method: 'GET',
    params: {
      from: dateRange[0],
      to: dateRange[1],
      dealer_id,
      cabinet_id,
      cabinet_serial,
      cabinet_type_id,
      bundle_id,
      model_id,
      aggregate_field,
      query: keyword,
      page_index: 0,
      page_size: 99999,
      order_by: sortBy
    },
    responseType: 'arraybuffer'
  });
});

// 导出异常列表
export const exportExceptionData$ = buildRequest<
  GetExceptionParams,
  DataListResponse<GetExceptionsData>
>(params => {
  let {
    keyword,
    from,
    to,
    dealer_id,
    cabinet_id,
    cabinet_serial,
    cabinet_type_id,
    trx_sn,
    status,
    priority,
    is_deleted,
    sortBy
  }: GetExceptionParams = params;

  let dateRange: any[] = [];
  if (from && to) {
    dateRange = getRealTime([from, to]);
    from = dateRange[0];
    to = dateRange[1];
  }

  return rxios.request({
    url: `/v2/exceptions/data-forms`,
    method: 'GET',
    params: {
      from,
      to,
      dealer_id,
      cabinet_id,
      cabinet_serial,
      cabinet_type_id,
      trx_sn,
      status,
      priority,
      is_deleted,
      query: keyword,
      page_index: 0,
      page_size: 99999,
      order_by: sortBy
    },
    responseType: 'arraybuffer'
  });
});
