<template>
  <div class="table-wrapper">
    <TableBox :state="state" :default-sort="defaultSort" @sortChange="sortChange">
      <Column prop="trx_sn" align="center" label="交易SN" :width="100" :show-overflow-tooltip="true"	 sortable="custom"></Column>

      <Column prop="cabinet_id" align="center" label="货柜ID" :width="80" sortable="custom"></Column>
      <Column prop="manager_cabinet_id" align="center" label="货柜ManagerID" :min-width="160" sortable="custom"></Column>

      <Column prop="user_id" align="center" label="商户ID" :width="80" sortable="custom"></Column>
      <Column prop="name" align="center" label="客户名" sortable="custom"></Column>

      <Column prop="status" align="center" label="交易状态" :width="120" sortable="custom">
        <template slot-scope="{row}">
          <ElToolTip v-if="row.status === 'exceptional'" class="item" effect="dark" placement="right">
            <div slot="content">
              <div v-for="(error,index) in row.exception_info" :key="index">
                <div>error_code: {{error.error_code}}</div>
                <div>message: {{error.message}}</div>
                <div>stage: {{error.stage}}</div>
                <br v-if="index !== row.exception_info.length - 1">
              </div>
              <div v-if="row.exception_info.length === 0">暂无exception_info</div>
            </div>
            <div class="hover">{{row.status}}</div>
          </ElToolTip>
          <div v-else>
            {{row.status}}
          </div>
        </template>
      </Column>
      <Column prop="type" align="center" label="交易类型" :width="120" sortable="custom"></Column>

      <Column prop="created_at" align="center" label="开始时间" :width="180" sortable="custom">
        <template slot-scope="scope">
          {{scope.row.created_at | fmtLocalTime}}
        </template>
      </Column>
      <Column prop="closed_at" align="center" label="结束时间" :width="180" sortable="custom">
        <template slot-scope="scope">
          {{scope.row.closed_at | fmtLocalTime}}
        </template>
      </Column>
      <Column prop="time_cost" align="center" label="交易时长" :width="90" sortable="custom"></Column>
      <Column prop="report_info" align="center" label="用户反馈">
        <Column prop="report_type" align="center" label="反馈类型" :width="90">
          <template slot-scope="scope">
            <Tooltip :content=getReportErrorLabel(scope.row) max-width="200" placement="left">
              <Tag v-if="getReportType(scope.row)" :color="getReportType(scope.row).tagColor">{{getReportType(scope.row).text}}</Tag>
            </Tooltip>
          </template>
        </Column>
        <Column prop="verify_status" align="center" label="审核状态" :width="90">
          <template slot-scope="scope">
            <Tag v-if="getVerifyStatus(scope.row)" :color="getVerifyStatus(scope.row).tagColor">{{getVerifyStatus(scope.row).text}}</Tag>
          </template>
        </Column>
      </Column>
      <Column align="center" label="操作" :width="100" fixed="right">
        <template slot-scope="scope">
          <DetailLink class="ivu-btn ivu-btn-primary ivu-btn-small" :queryParams="scope.row"></DetailLink>
        </template>
      </Column>
    </TableBox>
  </div>
</template>

<script type="text/ecmascript-6">
import _ from 'lodash';
import { Tooltip } from 'element-ui';
import stateParseMixin from '@/mixins/commonStateParseMixin';
import StatusBox from '@/components/shared/StatusBox';
import TableBox from '@/components/shared/TableBox';
import { reportType, tags, verifyStatus } from '@/const/data/transactionReport';
import DetailLink from './TransactionsDetailsLink';

export default {
  props: ['state', 'sortChange', 'defaultSort'],
  components: { StatusBox, DetailLink, ElToolTip: Tooltip, TableBox },
  mixins: [stateParseMixin],
  data() {
    return {
      realLimit: this.pageLimit
    };
  },
  methods: {
    getReportType(row) {
      return _.has(row, 'report_info')
        ? reportType[row.report_info.report_type]
        : null;
    },
    getVerifyStatus(row) {
      return _.has(row, 'report_info')
        ? verifyStatus[row.report_info.verify_status]
        : null;
    },
    getReportErrorLabel(row) {
      if (_.has(row, 'report_info')) {
        if (row.report_info.error_code) {
          const obj = tags.filter(
            t => t.errorCode === Number(row.report_info.error_code)
          )[0];
          if (obj) {
            return obj.label;
          }
        }
      }
      return null;
    }
  }
};
</script>
<style type="text/less" lang="less">
</style>
