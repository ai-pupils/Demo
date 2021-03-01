<template>
  <div class="demo-box">
    <div class="demo-box-content content-box" v-show="hasQueryImage">
      <Tabs active-name="demo">
        <TabPane label="结果展示" name="demo">
          <DetectAnalysisPane :origin="queryOrigin"
                              :target="queryImage"
                              :isLoading="uploading"
                              :report="detectResult"></DetectAnalysisPane>
        </TabPane>
        <TabPane label="源代码查看" name="response">
          <ResViewCtrl :response="detectResult"
                       :isLoading="uploading"></ResViewCtrl>
        </TabPane>
      </Tabs>
    </div>

    <div class="loading-response-content" v-show="isFetching">
      <Spin :fix="true" size="large"></Spin>
    </div>

    <div class="empty-response-content" v-show="!hasQueryImage">
      <ExceptionPanel status="404" title="Image和DetectResult暂无">
      </ExceptionPanel>
    </div>

  </div>
</template>

<script type="text/ecmascript-6">
import _ from 'lodash';
import { mapGetters } from 'vuex';
import stateParseMixin from '../../../../mixins/commonStateParseMixin';
import transDetailsParseMixin from '../../../../mixins/transactionDetailsParseMixin';
import { Tabs, TabPane } from 'element-ui';
import ExceptionPanel from '../../../../components/shared/Exception';
import ResViewCtrl from './ResponseView';
import DetectAnalysisPane from './DetectBySku';

export default {
  mixins: [stateParseMixin, transDetailsParseMixin],
  components: {
    DetectAnalysisPane,
    ResViewCtrl,
    ExceptionPanel,
    Tabs,
    TabPane
  },
  props: {
    inventoryType: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      uploading: false
    };
  },
  computed: {
    ...mapGetters('transaction', { state: 'transactionDetails' }),
    layerIndex() {
      return _.get(this.$route.query, 'layerIndex', 1);
    },
    layerInfo() {
      return this.isEmpty
        ? null
        : this.data.layer_info.filter(
            item => item.layer_index === parseInt(this.layerIndex, 10)
          )[0];
    },
    queryImage() {
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
    },
    queryOrigin() {
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
    },
    hasQueryImage() {
      return this.isFulfill && !_.isNil(this.queryImage);
    },
    detectResult() {
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
};
</script>

<style type="text/less" lang="less" scoped>
@import (less) '../../../../css/vars.less';

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
