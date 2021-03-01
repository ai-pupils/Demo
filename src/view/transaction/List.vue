<template lang="pug">
  .page-content
    Card
      .clearfix(slot='title')
        h3 交易管理
        .fr(style="font-size: 14px")
          span 展示开关门时间
          i-switch.ml10(v-model='isShowTime')
            span(slot='open') 是
            span(slot='close') 否
      Form.search
        FormItem.form-item
          AppDatePicker(v-model='queryDateRange', placeholder='交易时间', :disabled='state.isFetching')
          Input.ml5(v-model='searchSchema.keyword', placeholder='箱体编号/交易SN', style='width: 300px')
          Select.ml5(v-model="searchSchema.dealerId", style="width:200px", placeholder="请选择商户", clearable)
            Option(v-for="item in dealer_list", :value="item.id", :key="item.id") {{ item.label }}
          Button.query-btn.ml5(type='primary', searchSchemahtml-type='submit', :loading='state.isFetching', @click.prevent='doSearch', html-type="submit", icon='ios-search') 查询
          Checkbox.is-error-only(v-model='searchSchema.isErrorOnly', @on-change='doSearch', :disabled='state.isFetching') 查看错误交易
          <!--          span(v-if='searchSchema.isErrorOnly')-->
            <!--            tag(checkable='', :checked='isChecked(verifyStatus.waiting.name)', :color='verifyStatus.waiting.tagColor', @on-change='tagChangeWaiting') {{verifyStatus.waiting.text}}-->
            <!--            tag(checkable='', :checked='isChecked(verifyStatus.resolved.name)', :color='verifyStatus.resolved.tagColor', @on-change='tagChangeResolved') {{verifyStatus.resolved.text}}-->
            <!--            tag(checkable='', :checked='isChecked(verifyStatus.rejected.name)', :color='verifyStatus.rejected.tagColor', @on-change='tagChangeRejected') {{verifyStatus.rejected.text}}-->
          Button.query-btn.ml5(:loading='state.isFetching', @click.prevent='exportSku', style='float: right', icon='md-download') 导出SKU统计数据
          Button.query-btn.ml5(:loading='state.isFetching || loadingCsv', @click.prevent='exportTrx', style='float: right; margin-right: 5px', icon='md-download') 导出交易
      ListTable(:state='state', @sortChange="sortChange" :sort-change="sortChange" :default-sort="defaultSort"
      @refresh="refresh", :isShowTime="isShowTime")
      PaginationBox(:total='dataTotal', :isFetching='state.isFetching')
</template>

<script lang="ts">
import * as _ from 'lodash';
import Component, { mixins } from 'vue-class-component';
import LoadPageMixin, { LoadPageMixinInstance } from '@/mixins/loadPage';
import SearchMixin, { SearchMixinInstance } from '@/mixins/search';
import { getTransactions$, TransactionParams } from '@/api/transaction';
import AppDatePicker from '@/components/shared/AppDatePicker.vue';
import ListTable from './components/ListTable.vue';
import PaginationBox from '@/components/shared/PaginationBox.vue';
import { parseDateRange } from '@/utils/misc';
import { verifyStatus } from '@/const/data/transactionReport';
import { finalize, mergeMap } from 'rxjs/operators';
import { exportTransactionsSku } from '@/store/api/export';
import { Watch } from 'vue-property-decorator';
import { DefaultApiType } from '@/interface';
import { getCustomers$ } from '../../api/v2/users';
import { exportTransactionsData$ } from '@/api/transaction';
import { downloadFiles } from '@/utils/downloadCsv';

