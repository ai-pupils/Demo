<template lang="pug">
  .confirm-page
    Row(:gutter='10')
      Col(:md="24" :lg="12" :style="{marginBottom: '10px'}")
        div
          // <p slot="title">开门前快照</p>
          template(v-if='hasOrigin')
            a.origin-link(:href='startOrigin', target='_blank')
              i.fa.fa-picture-o(aria-hidden='true')
              | 抗畸变前原图
          DetectByLayer(:target='startSnapshot', :isLoading='isEmpty', :report='startDetectResultCurrentShow', :hoverPuid='hoverPuid', :auxLineY='auxLineY', :total='startLayerTotal', @setPuid='hoverPuidHandle', @auxLineHandle='auxLineHandle')
      Col(:md="24" :lg="12" :style="{marginBottom: '10px'}")
        div
          // <p slot="title">关门后快照</p>
          template(v-if='hasOrigin')
            a.origin-link(:href='endOrigin', target='_blank')
              i.fa.fa-picture-o(aria-hidden='true')
              | 抗畸变前原图
          DetectByLayer(:target='endSnapshot', :isLoading='isEmpty', :report='endDetectResultCurrentShow', :hoverPuid='hoverPuid', :auxLineY='auxLineY', :total='endLayerTotal', @setPuid='hoverPuidHandle', @auxLineHandle='auxLineHandle')
    Card
      p(slot='title') 交易前后库存对比 - 第{{layerIndex}}层
      Table.confirm-table(ref='table', :data='skuInfo', :border='true', style='min-height: 200px', max-height='285', :fit='true', highlight-current-row, @cell-mouse-enter='overInBlock', @cell-mouse-leave='overOutBlock')
        Column(prop='layer_index', align='center', label='层序', :width='100')
        Column(prop='sku_id', align='center', label='SKU ID', :width='100')
        Column(prop='name', align='center', label='名称')
        Column(prop='start_count', align='center', label='开门前数量', :width='120')
        Column(prop='end_count', align='center', label='关门后数量', :width='120')
        Column(prop='diff_count', align='center', label='交易数量', :width='120')
          template(slot-scope='scope')
            span(:class='{hasDiff: (scope.row.diff_count !== 0)}')
              | {{scope.row.diff_count}}
        Column(align='center', :render-header='renderRawDetectResult', v-if='hybridEnabled')
          Column(prop='raw_end_count', align='center', label='关门后数量', :width='120')
          Column(prop='raw_diff_count', align='center', label='交易数量', :width='120')
            template(slot-scope='scope')
              span(:class='{hasDiff: (scope.row.raw_diff_count !== 0)}')
                | {{scope.row.raw_diff_count}}
              icon(v-if='scope.row.raw_diff_count !== scope.row.diff_count', type='md-close-circle', color='red')
        Column(prop='barcode', align='center', label='Barcode')
        template(slot='empty')
          StatusBox(:isfetching='isFetching', :error='error', :isempty='isEmpty')
</template>

<script lang="ts">
import _ from 'lodash';
import Component, { mixins } from 'vue-class-component';
import { Watch } from 'vue-property-decorator';
import LazyloadImg from '@/components/shared/LazyloadImg.vue';
import StatusBox from '@/components/shared/StatusBox.vue';
import DetectByLayer from './DetectByLayer.vue';
import { CreateElement, VNodeChildren } from 'vue';
import { ElTable } from 'element-ui/types/table';
import { Getter } from 'vuex-class';
import TransactionDetailsParseMixin from '@/view/transaction/detailsParseMixin';

@Component({
  components: { LazyloadImg, DetectByLayer, StatusBox }
})
export default class Confirm extends mixins(TransactionDetailsParseMixin) {
  @Getter('transaction/transactionDetails') transactionDetails!: any;
  @Watch('transactionDetails', { immediate: true })
  transactionDetailsChange(data: any) {
    this.state = data;
  }

  hovering: boolean = false;
  startDetectResultOfSku: any[] = [];
  endDetectResultOfSku: any[] = [];
  hoverPuid: string = '';
  auxLineY: number = -1;
  startLayerTotal: number = 0;
  endLayerTotal: number = 0;

