)<template lang="pug">
  #transaction-statistics
    StatisticsInfoCard.mb20(:data="totals")
    StatisticsChartDay.mb20
    StatisticsChartHours.mb20
</template>


<script lang="ts">
import Component, { mixins } from 'vue-class-component';
import StatisticsInfoCard, {
  StatisticsInfoCardType
} from '@/components/shared/StatisticsInfoCard.vue';
import LoadPageMixin, { LoadPageMixinInstance } from '@/mixins/loadPage';
import { DefaultApiType, DefaultDataResponse } from '@/interface';
import {
  getTransctionStatisticsTotal$,
  TransactionTotalAllData
} from '@/api/transaction';
import ComponentOptionsMixin from '@/mixins/componentOptions';
import StatisticsChartDay from '@/view/transaction/components/StatisticsChartDay.vue';
import StatisticsChartHours from '@/view/transaction/components/StatisticsChartHours.vue';

@Component({
  components: { StatisticsChartHours, StatisticsChartDay, StatisticsInfoCard }
})
export default class TransactionStatistics
  extends mixins<
    ComponentOptionsMixin<DefaultDataResponse<TransactionTotalAllData>>
  >(LoadPageMixin)
  implements LoadPageMixinInstance {
  fetchOnce: boolean = true;
  defaultApi: DefaultApiType = getTransctionStatisticsTotal$;
  defaultParams: any = {};

  transformParams(params: any) {
    return params;
  }

  get totals() {
    if (this.statePayload) {
      const { total, day, week, month } = this.statePayload.data;
      return [
        {
          title: '交易数',
          count: total.total_trx_count,
          contents: [
            {
              label: '今日新增',
              count: day.trx_count
            },
            {
              label: '单日最大新增',
              count: `${day.trx_count_max} (${day.trx_count_max_date})`
            },
            {
              label: '本周新增',
              count: week.trx_count
            },
            {
              label: '单周最大新增',
              count: `${week.trx_count_max} (${week.trx_count_max_date})`
            },
            {
              label: '本月新增',
              count: month.trx_count
            },
            {
              label: '单月最大新增',
              count: `${month.trx_count_max} (${month.trx_count_max_date})`
            }
          ]
        },
        {
          title: '失败交易数',
          count: total.total_trx_anomaly_count,
          contents: [
            {
              label: '今日新增',
              count: day.trx_anomaly_count
            },
            {
              label: '单日最大新增',
              count: `${day.trx_anomaly_count_max} (${day.trx_anomaly_count_max_date})`
            },
            {
              label: '本周新增',
              count: week.trx_anomaly_count
            },
            {
              label: '单周最大新增',
              count: `${week.trx_anomaly_count_max} (${week.trx_anomaly_count_max_date})`
            },
            {
              label: '本月新增',
              count: month.trx_count
            },
            {
              label: '单月最大新增',
              count: `${month.trx_anomaly_count_max} (${month.trx_anomaly_count_max_date})`
            }
          ]
        },
        {
          title: '错误交易数',
          count: total.total_trx_error_count,
          contents: [
            {
              label: '今日新增',
              count: day.trx_error_count
            },
            {
              label: '单日最大新增',
              count: `${day.trx_error_count_max} (${day.trx_error_count_max_date})`
            },
            {
              label: '本周新增',
              count: week.trx_error_count
            },
            {
              label: '单周最大新增',
              count: `${week.trx_error_count_max} (${week.trx_error_count_max_date})`
            },
            {
              label: '本月新增',
              count: month.trx_error_count
            },
            {
              label: '单月最大新增',
              count: `${month.trx_error_count_max} (${month.trx_error_count_max_date})`
            }
          ]
        },
        {
          title: '交易商品数',
          count: total.total_sku_transaction_count,
          contents: [
            {
              label: '今日新增',
              count: day.sku_transaction_count
            },
            {
              label: '单日最大新增',
              count: `${day.sku_transaction_count_max} (${day.sku_transaction_count_max_date})`
            },
            {
              label: '本周新增',
              count: week.sku_transaction_count
            },
            {
              label: '单周最大新增',
              count: `${week.sku_transaction_count_max} (${week.sku_transaction_count_max_date})`
            },
            {
              label: '本月新增',
              count: month.sku_transaction_count
            },
            {
              label: '单月最大新增',
              count: `${month.sku_transaction_count_max} (${month.sku_transaction_count_max_date})`
            }
          ]
        }
      ] as StatisticsInfoCardType[];
    }
    return [];
  }
}
</script>
