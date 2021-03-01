<template>
  <div class="table-wrapper">
    <Table class="cabinet-table"
           :data="cabinetData"
           :border="true"
           :fit="true"
           @sort-change="resort"
           :sort="defaultSort">
      <Column prop="id" align="center" label="货柜ID" :width="100" :sortable="sortFunc"></Column>
      <Column prop="manager_cabinet_id" align="center" label="货柜ManagerID" :min-width="120" :sortable="sortFunc">
        <template slot-scope="scope">
          <router-link :to="{name:'board-transactions', query:{keyword: scope.row.manager_cabinet_id}}">
            {{scope.row.manager_cabinet_id}}
          </router-link>
        </template>
      </Column>

      <Column prop="name" align="center" label="货柜名称" :sortable="sortFunc"></Column>
      <Column prop="desc" align="center" label="货柜描述" :sortable="sortFunc"></Column>
      <Column prop="layer_count" align="center" label="层数" :sortable="sortFunc"></Column>
      <Column prop="dealer_id" align="center" label="商户ID" :sortable="sortFunc"></Column>
      <Column prop="license_id" align="center" label="License ID" :sortable="sortFunc"></Column>
      <Column prop="status" align="center" label="货柜状态" :sortable="sortFunc"></Column>

      <Column prop="bundle_id" align="center" label="模组ID" :width="80" :sortable="sortFunc">
        <template slot-scope="scope">
          <ModuleHistoryList :moduleData="scope.row"></ModuleHistoryList>
        </template>
      </Column>
      <Column prop="create_time" align="center" label="创建时间" :width="180" :sortable="sortFunc">
        <template slot-scope="scope">
          {{scope.row.create_time | fmtLocalTime }}
        </template>
      </Column>
      <Column prop="udpate_time" align="center" label="更新时间" :width="180" :sortable="sortFunc">
        <template slot-scope="scope">
          {{scope.row.udpate_time | fmtLocalTime }}
        </template>
      </Column>

      <template slot="empty">
        <StatusBox :isFetching="isFetching" :error="error" :isEmpty="isEmpty"></StatusBox>
      </template>
    </Table>

    <template v-if="isFulfill">
      <div class="tar" v-if="hasPagination">
        <Page :total="total"
              :current="currentPage"
              :page-size="pageLimit"
              show-total
              show-sizer
              placement="top"
              @on-change="startChange"
              @on-page-size-change="limitChange"></Page>
      </div>
    </template>
  </div>
</template>

<script type="text/ecmascript-6">
import _ from 'lodash';
import stateParseMixin from '../../../mixins/commonStateParseMixin';
import StatusBox from '../../../components/shared/StatusBox';
import ModuleHistoryList from './CabinetModuleHistoryList';

export default {
  components: { StatusBox, ModuleHistoryList },
  mixins: [stateParseMixin],
  data() {
    return {
      realLimit: this.pageLimit
    };
  },
  props: {
    state: { type: Object, required: true, default: true },
    hasPagination: { type: Boolean, required: false, default: true },
    pageIndex: { type: Number, required: false, default: 0 },
    pageLimit: { type: Number, required: false, default: 0 },
    defaultSort: {
      type: Object,
      required: false,
      default: () => ({ prop: 'id', order: 'ascending' })
    }
  },
  computed: {
    cabinetData() {
      if (this.isFulfill) {
        return this.state.payload.data.results;
      }
      return null;
    },
    total() {
      if (this.isFulfill && this.hasPagination) {
        return this.state.payload.data.paging.total;
      }
      return 0;
    },
    currentPage() {
      return this.pageIndex + 1;
    },
    sortFunc() {
      const { hasPagination } = this;
      return hasPagination ? 'custom' : true;
    },
    isEmpty() {
      const { data } = this;
      return !_.isArray(data) || data.length <= 0;
    }
  },
  methods: {
    startChange(pageIndex) {
      this.$emit('change', {
        pageIndex: pageIndex - 1,
        pageLimit: this.realLimit
      });
    },
    limitChange(pageLimit) {
      this.realLimit = pageLimit;
      this.$emit('change', {
        pageIndex: this.pageIndex,
        pageLimit: this.realLimit
      });
    },
    resort({ order, prop }) {
      this.$emit('sortChange', {
        sortBy: [prop, order === 'descending' ? 'down' : 'up']
      });
    }
  }
};
</script>
<style type="text/less" lang="less">
.cabinet-table .el-table_1_column_8 {
  cursor: default;
}
</style>
