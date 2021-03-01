<template>
  <div>
    <TableBox ref="tableBox" :state="state" :default-sort="defaultSort" @sortChange="sortChange" @selection-change="selectionChange" @select="select" @select-all="selectAll">
      <Column type="selection" :selectable="selectable"></Column>
      <Column label="商品ID" align="center" prop="id" sortable="custom"></Column>
      <Column label="商品名称" align="center" prop="name" sortable="custom"></Column>
      <Column label="商品条码" align="center" prop="barcode" sortable="custom"></Column>
      <Column label="包装类型" align="center" prop="package_type" sortable="custom">
        <template slot-scope="{row}">{{row.package_type | getSkuPackageTypes}}</template>
      </Column>
      <Column label="商品类型" align="center" prop="sku_type" sortable="custom">
        <template slot-scope="{row}">{{row.sku_type | getSkuTypes}}</template>
      </Column>
      <Column label="商品性质" align="center" prop="barcode_type" sortable="custom">
        <template slot-scope="{row}">{{row.barcode_type | getSkuBarcodeTypes}}</template>
      </Column>
      <Column label="商品样例图" align="center" :width="100">
        <template slot-scope="{ row }">
          <a v-if="row.url" :href="row.url" target="_blank">
            <LazyloadImg class="thumb" :src="row.url"></LazyloadImg>
          </a>
          <span v-else>暂无</span>
        </template>
      </Column>
    </TableBox>
  </div>
</template>

<script>
import _ from 'lodash';
import { mapGetters } from 'vuex';
import StatusBox from '../../../components/shared/StatusBox';
import TableBox from '../../../components/shared/TableBox';
import LazyloadImg from '../../../components/shared/LazyloadImg';

export default {
  props: ['state', 'sortChange', 'defaultSort', 'skus'],
  components: { StatusBox, TableBox, LazyloadImg },
  computed: {
    ...mapGetters('skuBundle', { selectedSkus: 'skus' })
  },
  methods: {
    selectable(row) {
      return _.findIndex(this.skus, ['id', row.id]) === -1;
    },
    selectionChange(value) {
      this.$emit('selection-change', value);
    },
    select(val, row) {
      this.$emit('select', { name: 'single', selections: val, row });
    },
    selectAll(val) {
      this.$emit('select', { name: 'all', selections: val });
    }
  }
};
</script>
