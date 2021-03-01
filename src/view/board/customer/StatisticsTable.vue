<template>
  <div class="customer">
    <Table :data="customersData"
           :border="true"
           :fit="true"
           @sort-change="resort"
           :default-sort="defaultSort">
      <Column prop="user_id" align="center" label="商户ID" :width="220" :sortable="sortFunc">
        <template slot-scope="scope">
          <router-link :to="{name:'board-cabinets', query:{keyword: scope.row.user_id}}">
            {{scope.row.user_id}}
          </router-link>
        </template>
      </Column>
      <Column prop="user_type" align="center" label="客户类型" :width="230" :sortable="sortFunc"></Column>
      <Column prop="create_time" align="center" label="创建时间" :width="300" :sortable="sortFunc">
        <template slot-scope="scope">
          {{scope.row.create_time | fmtLocalTime}}
        </template>
      </Column>
      <Column prop="comment" align="center" label="备注" :sortable="sortFunc"></Column>
      <Column align="center" label="操作" :width="100" fixed="right">
        <template slot-scope="scope">
          <Button type="primary" size="small" @click="gotoDetail(scope.row)">查看详情</Button>
        </template>
      </Column>

      <template slot="empty">
        <StatusBox :isFetching="isFetching" :error="error" :isEmpty="isEmpty"></StatusBox>
      </template>
    </Table>

    <CustomerLicenses ref="detailBox"></CustomerLicenses>

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

<script type="text/jsx">
import moment from 'moment';
import stateParseMixin from '../../../mixins/commonStateParseMixin';
import StatusBox from '../../../components/shared/StatusBox';
import CustomerLicenses from './CustomerLicenses';

export default {
  components: { StatusBox, CustomerLicenses },
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
      default: () => ({ prop: 'user_id', order: 'ascending' })
    }
  },
  computed: {
    customersData() {
      if (this.isFulfill) {
        return this.state.payload.data.results;
      }
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
    },
    gotoDetail(scopeRow) {
      this.$refs.detailBox.load(scopeRow);
    }
  }
};
</script>
