import buildRequest from '@/utils/buildRequest';
import rxios from '@/utils/rxios';
import { parseQueryDate } from '@/utils/misc';

const TRX_COUNT = '/statistics/trx-count.fl';
const TRX_APPEND = '/statistics/trx-append-count.fl';

// 获取交易统计数据24小时图表
export const getTrxCount$ = buildRequest(params => {
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

// 获取交易统计数据日统计表
export const getTrxCountForDays$ = buildRequest(params => {
  const {
    startTime,
    endTime,
    dealerId,
    cabinetId,
    groupBy = 'day'
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

// 获取交易统计数据新增数据
export const getTrxAppendData$ = buildRequest(() =>
  rxios.request({
    url: TRX_APPEND,
    method: 'GET'
  })
);
