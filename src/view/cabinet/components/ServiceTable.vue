<template>
  <div>
    <TableBox :state="state$" ref="tableBox">
      <Column prop="id" align="center" label="服务ID">
        <template slot-scope="{row}">
          <router-link :to="'/service/list?pageIndex=1&keyword='+ row.id">{{row.id}}</router-link>
        </template>
      </Column>
      <Column prop="name" align="center" label="服务名称"></Column>
      <Column prop="desc" align="center" label="服务描述"></Column>
      <Column prop="bundle_name" align="center" label="商品组名称">
        <template slot-scope="{row}">
          <router-link :to="'/sku-bundle/list?pageIndex=1&keyword='+ row.bundle_name">{{row.bundle_name}}</router-link>
        </template>
      </Column>
      <Column align="center" label="服务状态">
        <template slot-scope="scope">{{scope.row.status | getModelServiceTypes}}</template>
      </Column>
      <Column align="center" label="操作">
        <template slot-scope="scope">
          <div
            v-if="(!cabinet.binding_service || scope.row.id != cabinet.binding_service.id) && scope.row.status == 'ready'"
          >
            <Button
              type="primary"
              :loading="isFetching"
              @click.prevent="updateService(scope.row, cabinet.status)"
              html-type="submit"
            >{{cabinet.status === 'authorized' ? '点击关联': '点击更换'}}</Button>
          </div>
        </template>
      </Column>
    </TableBox>
    <PaginationInnerBox :total="total$" v-stream:sizeChange="sizeChange$" v-stream:pageChange="pageChange$"></PaginationInnerBox>
  </div>
</template>
<script>
import TableBox from '../../../components/shared/TableBox';
import { baseInnerListMixin } from '@/mixins/commonListViewMixin';
import { getModels$ } from '@/api/models';
import { updateCabinet$ } from '@/api/cabinet';
import PaginationInnerBox from '@/components/shared/PaginationInnerBox';

export default {
  props: ['cabinet'],
  components: { PaginationInnerBox, TableBox },
  mixins: [baseInnerListMixin],
  data() {
    return {
      isFetching: false,
      defaultApi: getModels$,
      defaultParams: {
        cabinetTypeId: this.cabinet.cabinet_type_id,
        dealerId: this.cabinet.dealer_id,
        modelStatus: 'ready'
      },
      data: {}
    };
  },
  methods: {
    updateService(row, cabinetStatus) {
      const modalText =
        cabinetStatus === 'authorized'
          ? `确定关联服务(${row.id})？`
          : `确定更换服务为(${row.id})？`;
      this.$Modal.confirm({
        title: '确认',
        content: modalText,
        onOk: () => {
          this.isFetching = true;
          updateCabinet$({id: this.cabinet.id,modelId: row.id }).subscribe(
            withMetaResponse => {
              if (!withMetaResponse.isError && withMetaResponse.payload) {
                this.$set(
                  this.cabinet,
                  'binding_service',
                  withMetaResponse.payload.data.binding_service
                );
                this.$set(this.cabinet, 'status', 'available');
                this.$Message.success('绑定成功!');
                this.visible = false;
              }
              this.isFetching = false;
            }
          );
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
</style>
