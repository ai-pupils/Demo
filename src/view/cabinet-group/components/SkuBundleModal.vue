<template lang="pug">
  section
    Modal(v-model='visible', :width='1200', :footer-hide='true', @on-cancel="close")
      header(slot='header')
        h3 商品组列表
        TableBox.clear(:state='state', ref='tableBox' :dataKey="'bundles'")
          Column(prop='id', align='center', label='商品组ID')
            template(slot-scope='{row}')
              router-link(:to="{name: 'v2-sku-bundle-list', query:{pageIndex: 1, keyword: row.id}}" target="_blank") {{row.id}}
          Column(prop='name', align='center', label='商品组名称')
            template(slot-scope='{row}')
              router-link(:to="{name: 'v2-sku-bundle-list', query:{pageIndex: 1, keyword: row.name}}", target="_blank") {{row.name}}
          Column(prop='sku_count', align='center', label='商品数')
          Column(prop='description', align='center', label='商品组描述')
          Column(align='center', label='操作')
            template(slot-scope='{row}')
              Button(type='primary', :loading='state.isFetching', html-type='submit', @click="changeBundles(row)") 点击更换
      PaginationInnerBox(ref="PaginationInnerBox", :total="dataTotal", :isFetching="state.isFetching",
        :pageSizeParams=10, @pageChange="pageChange", @sizeChange="pageChange")
</template>

<script lang="ts">
import Vue from 'vue';
import Component, { mixins } from 'vue-class-component';
import LoadPageMixin, { LoadPageMixinInstance } from '@/mixins/loadPage';
import TableBox from '@/components/shared/TableBox.vue';
import PaginationInnerBox from '@/components/shared/PaginationInnerBox.vue';
import { getSkuBundlesV2$, GetSkuBundlesV2Params } from '@/api/sku-bundle';
import { Prop, Watch } from 'vue-property-decorator';
import {createEmptyTrackMeta} from "@/utils/misc";
import { skuBundleReviewedStatus } from '@/const/data/sku-bundle';

@Component({
  components: { PaginationInnerBox, TableBox }
})
export default class SkuBundleModal extends Vue {
  visible = false;
  info: any = undefined;
  state: any = createEmptyTrackMeta();
  dataTotal = 0;
  bundleStatus = skuBundleReviewedStatus;

  getSkuBundles(page: any) {
    getSkuBundlesV2$({
      ...page,
      dealerId: this.info[0].dealer_id,
      visionId: this.info[0].vision_id,
      status: this.bundleStatus.approval.id
    }).subscribe((state: any)=>{
      this.state = state;
      this.dataTotal = state.payload.data.total || 0;
    });
  }

  open(params: any) {
    this.visible = true;
    this.info = params;
    this.getSkuBundles({pageIndex: 1, pageSize: 10});
  }
  close() {
    (this.$refs.PaginationInnerBox as any).init();
    this.visible = false;
  }

  pageChange(page: any) {
    this.getSkuBundles(page);
  }

  changeBundles(row: any) {
    this.$emit('changeBundles', row);
  }
}
</script>

<style scoped></style>