  get layerIndex(): any {
    return _.get(this.$route.query, 'layerIndex', 1);
  }

  get skuInfo() {
    return this.isEmpty
      ? null
      : this.detailInfo.sku_info.filter(
          (item: any) => item.layer_index === parseInt(this.layerIndex, 10)
        );
  }

  get layerInfo(): any {
    return this.isEmpty
      ? null
      : this.detailInfo.layer_info.filter(
          (item: any) => item.layer_index === parseInt(this.layerIndex, 10)
        )[0];
  }

  get startSnapshot(): any {
    return this.isEmpty || !_.has(this.layerInfo, 'start_image')
      ? null
      : this.layerInfo.start_image;
  }

  get endSnapshot(): any {
    return this.isEmpty || !_.has(this.layerInfo, 'end_image')
      ? null
      : this.layerInfo.end_image;
  }

  get startDetectResult(): any {
    return this.isEmpty || !_.has(this.layerInfo, 'start_detect_result')
      ? null
      : this.layerInfo.start_detect_result.boxes_detected;
  }

  get endDetectResult(): any {
    return this.isEmpty || !_.has(this.layerInfo, 'end_detect_result')
      ? null
      : this.layerInfo.end_detect_result.boxes_detected;
  }

  get startDetectResultCurrentShow(): any {
    this.startLayerTotal =
      this.startDetectResult && this.startDetectResult.length;
    return this.hovering ? this.startDetectResultOfSku : this.startDetectResult;
  }

  get endDetectResultCurrentShow(): any {
    this.endLayerTotal = this.endDetectResult && this.endDetectResult.length;
    return this.hovering ? this.endDetectResultOfSku : this.endDetectResult;
  }

  get hasOrigin(): any {
    return this.isEmpty ? false : this.detailInfo.is_distorted;
  }

  get startOrigin(): any {
    return this.isEmpty || !_.has(this.layerInfo, 'distorted_start_image')
      ? null
      : this.layerInfo.distorted_start_image;
  }

  get endOrigin(): any {
    return this.isEmpty || !_.has(this.layerInfo, 'distorted_end_image')
      ? null
      : this.layerInfo.distorted_end_image;
  }

  get rawDetectResultMatchedIcon(): any {
    if (!this.hybridEnabled) {
      return null;
    }
    return this.hybridMatchedCurrentLayer
      ? ['md-checkmark-circle', 'green']
      : ['md-close-circle', 'red'];
  }

  get hybridEnabled(): any {
    // return this.isEmpty ? false : this.detailInfo.hybrid_enabled;
    return true;
  }

  get hybridMatchedCurrentLayer(): any {
    return this.isEmpty || !_.has(this.layerInfo, 'hybrid_matched')
      ? true
      : this.layerInfo.hybrid_matched;
  }

  overInBlock(row: any) {
    this.startDetectResultOfSku = row.start_detect_result;
    this.endDetectResultOfSku = row.end_detect_result;
    this.hovering = true;
    this.hoverPuid = row.sku_id;
    this.setCurrentRow(null);
  }

  overOutBlock() {
    this.hovering = false;
    this.hoverPuid = '';
    this.setCurrentRow(null);
  }

  renderRawDetectResult(h: CreateElement) {
    return h('span', [
      h('Strong', 'Detector原始结果 '),
      h('Icon', {
        props: {
          type: this.rawDetectResultMatchedIcon[0],
          color: this.rawDetectResultMatchedIcon[1]
        }
      })
    ] as VNodeChildren);
  }

  hoverPuidHandle(puid: any) {
    this.hoverPuid = puid;
    const currentRow = this.skuInfo.filter(
      (row: any) => row.sku_id === puid
    )[0];
    this.setCurrentRow(currentRow);
  }

  setCurrentRow(row: any) {
    (this.$refs.table as ElTable).setCurrentRow(row);
  }

  auxLineHandle(val: any) {
    this.auxLineY = val;
  }
}
</script>

<style type="text/less" lang="less">
.confirm-page {
  position: relative;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  & .el-table__empty-block {
    width: auto;
    min-height: 70px;
  }
}
.hasDiff {
  color: red;
}
.origin-link {
  position: absolute;
  top: 13px;
  right: 20px;
}
</style>
