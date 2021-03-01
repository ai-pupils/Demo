<template lang="pug">
  .demo-box
    .demo-box-content.content-box(v-show='hasQueryImage')
      Tabs(active-name='demo')
        TabPane(label='结果展示', name='demo')
          DetectAnalysisPane(:origin='queryOrigin', :target='queryImage', :isloading='uploading', :report='detectResult')
        TabPane(label='源代码查看', name='response')
          ResViewCtrl(:response='detectResult', :isloading='uploading')
    .loading-response-content(v-show='isFetching')
      Spin(:fix='true', size='large')
    .empty-response-content(v-show='!hasQueryImage')
      ExceptionPanel(status='404', title='Image和DetectResult暂无')
</template>

<script lang="ts">
import _ from 'lodash';
import { Tabs, TabPane } from 'element-ui';
import ExceptionPanel from '@/components/shared/Exception.vue';
import ResViewCtrl from './ResponseView.vue';
import DetectAnalysisPane from './DetectBySku.vue';
import Component, { mixins } from 'vue-class-component';
import TransactionDetailsParseMixin from '@/view/transaction/detailsParseMixin';
import { Prop, Watch } from 'vue-property-decorator';
import { Getter } from 'vuex-class';

@Component({
  components: {
    DetectAnalysisPane,
    ResViewCtrl,
    ExceptionPanel,
    Tabs,
    TabPane
  }
})
export default class Preview extends mixins(TransactionDetailsParseMixin) {
  @Prop({ type: String, required: true })
  inventoryType!: string;
  @Getter('transaction/transactionDetails')
  transactionDetails!: any;
  @Watch('transactionDetails', { immediate: true })
  transactionDetailsChange(data: any) {
    this.state = data;
  }

  uploading: boolean = false;

  get layerIndex(): any {
    return _.get(this.$route.query, 'layerIndex', 1);
  }

  get layerInfo(): any {
    return this.isEmpty
      ? null
      : this.detailInfo.layer_info.filter(
          (item: any) => item.layer_index === parseInt(this.layerIndex, 10)
        )[0];
  }

  get queryImage(): any {
    if (this.isEmpty) {
      return null;
    } else if (
      this.inventoryType === 'start' &&
      _.has(this.layerInfo, 'start_image')
    ) {
      return this.layerInfo.start_image;
    } else if (
      this.inventoryType === 'end' &&
      _.has(this.layerInfo, 'end_image')
    ) {
      return this.layerInfo.end_image;
    }
    return null;
  }

  get queryOrigin(): any {
    if (this.isEmpty) {
      return null;
    } else if (
      this.inventoryType === 'start' &&
      _.has(this.layerInfo, 'distorted_start_image')
    ) {
      return this.layerInfo.distorted_start_image;
    } else if (
      this.inventoryType === 'end' &&
      _.has(this.layerInfo, 'distorted_end_image')
    ) {
      return this.layerInfo.distorted_end_image;
    }
    return null;
  }

  get hasQueryImage(): any {
    return this.isFulfill && !_.isNil(this.queryImage);
  }

  get detectResult(): any {
    if (this.isEmpty) {
      return null;
    } else if (
      this.inventoryType === 'start' &&
      _.has(this.layerInfo, 'start_detect_result')
    ) {
      return this.layerInfo.start_detect_result;
    } else if (
      this.inventoryType === 'end' &&
      _.has(this.layerInfo, 'end_detect_result')
    ) {
      return this.layerInfo.end_detect_result;
    }
    return null;
  }
}
</script>

<style type="text/less" lang="less" scoped>
@import (less) '../../../css/vars.less';

.demo-box {
  @tool-width: 0px;
  position: relative;
  height: 100%;
  &-tool {
    width: @tool-width;
    display: block;
    padding-right: 12px;
    position: relative;
    z-index: 3;
  }
  &-content {
    position: absolute;
    z-index: 2;
    top: 0;
    width: 100%;
    height: 100%;
    left: 0;
    padding-left: @tool-width;
    overflow-y: auto;
  }
}

.empty-response-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