@Component({
  components: { AppDatePicker, ListTable, PaginationBox }
})
export default class TransactionList extends mixins(SearchMixin, LoadPageMixin)
  implements LoadPageMixinInstance, SearchMixinInstance {
  queryDateRange: Date[] = parseDateRange('last week', false)();
  defaultApi: DefaultApiType = getTransactions$;
  defaultParams: TransactionParams = {
    pageIndex: 1,
    pageSize: Number(process.env.PAGE_SIZE),
    from: this.queryDateRange[0],
    to: this.queryDateRange[1]
  };
  isShowTime = false;
  searchSchema: TransactionParams = {
    ...this.defaultParams,
    keyword: '',
    dealerId: undefined,
    from: undefined,
    to: undefined,
    isErrorOnly: undefined
  };
  verifyStatus: any = verifyStatus;
  defaultSort: any = {
    prop: 'create_time',
    order: 'descending'
  };
  loadingCsv = false;
  dealer_list = [];

  transformParams(params: TransactionParams) {
    return params;
  }

  mounted() {
    this.getDealerList();
  }

  @Watch('searchSchema.isErrorOnly')
  isErrorOnlyChange(v: boolean | string) {
    if (v === false || v === 'false' || v === undefined) {
      this.verifyStatusChecked = [];
    } else {
      this.verifyStatusChecked = ['waiting', 'resolved', 'rejected'];
    }
  }

  get verifyStatusChecked(): any {
    const {
      $route: {
        query: { verifyStatusChecked }
      }
    }: any = this;
    return _.isNil(verifyStatusChecked) || !verifyStatusChecked.length
      ? []
      : verifyStatusChecked.split(',');
  }

  set verifyStatusChecked(newVal) {
    const {
      $route: { query }
    } = this;
    const curQuery: any = { ...query };

    this.$router.replace({
      query: { ...curQuery, verifyStatusChecked: newVal.join(',') }
    });
  }

  exportSku() {
    const {
      searchSchema: { keyword, isErrorOnly, from, to },
      verifyStatusChecked
    } = this;

    this.startFetch$()
      .pipe(
        mergeMap(() =>
          from(
            exportTransactionsSku({
              from,
              to,
              keyword,
              isErrorOnly,
              verifyStatusChecked: verifyStatusChecked.join(',')
            })
          )
        ),
        finalize(() => {
          this.endFetch();
        })
      )
      .subscribe();
  }

  exportTrx() {
    this.loadingCsv = true;
    const {
      searchSchema: { keyword, isErrorOnly, from, to, dealerId },
      verifyStatusChecked
    } = this;
    exportTransactionsData$({
      from,
      to,
      keyword,
      dealerId,
      isErrorOnly,
      verifyStatusChecked: verifyStatusChecked.join(',')
    }).subscribe({
      next: ({ payload, isError }): any => {
        if (!isError && payload) {
          downloadFiles({
            file: (payload as any).file,
            filename:
              'trx-' + (dealerId ? dealerId + '-' : '') + `${from}~${to}`,
            type: 'xlsx'
          });
          this.$Message.success('导出成功');
        } else {
          this.loadingCsv = false;
        }
      },
      error: () => {
        this.loadingCsv = false;
        this.$Message.error('导出失败');
      },
      complete: () => {
        this.loadingCsv = false;
      }
    });
  }

  tagChangeWaiting(value: any) {
    this.tagChange(verifyStatus.waiting.name, value);
  }

  tagChangeResolved(value: any) {
    this.tagChange(verifyStatus.resolved.name, value);
  }

  tagChangeRejected(value: any) {
    this.tagChange(verifyStatus.rejected.name, value);
  }

  tagChange(statusName: any, statusChecked: any) {
    if (!statusChecked) {
      this.verifyStatusChecked.splice(
        this.verifyStatusChecked.indexOf(statusName),
        1
      );
      this.verifyStatusChecked = this.verifyStatusChecked;
    } else {
      if (this.verifyStatusChecked.indexOf(statusName) === -1) {
        this.verifyStatusChecked.push(statusName);
        this.verifyStatusChecked = this.verifyStatusChecked;
      }
    }
    this.doSearch();
  }

  isChecked(statusName: any): any {
    return this.verifyStatusChecked.indexOf(statusName) !== -1;
  }

  refresh() {
    this.loadDefaultApi();
  }

  getDealerList() {
    getCustomers$({ pageIndex: 1, pageSize: 99999 }).subscribe(state => {
      if (state.isFulfill) {
        const {
          payload: {
            data: { results }
          }
        } = state as any;
        this.dealer_list = results.map((r: any) => {
          return {
            id: r.user_id.toString(),
            name: r.name,
            // note: select列表必须转成字符串，否则有bug
            label: r.name ? r.user_id + ' - ' + r.name : r.user_id.toString()
          };
        });
      }
    });
  }
}
</script>

<style lang="less" scoped>
.query-btn {
  font-size: 14px;
}
.is-error-only {
  box-sizing: border-box;
  height: 35px;
  padding: 0 10px;
  margin-left: 5px;
  border-radius: 5px;
  color: white;
  font-size: 13px;
  vertical-align: middle;
  background: #2d8cf0;
  &.ivu-checkbox-wrapper-disabled {
    background: rgba(45, 140, 240, 0.67);
  }
}
</style>
