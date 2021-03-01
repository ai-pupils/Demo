<template>
  <div class="page-content">
    <Card>
      <h6 slot="title">交易统计</h6>
      <Form class="search">
        <FormItem class="form-item">
          <DatePicker type="daterange"
                      :options="datePickerOption"
                      :clearable="false"
                      @on-change="getRealTime"
                      v-model="queryDate"
                      format="yyyy/MM/dd"
                      placement="bottom-start"
                      placeholder="交易时间"
                      :disabled="state$.isFetching"
                      style="width: 200px"></DatePicker>
          <Input v-model="keyword" placeholder="商户ID，客户名称，货柜ManagerID，交易SN" style="width: 300px"></Input>
          <Button class="query-btn"
                  type="primary"
                  html-type="submit"
                  :loading="state$.isFetching"
                  @click.prevent="search"
                  icon="ios-search">查询</Button>
          <Checkbox class="is-error-only"
                    v-model="isErrorOnly"
                    @on-change="search"
                    :disabled="state$.isFetching">查看错误交易</Checkbox>
          <span v-if="isErrorOnly">
            <Tag checkable :checked="isChecked(verifyStatus.waiting.name)"
                 :color="verifyStatus.waiting.tagColor"
                 @on-change="tagChangeWaiting">{{verifyStatus.waiting.text}}</Tag>
            <Tag checkable :checked="isChecked(verifyStatus.resolved.name)"
                 :color="verifyStatus.resolved.tagColor"
                 @on-change="tagChangeResolved">{{verifyStatus.resolved.text}}</Tag>
            <Tag checkable :checked="isChecked(verifyStatus.rejected.name)"
                 :color="verifyStatus.rejected.tagColor"
                 @on-change="tagChangeRejected">{{verifyStatus.rejected.text}}</Tag>
          </span>
          <Button class="query-btn"
                  :loading="state$.isFetching"
                  @click.prevent="exportSku"
                  style="float: right"
                  icon="md-download">导出SKU统计数据</Button>
          <Button class="query-btn"
                  :loading="state$.isFetching"
                  @click.prevent="exportTrx"
                  style="float: right; margin-right: 5px"
                  icon="md-download">导出交易</Button>
        </FormItem>
      </Form>

      <StatisticsTable :state="state$"
                       @sortChange="sortChange" :sort-change="sortChange" :default-sort="defaultSort"
        @refresh="refresh"></StatisticsTable>
      <PaginationBox :total="total$" :isFetching="state$.isFetching"></PaginationBox>
    </Card>
  </div>
</template>

<script type="text/jsx">
import PaginationBox from '@/components/shared/PaginationBox';
import { routerPushWithQuery, getRouteQuery } from '@/utils/observables';
import moment from 'moment';
import { mapActions, mapGetters } from 'vuex';
import StatisticsTable from './StatisticsTable';
import {
  parseDaterangepickerOption,
  parseDateRange,
  parseQueryDate
} from '@/utils/misc';
import { verifyStatus } from '@/const/data/transactionReport';
import { exportTransactionsSku, exportTransactions } from '@/store/api/export';
import { baseListMixin } from '@/mixins/commonListViewMixin';
import { getTransactions$ } from '@/api/transaction';

export default {
  mixins: [baseListMixin],
  components: { StatisticsTable, PaginationBox },
  data() {
    return {
      queryDate: parseDateRange('last week', false)(),
      verifyStatus,
      keyword: undefined,
      defaultApi: getTransactions$,
      defaultParams: {
        sortBy: 'create_time',
        sortDirection: 'down',
        from: parseDateRange('last week', false)()[0],
        to: parseDateRange('last week', false)()[1]
      },
      defaultSort: {
        prop: 'create_time',
        order: 'descending'
      }
    };
  },
  computed: {
    datePickerOption() {
      return parseDaterangepickerOption(
        [
          { text: '最近一周', distance: 'last week' },
          { text: '最近一个月', distance: 'last month' },
          { text: '最近三个月', distance: 'three month' }
        ],
        false
      );
    },
    isErrorOnly: {
      get() {
        const {
          $route: {
            query: { isErrorOnly }
          }
        } = this;
        return _.isNil(isErrorOnly)
          ? false
          : isErrorOnly === true || isErrorOnly === 'true';
      },
      set(newVal) {
        const {
          $route: { query }
        } = this;
        this.$router.replace({ query: { ...query, isErrorOnly: newVal } });
        this.verifyStatusChecked = newVal
          ? ['waiting', 'resolved', 'rejected']
          : [];
      }
    },
    verifyStatusChecked: {
      get() {
        const {
          $route: {
            query: { verifyStatusChecked }
          }
        } = this;
        return _.isNil(verifyStatusChecked) || !verifyStatusChecked.length
          ? []
          : verifyStatusChecked.split(',');
      },
      set(newVal) {
        const {
          $route: { query }
        } = this;
        this.$router.replace({
          query: { ...query, verifyStatusChecked: newVal.join(',') }
        });
      }
    }
  },
  methods: {
    exportSku() {
      const keyword = _.isNil(this.keyword) ? '' : this.keyword;
      const {
        isErrorOnly,
        queryDate: [from, to],
        verifyStatusChecked
      } = this;
      exportTransactionsSku({
        from,
        to,
        keyword,
        isErrorOnly,
        verifyStatusChecked: verifyStatusChecked.join(',')
      });
    },
    exportTrx() {
      const keyword = _.isNil(this.keyword) ? '' : this.keyword;
      const {
        isErrorOnly,
        queryDate: [from, to],
        verifyStatusChecked
      } = this;
      exportTransactions({
        from,
        to,
        keyword,
        isErrorOnly,
        verifyStatusChecked: verifyStatusChecked.join(',')
      });
    },
    getRealTime() {
      //取结束时间的 0:0:0, 调用接口时增加一天
      const end = moment(this.queryDate[1]);
      this.queryDate[1] = moment([
        end.get('year'),
        end.get('month'),
        end.get('date'),
        0,
        0,
        0
      ]).toDate();
      this.search();
    },
    tagChangeWaiting(value) {
      this.tagChange(verifyStatus.waiting.name, value);
    },
    tagChangeResolved(value) {
      this.tagChange(verifyStatus.resolved.name, value);
    },
    tagChangeRejected(value) {
      this.tagChange(verifyStatus.rejected.name, value);
    },
    tagChange(statusName, statusChecked) {
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
      this.search();
    },
    isChecked(statusName) {
      return this.verifyStatusChecked.indexOf(statusName) !== -1;
    },
    refresh() {
      this.initData$().subscribe();
    },
    search() {
      routerPushWithQuery(this, {
        pageIndex: 1,
        keyword: this.keyword,
        from: moment(this.queryDate[0]).format('YYYY-MM-DD HH:mm:ss'),
        to: moment(this.queryDate[1]).format('YYYY-MM-DD HH:mm:ss')
      });
    },
    sortChange(params) {
      routerPushWithQuery(this, {
        pageIndex: 1,
        ...params
      });
    }
  },
  mounted() {
    const { keyword, from, to } = getRouteQuery(this);
    this.keyword = keyword;
    if (from && to) {
      this.queryDate = [moment(from).toDate(), moment(to).toDate()];
    }
  }
};
</script>
<style type="text/less" lang="less" scoped>
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
