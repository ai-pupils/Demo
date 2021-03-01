import rxios from '@/utils/rxios';
import buildRequest from '@/utils/buildRequest';
import { DataResponse } from '@/interface';
import { getRealTime } from '@/utils/misc';
import moment from 'moment';
import { map } from 'rxjs/operators';

export interface getCabinetCountParams {
  from_day?: any;
  to_day?: any;
  dealer_id?: number;
  cabinet_type_id?: undefined;
}

export interface getCabinetCountData {}

// 获取设备统计数据
export const getCabinetHisCount$ = buildRequest<
  getCabinetCountParams,
  DataResponse<getCabinetCountData>
>(params => {
  let { from_day, to_day, dealer_id, cabinet_type_id }: any = params;

  if (from_day && to_day) {
    from_day = moment(from_day).format('YYYY-MM-DD');
    to_day = moment(to_day)
      .add(1, 'd')
      .format('YYYY-MM-DD');
  }

  return rxios
    .request({
      url: `/v2/statistics/cabinets/his.fl`,
      method: 'GET',
      params: {
        from_day,
        to_day,
        dealer_id,
        cabinet_type_id
      }
    })
    .pipe(
      map((state: any) => {
        if (state.data) {
          state.data.results.forEach((item: any) => {
            item.fault_ratio =
              item.available_time === 0
                ? 0
                : item.locked_time / item.available_time;
          });
        }
        return state;
      })
    );
});

// 获取设备每日数据
export const getCabinetDailyCount$ = buildRequest<
  getCabinetCountParams,
  DataResponse<getCabinetCountData>
>(params => {
  let { from, to, dealer_id, cabinet_type_id }: any = params;

  let dateRange: any[] = [];
  if (from && to) {
    dateRange = getRealTime([from, to]);
    from = dateRange[0];
    to = dateRange[1];
  }

  return rxios.request({
    url: `/v2/statistics/cabinets.fl`,
    method: 'GET',
    params: {
      from,
      to,
      dealer_id,
      cabinet_type_id
    }
  });
});
