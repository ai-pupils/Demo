<template lang="pug">
  div
    Button(type='primary', :loading='isFetching', html-type='submit', style="float: right;margin-bottom: 10px",
    @click.prevent='createBundle') 创建商品组
    TableBox.clear(:state='state', ref='tableBox' :dataKey="'bundles'")
      Column(prop='id', align='center', label='商品组ID')
        template(slot-scope='{row}')
          router-link(:to="'/v2/sku-bundle/list?pageIndex=1&keyword='+ row.id") {{row.id}}
      Column(prop='name', align='center', label='商品组名称')
        template(slot-scope='{row}')
          router-link(:to="'/v2/sku-bundle/list?pageIndex=1&keyword='+ row.name") {{row.name}}
      Column(prop='sku_count', align='center', label='商品数')
      Column(prop='description', align='center', label='商品组描述')
      Column(align='center', label='操作')
        template(slot-scope='scope')
          div(v-if="cabinet.bundle_id !== scope.row.id")
            Button(type='primary', :loading='isFetching', @click.prevent='updateBundle(scope.row, cabinet.status)', html-type='submit') {{cabinet.status === 'authorized' ? '点击关联': '点击更换'}}
          div(v-else)
            Button(type='primary', :loading='isFetching', disabled=true, html-type='submit') 点击更换
    PaginationInnerBox(:total="dataTotal", :isFetching="isFetching", :pageSizeParams=10, @pageChange="pageChange", @sizeChange="pageChange")
</template>
<script lang="ts">
import Component, {mixins} from "vue-class-component";
import {Inject, Prop} from 'vue-property-decorator';
import LoadPageMixin, {LoadPageMixinInstance} from "@/mixins/loadPage";
import TableBox from '@/components/shared/TableBox.vue';
import { baseInnerListMixin } from '@/mixins/commonListViewMixin';
import { updateBundle$ } from '@/api/cabinet';
import PaginationInnerBox from '@/components/shared/PaginationInnerBox.vue';
import { getSkuBundlesV2$, GetSkuBundlesV2Params } from '@/api/sku-bundle';
import {refreshCabinetBundle$} from "@/api/cabinet";
import { skuBundleReviewedStatus } from '@/const/data/sku-bundle';

@Component({
  components: { PaginationInnerBox, TableBox }
})
export default class BindSkuBundleTable extends mixins(LoadPageMixin)
  implements LoadPageMixinInstance {
  @Prop() cabinet!: any;
  bundles: any = undefined;
  bundleStatus = skuBundleReviewedStatus;
  
  defaultApi: any = getSkuBundlesV2$;
  defaultParams: GetSkuBundlesV2Params = {
    pageIndex: 1,
    pageSize: 10,
    dealerId: this.cabinet.dealer_id,
    cabinetTypeId: this.cabinet.cabinet_type_id,
    status: this.bundleStatus.approval.id,
  };

  createBundle() {
    this.$router.push({ name: 'v2-sku-bundle-create', params: {cabinet: this.cabinet} });
  }

  updateBundle(row: any, cabinetStatus: string) {
    const modalText =
      cabinetStatus === 'authorized'
        ? `确定绑定商品组(${row.id})？`
        : `确定更换商品组为(${row.id})？`;
    this.$Modal.confirm({
      title: '确认',
      content: modalText,
      onOk: () => {
        updateBundle$({bundleId: row.id, id: this.cabinet.id, dealerId: this.cabinet.dealer_id }).subscribe(
          res => {
            if(res.isFulfill && res.payload) {
              this.$Message.success('绑定成功!');
              // 广播，更新数据
              refreshCabinetBundle$.next();
              this.$emit('hide');
            }
          }
        );
      }
    });
  }
  transformParams(params: any) {
    params.pageSize = 10;
    params.keyword = undefined;
    return {...params};
  }

  pageChange(page: any) {
    this.loadDefaultApi({ ...page });
  }
}
</script>
<style lang="scss" scoped>
.clear {
  clear: both;
  overflow: hidden;
}
</style>
