<template>
  <div class="page-content">
    <Card>
        <h6 slot="title">操作日志</h6>
        <div class="query-bar">
          <Form inline>
            <DatePicker type="daterange"
                        :options="datePickerOption"
                        :clearable="false"
                        v-model="queryDate"
                        format="yyyy-MM-dd"
                        placement="bottom-start"
                        placeholder="创建时间"
                        style="width: 200px"></DatePicker>
          </Form>
        </div>

        <Table :data="logs">
          <Column prop="created_at" label="操作时间">
            <template slot-scope="scope">
              {{scope.row.created_at|fmtLocalTime}}
            </template>
          </Column>
          <Column prop="group" label="操作类别"></Column>
          <Column prop="resource" label="操作对象"></Column>
          <Column prop="operation" label="操作事项"></Column>
          <Column prop="status" label="操作结果">
            <template slot-scope="scope">
              <Tag type="border" :color="scope.row.status|fmtColor">{{scope.row.status}}</Tag>
            </template>
          </Column>

          <template slot="empty">
            <StatusBox :isFetching="isFetching" :isEmpty="isEmpty" :error="error"></StatusBox>
          </template>
        </Table>
        <template v-if="isFulfill && total>0">
          <div class="tar">
            <Page :total="total"
                  :page-size="querySize"
                  :current="pageIndex"
                  show-total
                  @on-change="loadOtherPage"></Page>
          </div>
        </template>
    </Card>
  </div>
</template>

<script type="text/ecmascript-6">
import { mapState, mapActions } from 'vuex';
import fmt from '../../const/fmt';
import _ from 'lodash';
import moment from 'moment';
import stateParseMixin from '../../mixins/commonStateParseMixin';
import {
  parseDaterangepickerOption,
  parseDateRange,
  parseQueryDate
} from '../../utils/misc';
import Panel from '../../components/shared/Panel';
import StatusBox from '../../components/shared/StatusBox';

const STATUS_TO_COLOR = {
  SUCCESS: 'green',
  FAILED: 'red',
  UNKNOWNED: 'blue'
};
export default {
  components: { Panel, StatusBox },
  mixins: [stateParseMixin],
  data() {
    return {
      queryDate: parseDateRange('last week', false)()
    };
  },
  filters: {
    fmtColor(status) {
      return STATUS_TO_COLOR[status];
    },
    fmtLocalTime(utc) {
      return fmt.formatDate(utc);
    }
  },
  computed: {
    ...mapState('log', { state: 'logs' }),
    logs() {
      if (this.isFulfill) {
        return this.state.payload.data.data;
      }
      return [];
    },
    total() {
      if (this.isFulfill) {
        return this.state.payload.data.total;
      }
      return 0;
    },
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
    isEmpty() {
      const { logs } = this;
      return !_.isArray(logs) || logs.length <= 0;
    },
    querySize() {
      return 50;
    },
    pageIndex() {
      const {
        query: { page }
      } = this.$route;
      const cvIndex = +page;
      if (_.isNumber(cvIndex) && !_.isNaN(cvIndex) && cvIndex > 0) {
        return cvIndex;
      }
      return 1;
    }
  },
  methods: {
    ...mapActions('log', ['getLogs']),
    load() {
      const {
        pageIndex,
        querySize,
        queryDate: [startTime, endTime]
      } = this;
      // 取结束时间的 0:0:0, 调用接口时，增加一天
      const formatEndTime = moment([
        endTime.getFullYear(),
        endTime.getMonth(),
        endTime.getDate(),
        0,
        0,
        0
      ]);
      const queryDate = parseQueryDate(startTime, formatEndTime);
      const queryTime = {
        start_time: queryDate.from,
        end_time: queryDate.to,
        size: querySize,
        page: pageIndex
      };
      this.getLogs(queryTime);
    },
    loadOtherPage(pageIndex) {
      const { query } = this.$route;
      this.$router.replace({ query: { ...query, page: pageIndex } });
      this.load();
    }
  },
  mounted() {
    this.load();
  },
  watch: {
    queryDate: {
      deep: true,
      handler() {
        this.load();
      }
    }
  }
};
</script>
<style lang='less' type="text/less" scoped>
.page-pagination {
  margin-top: 16px;
  text-align: center;
}
.query-bar {
  font-size: 12px;
}
</style>
