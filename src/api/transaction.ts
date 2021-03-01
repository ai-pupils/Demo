import rxios from '@/utils/rxios';
import buildRequest from '@/utils/buildRequest';
import http from '@http';
import {
  DataListResponse,
  DataResponse,
  DefaultDataResponse
} from '@/interface';
import { parseDateRange, parseQueryDate } from '@/utils/misc';
import fmt from '@/const/fmt';
import moment from 'moment';

// 获取所有交易的宏观数据
const TRANSACTIONS = '/transactions.fl';
const TANSACTION = (id: string) => `/transactions/${id}.fl`;
const REPORT_TANSACTION_ISSUE = (trxSn: string) =>
  `/transactions/${trxSn}/report.fl`;
const UPDATE_TANSACTION_ISSUE = (id: string) => `/transactions/report/${id}.fl`;
const TRX_COUNT = '/statistics/trx-count.fl';
const TRX_APPEND = '/statistics/trx-append-count.fl';

export type TransactionVerifyStatusType = 'waiting' | 'resolved' | 'rejected';

export interface TransactionParams {
  pageIndex: number; // 页码
  pageSize: number; // 每页Item Size
  keyword?: string; // 模糊搜索keyword，支持商户ID、客户名称、货柜ManagerID、交易SN
  isErrorOnly?: boolean; // 是否查询错误交易，默认false，支持true和false
  verifyStatusChecked?: TransactionVerifyStatusType | ''; // 错误交易的审核状态
  sortBy?: string; // 排序字段，默认create_time
  sortDirection?: string; // 顺序，默认sort_direction
  from?: any; // 例如2018-11-14 16:00:00
  to?: any; // 例如2019-02-15 16:00:00
  trxSn?: string; // 交易SN，模糊搜索trx-sn，用于货柜管理页面的历史交易Tab
  cabinetId?: string; // 货柜id，用于货柜管理页面的历史交易Tab
  dealerId?: string; // 商户id，用于商户详情页面的历史交易Tab
  timestamp?: string;
}

export interface TransactionData {
  id: number; // 交易ID
  trx_sn: number; // 交易SN
  type: string; // 交易类型
  status: string; // 交易状态
  sku_diff?: {
    barcode: string;
    count: number;
    manager_sku_id: string;
    name: string;
    sku_id: number;
  };
  cabinet_id: number; // 货柜ID
  manager_cabinet_id: string; // 货柜ManagerID
  model_id: number; // 模型ID
  exception_info: string; // 交易异常信息
}

export const getTransactions$ = buildRequest<
  TransactionParams,
  DataResponse<TransactionData>
>(params => {
  const {
    pageIndex = 1,
    pageSize = process.env.PAGE_SIZE,
    isErrorOnly,
    verifyStatusChecked,
    from = parseDateRange('last week', false)()[0],
    to = parseDateRange('last week', false)()[1],
    keyword,
    sortBy,
    sortDirection,
    cabinetId,
    dealerId,
    timestamp
  } = params;

  let startTime, endTime;
  if (from !== 'all' && to !== 'all') {
    const parseDate = parseQueryDate(from, to);
    startTime = parseDate.from;
    endTime = parseDate.to;
  }

  if (
    timestamp &&
    timestamp > new Date(fmt.formatDate(startTime)).getTime() &&
    timestamp < new Date(fmt.formatDate(endTime)).getTime()
  ) {
    endTime = parseQueryDate(
      from,
      moment(timestamp, 'x')
        .subtract(1, 'day')
        .format('YYYY-MM-DD HH:mm:ss')
    ).to;
  }

  return http.request({
    url: TRANSACTIONS,
    method: 'GET',
    params: {
      page_index: Number(pageIndex - 1),
      page_size: Number(pageSize),
      search_text: keyword ? String(keyword).trim() : keyword,
      is_error_only: isErrorOnly,
      verify_status: verifyStatusChecked,
      start_time: startTime,
      end_time: endTime,
      sort_by: sortBy,
      sort_direction: sortDirection,
      cabinet_id: cabinetId,
      dealer_id: dealerId
    }
  });
});

// 获取交易详情数据
export const getTransactionBySn$ = buildRequest((params: any) =>
  rxios.request({
    url: TANSACTION(params.id),
    method: 'GET'
  })
);

// 交易异常上报
export const reportTrxIssue$ = buildRequest((params: any) => {
  const { trx_sn, report_type, error_code, desc, dealer_id } = params;

  return rxios.request({
    url: REPORT_TANSACTION_ISSUE(trx_sn),
    method: 'POST',
    data: {
      report_type,
      error_code,
      desc,
      dealer_id
    }
  });
});

// 更新交易异常
export const updateTrxIssue$ = buildRequest((params: any) => {
  const { id, error_code, desc, dealer_id } = params;
  return rxios.request({
    url: UPDATE_TANSACTION_ISSUE(id),
    method: 'PUT',
    data: {
      error_code,
      desc,
      dealer_id
    }
  });
});

