<template>
<div>
  <TableBox :state="state" :default-sort="defaultSort" @sortChange="sortChange">
        <Column label="商品组ID" align="center" prop="id" sortable="custom"></Column>
        <Column label="商品组名称" align="center" prop="name" sortable="custom" :min-width="150"></Column>
        <Column label="商品组描述" align="center" prop="description" sortable="custom" :width="150" show-overflow-tooltip></Column>
        <Column label="sku数" align="center" prop="skus">
          <template slot-scope="{row}">
            <a class="hover-pointer" @click="openSkuModal(row)">{{row.skus ? row.skus.length : 0}}</a>
          </template>
        </Column>
        <Column label="关联服务数" align="center" prop="models">
          <template slot-scope="{row}">
            <a class="hover-pointer" @click="openServiceModal(row)">{{row.models ? row.models.length : 0}}</a>
          </template>
        </Column>
        <Column label="商户ID" align="center" prop="dealer_id" sortable="custom"></Column>
        <Column label="创建时间" align="center" prop="create_time" sortable="custom" :width="160">
          <template slot-scope="{row}">
            {{row.create_time | fmtLocalTime}}
          </template>
        </Column>
        <Column label="货柜类型" align="center" prop="cabinet_type_id" sortable="custom">
          <template slot-scope="{row}">
            {{row.cabinet_type_name || '暂无'}}
          </template>
        </Column>
        <Column label="操作" align="center">
          <template slot-scope="{row}">
            <Button type="primary" size="small" @click="goUpdate(row)">编辑</Button>
          </template>
        </Column>
  </TableBox>
    <Modal
        v-model="skuModalVisable"
        title="SKU列表"
        width="60"
        :footer-hide="true">
        <Table
        max-height="550"
        :data="skuModalData"
        :border="true"
        :fit="true">
            <Column label="商品ID" align="center" prop="id"></Column>
            <Column label="商品名称" align="center" prop="name"></Column>
            <Column label="商品条码" align="center" prop="barcode"></Column>
            <Column label="商品性质" align="center" prop="barcode_type">
              <template slot-scope="{row}">
                {{row.barcode_type | getSkuBarcodeTypes}}
              </template>
            </Column>
            <Column label="包装类型" align="center" prop="package_type">
              <template slot-scope="{row}">
                {{row.package_type | getSkuPackageTypes}}
              </template>
            </Column>
            <Column label="商品类型" align="center" prop="sku_types">
              <template slot-scope="{row}">
                {{row.sku_type | getSkuTypes}}
              </template>
            </Column>
        </Table>
    </Modal>

    <Modal
        v-model="serivceModalVisable"
        title="识别服务列表"
        width="60"
        :footer-hide="true">
        <Table
        max-height="550"
        :data="serviceModalData"
        :border="true"
        :fit="true">
            <Column label="服务ID" align="center" prop="id"></Column>
            <Column label="服务名称" align="center" prop="name"></Column>
            <Column label="服务描述" align="center" prop="desc">
              <template slot-scope="{row}">
                {{row.desc || '暂无'}}
              </template>
            </Column>
        </Table>
    </Modal>
</div>

</template>

<script>
import StatusBox from '../../../components/shared/StatusBox';
import TableBox from '../../../components/shared/TableBox';

export default {
  props: ['state', 'sortChange', 'defaultSort'],
  components: { StatusBox, TableBox },
  data() {
    return {
      skuModalVisable: false,
      serivceModalVisable: false,
      skuModalData: [],
      serviceModalData: []
    };
  },
  methods: {
    openSkuModal(item) {
      this.skuModalVisable = true;
      this.skuModalData = item.skus;
    },
    openServiceModal(item) {
      this.serivceModalVisable = true;
      this.serviceModalData = item.models;
    },
    goUpdate(item) {
      this.$router.push(
        `/sku-bundle/update/${item.id}?dealerId=${item.dealer_id}`
      );
    }
  }
};
</script>
