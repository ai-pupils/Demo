<template>
  <div class="table-wrapper">
    <Table class="ingression-table"
           :data="ingressionJobsData"
           :border="true"
           :fit="true"
           @sort-change="resort"
           :sort="defaultSort">
      <Column prop="sku_info" align="center" label="SKU">
        <Column prop="appearance_id" label="包装ID" align="center">
          <template slot-scope="{row}">
            {{row.appearance_id | emptyText}}
          </template>
        </Column>
        <Column prop="appearance_name" label="包装名称" align="center">
          <template slot-scope="{row}">
            {{row.appearance_name | emptyText}}
          </template>
        </Column>
        <Column prop="sku_id" align="center" label="SKU ID" :width="100" :sortable="sortFunc"></Column>
        <Column prop="sku_name" align="center" label="SKU名称" :min-width="200" :sortable="sortFunc"></Column>
        <Column prop="barcode" align="center" label="Barcode" :width="150" :sortable="sortFunc"></Column>
      </Column>
      <Column prop="cabinet_type_info" align="center" label="货柜">
        <Column prop="cabinet_type_id" align="center" label="货柜类型ID" :width="130" :sortable="sortFunc"></Column>
        <Column prop="cabinet_type_name" align="center" label="货柜类型" :width="120" :sortable="sortFunc"></Column>
      </Column>
      <Column prop="instruction_info" align="center" label="图片位">
        <Column prop="instruction_id" align="center" label="图片位ID" :width="100" :sortable="sortFunc"></Column>
        <Column prop="package_type" align="center" label="包装类型" :width="100" :sortable="sortFunc">
          <template slot-scope="scope">
            <Tag>{{getPackageType(scope.row.package_type).label}}</Tag>
          </template>
        </Column>
        <Column prop="package_type" align="center" label="商品类型" :width="100" :sortable="sortFunc">
          <template slot-scope="scope">
            <Tag>{{getSkuTypeLabel(scope.row.sku_type)}}</Tag>
          </template>
        </Column>
      </Column>
      <Column prop="job_status" align="center" label="任务状态" :width="120" :sortable="sortFunc">
        <template slot-scope="scope">
          <Tag :color="getReviewedStatus(scope.row.job_status).tagColor">
            {{getReviewedStatus(scope.row.job_status).label}}
          </Tag>
        </template>
      </Column>
      <Column label="商品样例图" align="center" :width="100">
        <template slot-scope="{ row }">
          <a v-if="row.sku_image" :href="row.sku_image" target="_blank">
              <LazyloadImg class="thumb" :src="row.sku_image"></LazyloadImg>
          </a>
          <span v-else>暂无</span>
          </template>
      </Column>
      <Column align="center" label="操作" width="120">
        <template slot-scope="scope">
          <Button type="primary" size="small" @click="gotoDetail(scope.row, scope.$index)">查看详情</Button>
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

    <IngressionVerify ref="verifyBox" @exit="verifyExit" @next="nextJob"></IngressionVerify>
  </div>
</template>

<script type="text/ecmascript-6">
import _ from 'lodash';
import stateParseMixin from '../../../mixins/commonStateParseMixin';
import StatusBox from '../../../components/shared/StatusBox';
import { reviewedStatus } from '../../../const/data/skuIngression';
import { SkuPackageTypes } from '../../../const/data/sku';
import IngressionVerify from './Verify';
import LazyloadImg from '../../../components/shared/LazyloadImg';
import { getSkuTypeLabel } from '../../../store/api/sku';

export default {
  components: { StatusBox, IngressionVerify, LazyloadImg },
  mixins: [stateParseMixin],
  data() {
    return {
      realLimit: this.pageLimit,
      packageType: SkuPackageTypes,
      reviewedStatus,
      currentVerifyIndex: null
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
    ingressionJobsData() {
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
    getSkuTypeLabel,
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
    getPackageType(value) {
      return this.packageType.filter(item => item.id === value)[0];
    },
    getReviewedStatus(value) {
      return this.reviewedStatus.filter(item => item.value === value)[0];
    },
    gotoDetail(scopeRow, index) {
      this.currentVerifyIndex = index;
      this.$refs.verifyBox.load(scopeRow, index);
    },
    verifyExit() {
      this.$emit('reload');
    },
    nextJob({ offset, isExit }) {
      let index = this.currentVerifyIndex;
      index += offset;
      if (index < this.ingressionJobsData.length && index > -1) {
        this.$refs.verifyBox.load(this.ingressionJobsData[index], index);
        this.currentVerifyIndex = index;
      } else {
        this.$Message.warning('没有发现新的审核任务！');
        if (isExit) {
          this.$refs.verifyBox.exit();
        }
      }
    }
  }
};
</script>
<style type="text/less" lang="less">
.ingression-table .el-table_1_column_8 {
  cursor: default;
}
</style>
