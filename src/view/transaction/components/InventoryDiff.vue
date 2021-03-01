<template lang="pug">
  .demo-box
    card.block
      p.card-title(slot='title')
        | 交易前后库存对比
        Form.fr
          FormItem(label='只显示差异商品:', :label-width='150')
            i-switch(v-model='isShowDiff')
              span(slot='open') 是
              span(slot='close') 否
      p
      Table(:data='skuInfo', :border='true', :fit='true', max-height='700', :row-class-name='tableRowClassName')
        Column(prop='layer_index', align='center', label='层序', :width='100')
        Column(prop='sku_id', align='center', label='SKU ID', :width='100')
        Column(prop='name', align='center', label='名称', :min-width='120')
        Column(prop='start_count', align='center', label='开门前数量', :width='120')
        Column(prop='end_count', align='center', label='关门后数量', :width='120')
        Column(prop='diff_count', align='center', label='最终交易数量', :width='120')
          template(slot-scope='scope')
            span(:class='{hasDiff: (scope.row.diff_count !== 0)}')
              | {{scope.row.diff_count}}
        Column(align='center', :render-header='renderRawDetectResult', v-if='hybridEnabled')
          Column(prop='raw_start_count', align='center', label='开门前数量', :width='120')
          Column(prop='raw_end_count', align='center', label='关门后数量', :width='120')
          Column(prop='raw_diff_count', align='center', label='交易数量', :width='120')
            template(slot-scope='scope')
              span(:class='{hasDiff: (scope.row.raw_diff_count !== 0)}')
                | {{scope.row.raw_diff_count}}
              Icon(v-if='scope.row.raw_diff_count !== scope.row.diff_count', type='md-close-circle', color='red')
        Column(prop='barcode', align='center', label='Barcode', :width='120')
        template(slot='empty')
          StatusBox(:isfetching='isFetching', :error='error', :isempty='isEmpty || isFilterEmpty')

</template>

<script lang="ts">
import StatusBox from '@/components/shared/StatusBox.vue';
import Component, { mixins } from 'vue-class-component';
import TransactionDetailsParseMixin from '@/view/transaction/detailsParseMixin';
import {Getter} from "vuex-class";
import {Watch} from "vue-property-decorator";

@Component({
  components: { StatusBox }
})
export default class InventoryDiff extends mixins(
  TransactionDetailsParseMixin
) {
  @Getter('transaction/transactionDetails') transactionDetails!: any;
  @Watch('transactionDetails', { immediate: true })
  transactionDetailsChange(data: any) {
    this.state = data;
  }

  isShowDiff: boolean = true;
  isFilterEmpty: boolean = false;

  get skuInfo(): any {
    if (this.isEmpty) return [];
    this.detailInfo.sku_info.forEach((e: any) => {
      e.raw_start_count = e.start_count;
    });
    if (!this.isShowDiff) {
      return this.detailInfo.sku_info;
    }
    const diffCountItems = this.detailInfo.sku_info.filter(
      (e: any) => e.diff_count !== 0 || e.raw_diff_count !== 0
    );
    if (diffCountItems && diffCountItems.length === 0) {
      this.isFilterEmpty = true;
    } else {
      this.isFilterEmpty = false;
    }
    return diffCountItems;
  }

  get hybridEnabled(): boolean {
    // return this.isEmpty ? false : this.detailInfo.hybrid_enabled;
    return true;
  }

  get hybridMatched(): boolean {
    return this.isEmpty ? true : this.detailInfo.hybrid_matched;
  }

  get rawDetectResultMatchedIcon(): string[] | null {
    if (!this.hybridEnabled) {
      return null;
    }
    return this.hybridMatched
      ? ['md-checkmark-circle', 'green']
      : ['md-close-circle', 'red'];
  }

  showAllDiff() {
    this.isShowDiff = !this.isShowDiff;
  }

  tableRowClassName({ row }: any) {
    const layerIndex = row['layer_index'];
    if (layerIndex % 2 === 0) {
      return 'even-layer';
    } else if (layerIndex === 'Total') {
      return 'total-layer';
    }
    return 'odd-layer';
  }

  renderRawDetectResult(h: any): any {
    return h('span', [
      h('Strong', 'Detector原始结果 '),
      h('Icon', {
        props: {
          type: this.rawDetectResultMatchedIcon![0],
          color: this.rawDetectResultMatchedIcon![1]
        }
      })
    ]);
  }
}
</script>

<style type="text/less" lang="less">
.el-table {
  & .even-layer {
    background: #dfefd452;
  }
  & .total-layer {
    background: #eef1f6cc;
  }
  & .hasDiff {
    color: red;
  }
}
.card-title {
  height: 30px !important;
  line-height: 30px !important;
}
</style>
