<template>
<div>
  <Table
      :data="skusData"
      :border="true"
      :fit="true"
      @sort-change="resort"
      :sort="defaultSort">
        <Column label="商品ID" align="center" :width="100" prop="id" :sortable="sortFunc()"></Column>
        <Column label="商品名称" align="center"  :min-width="180" prop="name" :sortable="sortFunc()"></Column>
        <Column label="商品条码" align="center" :width="150" prop="barcode" :sortable="sortFunc()"></Column>
        <Column label="商品性质" align="center" :width="130" :sortable="sortFunc()">
          <template slot-scope="{row}">
              {{getBarcodeTypeLabel(row.barcode_type)}}
          </template>
        </Column>
        <Column label="包装类型" align="center" :width="100" :sortable="sortFunc()">
            <template slot-scope="{row}">
                {{getPackageTypeLabel(row.package_type)}}
            </template>
        </Column>
        <Column label="商品类型" align="center" :width="100">
            <template slot-scope="{row}">
                {{getSkuTypeLabel(row.sku_type)}}
            </template>
        </Column>
        <Column label="注册商ID" align="center" :width="100"  prop="creator_id" :sortable="sortFunc()"></Column>
        <Column label="商品状态" align="center" :width="100"  prop="status" :sortable="sortFunc()">
            <template slot-scope="{row}">
                {{getStatusLabel(row.status)}}
            </template>
        </Column>
        <Column label="上新状态" align="center" :width="100" >
          <template slot-scope="{row}">
              <span v-if="row.ingression_status.length === 0 || !row.ingression_status">暂无上新</span>
              <Button v-else type="primary" size="small" @click="viewRowIngressionStatus(row)">查看({{row.ingression_status.length}})</Button>
          </template>
        </Column>
        <Column label="商品重量（g）" align="center" :width="150" prop="weight" :sortable="sortFunc()"></Column>
        <Column label="商品样例图" align="center" :width="100">
          <template slot-scope="{ row }">
            <a v-if="row.url" :href="row.url" target="_blank">
                <img class="thumb" :src="row.url">
            </a>
            <span v-else>暂无</span>
          </template>
        </Column>
        <Column label="注册时间" align="center" :width="170" :sortable="sortFunc()">
          <template slot-scope="{row}">
              {{row.created_at | fmtLocalTime}}
          </template>
        </Column>
        <Column label="操作" align="center" :width="130" fixed="right">
          <template slot-scope="{ row }">
            <Button type="primary" size="small" @click="gotoUpdate(row)">编辑</Button>
            <Button v-if="row.status === 'offline'" type="success" size="small" @click="updateStatus(row)" disabled>启用</Button>
            <Button v-if="row.status === 'available'" type="error" size="small" @click="updateStatus(row)" disabled>暂停</Button>
          </template>
        </Column>
         <template slot="empty">
            <StatusBox :isFetching="isFetching" :error="error" :isEmpty="isEmpty"></StatusBox>
         </template>
    </Table>
    <Modal
        :styles="{ width: '800px'}"
        v-model="showIngressionModal"
        :footer-hide="true"
        title="上新状态">
        <Table :data="rowIngressionData" border>
          <Column label="货柜类型ID" align="center"  prop="cabinet_type_id"></Column>
          <Column label="货柜类型名称" align="center"  prop="cabinet_type_name"></Column>
          <Column label="商品ID" align="center"  prop="sku_id"></Column>
          <Column label="商品名称" align="center"  prop="sku_name"></Column>
          <Column label="商品上新状态" align="center" >
            <template slot-scope="{ row }">
              {{getIngeressionStatusLabel(row.sku_ingression_status)}}
            </template>
          </Column>
        </Table>
    </Modal>
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

<script>
import _ from 'lodash';
import StatusBox from '../../components/shared/StatusBox';
import stateParseMixin from '../../mixins/commonStateParseMixin';
import {
  getSkuPackageTypeLabel,
  getSkuBarcodeTypeLabel,
  getSkuStatusLabel,
  getSkuIngeressionStatusLabel,
  updateSkuStatus,
  getSkuTypeLabel
} from '../../store/api/sku';

export default {
  components: { StatusBox },
  mixins: [stateParseMixin],
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
  data() {
    return {
      realLimit: this.pageLimit,
      showIngressionModal: false,
      rowIngressionData: []
    };
  },
  computed: {
    skusData() {
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
    isEmpty() {
      const { data } = this;
      return !_.isArray(data) || data.length <= 0;
    }
  },
  methods: {
    updateStatus(item) {
      const isAvailable = item.status === 'available';

      this.$Modal.confirm({
        title: `${
          isAvailable ? '是否更改为暂停状态？' : '是否更改为启用状态？'
        }`,
        onOk: () => {
          updateSkuStatus(item.id, isAvailable ? 'offline' : 'available').then(
            ({ status }) => {
              if (status === 0) {
                this.$emit('refresh');
                this.$Message.success({ content: '状态更新成功' });
              }
            }
          );
        },
        onCancel: () => {
          this.$Modal.remove();
        }
      });
    },
    sortFunc() {
      const { hasPagination } = this;
      return hasPagination ? 'custom' : true;
    },
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
    viewRowIngressionStatus(row) {
      this.showIngressionModal = true;
      this.rowIngressionData = row.ingression_status;
    },
    gotoUpdate({ id }) {
      this.$router.push(`/sku/update/${id}`);
    },
    getPackageTypeLabel(packageType) {
      return getSkuPackageTypeLabel(packageType);
    },
    getBarcodeTypeLabel(barcodeType) {
      return getSkuBarcodeTypeLabel(barcodeType);
    },
    getStatusLabel(status) {
      return getSkuStatusLabel(status);
    },
    getSkuTypeLabel(status) {
      return getSkuTypeLabel(status);
    },
    getIngeressionStatusLabel(status) {
      return getSkuIngeressionStatusLabel(status);
    }
  }
};
</script>

<style lang="less" scoped>
.thumb {
  height: 45px;
  vertical-align: middle;
  margin: 5px;
}
</style>