export interface TransactionTotalData {
  available_count: number; // 单日可用sku新增个数
  available_count_max: number; // 单日可用sku最大新增个数
  available_count_max_date: number; // 单日可用sku最大新增个数的时间段
  sku_transaction_count: number; // 单日购买的sku个数
  sku_transaction_count_max: number; // 单日购买的sku最大个数
  sku_transaction_count_max_date: number; // 单日购买的sku最大个数的时间段
  trx_anomaly_count: number; // 单日异常交易出现次数
  trx_anomaly_count_max: number; // 单日异常交易出现最大次数
  trx_anomaly_count_max_date: number; // 单日异常交易出现最大次数的时间段
  trx_count: number; // 单日总交易次数
  trx_count_max: number; // 单日最大交易次数
  trx_count_max_date: number; // 单日最大交易次数的时间段
  trx_error_count: number; // 单日错误交易出现次数
  trx_error_count_max: number; // 单日错误交易出现最大次数
  trx_error_count_max_date: number; // 单日错误交易出现最大次数的时间段
}

export interface TransactionTotalAllData {
  day: TransactionTotalData;
  week: TransactionTotalData;
  month: TransactionTotalData;
  total: {
    total_available_count: number;
    total_sku_transaction_count: number;
    total_trx_anomaly_count: number;
    total_trx_count: number;
    total_trx_error_count: number;
  };
}

// 新增数据统计
export const getTransctionStatisticsTotal$ = buildRequest<
  void,
  DefaultDataResponse<TransactionTotalAllData>
>(() => {
  return http.request({
    url: '/statistics/trx-append-count.fl',
    method: 'get'
  });
});

export interface QueryTrxCountParams {
  startTime: string;
  endTime: string;
  dealerId?: string;
  cabinetId?: string;
  groupBy: '24hours' | 'hour' | 'day' | 'week' | 'month';
}

// 获取交易统计数
export const getTrxCount$ = buildRequest((params: QueryTrxCountParams) => {
  const {
    startTime,
    endTime,
    dealerId,
    cabinetId,
    groupBy = '24hours'
  } = params;
  const queryDate = parseQueryDate(startTime, endTime);

  return rxios.request({
    url: TRX_COUNT,
    method: 'GET',
    params: {
      start_time: queryDate.from,
      end_time: queryDate.to,
      dealer_id: dealerId,
      cabinet_id: cabinetId,
      group_by: groupBy
    }
  });
});

export interface GetTransactionStatusParams {
  dealerId?: number; // 商户ID
}

export interface TransactionStatusData {
  trx_report_type: Array<{
    count: number;
    ratio: number;
    report_type: 'None' | 'error' | 'success';
  }>;
  trx_status: 'finished' | 'exceptional' | 'processing' | 'invalid';
  trx_status_count: number;
  trx_status_ratio: number;
}

// 获取交易统计数据-trx-status
export const getTransactionStatus$ = buildRequest<
  GetTransactionStatusParams,
  DefaultDataResponse<{
    error_code: number;
    results: TransactionStatusData[];
    total_count: number;
  }>
>((params: GetTransactionStatusParams) => {
  const { dealerId } = params;

  return http.request({
    url: '/transactions/statistics/status.fl',
    method: 'get',
    params: {
      dealer_id: dealerId
    }
  });
});

/**
 * 获取交易hybrid调用分析
 * @see https://gitlab.malong.com/retailai/rai-portal-dashboard/wikis/%E4%BA%A4%E6%98%93hybrid%E8%B0%83%E7%94%A8%E5%88%86%E6%9E%90
 */
export const getHybridResults$ = buildRequest((params: any) =>
  rxios.request({
    url: `/transactions/hybrid/${params.trx_sn}.fl`,
    method: 'GET'
  })
);

/**
 * 导出交易数据
 * @see https://gitlab.malong.com/retailai/rai-portal-dashboard/wikis/%E4%BA%A4%E6%98%93hybrid%E8%B0%83%E7%94%A8%E5%88%86%E6%9E%90
 */
export const exportTransactionsData$ = buildRequest<
  TransactionParams,
  DataResponse<TransactionData>
>(params => {
  const {
    isErrorOnly,
    verifyStatusChecked,
    from = parseDateRange('last week', false)()[0],
    to = parseDateRange('last week', false)()[1],
    keyword,
    sortBy,
    sortDirection,
    cabinetId,
    dealerId,
    timestamp
  } = params;

  let startTime, endTime;
  if (from !== 'all' && to !== 'all') {
    const parseDate = parseQueryDate(from, to);
    startTime = parseDate.from;
    endTime = parseDate.to;
  }

  if (
    timestamp &&
    timestamp > new Date(fmt.formatDate(startTime)).getTime() &&
    timestamp < new Date(fmt.formatDate(endTime)).getTime()
  ) {
    endTime = parseQueryDate(
      from,
      moment(timestamp, 'x')
        .subtract(1, 'day')
        .format('YYYY-MM-DD HH:mm:ss')
    ).to;
  }

  return http.request({
    url: `/transactions/data-forms.fl`,
    method: 'GET',
    params: {
      query: keyword ? String(keyword).trim() : keyword,
      is_error_only: isErrorOnly,
      verify_status: verifyStatusChecked,
      from: startTime,
      to: endTime,
      sort_by: sortBy,
      sort_direction: sortDirection,
      cabinet_id: cabinetId,
      dealer_id: dealerId
    },
    responseType: 'arraybuffer'
  });
});
