<template>
  <div class="confirm-page">
    <Row :gutter="10">
      <Col :md="24" :lg="12" :style="{marginBottom: '10px'}">
        <div>
          <!-- <p slot="title">开门前快照</p> -->
          <template v-if="hasOrigin">
            <a class="origin-link" :href="startOrigin" target="_blank">
              <i class="fa fa-picture-o" aria-hidden="true"></i>
              抗畸变前原图
            </a>
          </template>
          <DetectByLayer :target="startSnapshot"
                         :isLoading="isEmpty"
                         :report="startDetectResultCurrentShow"
                         :hoverPuid="hoverPuid"
                         :auxLineY="auxLineY"
                         :total="startLayerTotal"
                         @setPuid="hoverPuidHandle"
                         @auxLineHandle="auxLineHandle"></DetectByLayer>
        </div>
      </Col>
      <Col :md="24" :lg="12" :style="{marginBottom: '10px'}">
        <div>
          <!-- <p slot="title">关门后快照</p> -->
          <template v-if="hasOrigin">
            <a class="origin-link" :href="endOrigin" target="_blank">
              <i class="fa fa-picture-o" aria-hidden="true"></i>
              抗畸变前原图
            </a>
          </template>
          <DetectByLayer :target="endSnapshot"
                         :isLoading="isEmpty"
                         :report="endDetectResultCurrentShow"
                         :hoverPuid="hoverPuid"
                         :auxLineY="auxLineY"
                         :total="endLayerTotal"
                         @setPuid="hoverPuidHandle"
                         @auxLineHandle="auxLineHandle"></DetectByLayer>
        </div>
      </Col>
    </Row>
    <Card>
      <p slot="title">交易前后库存对比 - 第{{layerIndex}}层</p>
      <Table class="confirm-table"
             ref="table"
             :data="skuInfo"
             :border="true"
             max-height="285"
             :fit="true"
             highlight-current-row
             @cell-mouse-enter="overInBlock"
             @cell-mouse-leave="overOutBlock">
        <Column prop="layer_index" align="center" label="层序" :width="100"></Column>
        <Column prop="sku_id" align="center" label="SKU ID" :width="100"></Column>
        <Column prop="name" align="center" label="名称"></Column>
        <Column prop="start_count" align="center" label="开门前数量" :width="120"></Column>
        <Column prop="end_count" align="center" label="关门后数量" :width="120"></Column>
        <Column prop="diff_count" align="center" label="交易数量" :width="120">
          <template slot-scope="scope">
            <span :class="{hasDiff: (scope.row.diff_count !== 0)}">
              {{scope.row.diff_count}}
            </span>
          </template>
        </Column>
        <Column align="center" :render-header="renderRawDetectResult" v-if="hybridEnabled">
          <Column prop="raw_end_count" align="center" label="关门后数量" :width="120"></Column>
          <Column prop="raw_diff_count" align="center" label="交易数量" :width="120">
            <template slot-scope="scope">
              <span :class="{hasDiff: (scope.row.raw_diff_count !== 0)}">
                {{scope.row.raw_diff_count}}
              </span>
              <Icon v-if="scope.row.raw_diff_count !== scope.row.diff_count"
                    type="md-close-circle" color="red"/>
            </template>
          </Column>
        </Column>
        <Column prop="barcode" align="center" label="Bar Code"></Column>
        <template slot="empty">
          <StatusBox :isFetching="isFetching" :error="error" :isEmpty="isEmpty"></StatusBox>
        </template>
      </Table>
    </Card>
  </div>
</template>

<script type="text/ecmascript-6">
import _ from 'lodash';
import { mapGetters } from 'vuex';
import stateParseMixin from '../../../../mixins/commonStateParseMixin';
import transDetailsParseMixin from '../../../../mixins/transactionDetailsParseMixin';
import LazyloadImg from '../../../../components/shared/LazyloadImg';
import StatusBox from '../../../../components/shared/StatusBox';
import DetectByLayer from './DetectByLayer';

export default {
  mixins: [stateParseMixin, transDetailsParseMixin],
  components: { LazyloadImg, DetectByLayer, StatusBox },
  data() {
    return {
      hovering: false,
      startDetectResultOfSku: [],
      endDetectResultOfSku: [],
      hoverPuid: '',
      auxLineY: -1,
      startLayerTotal: 0,
      endLayerTotal: 0
    };
  },
  computed: {
    ...mapGetters('transaction', { state: 'transactionDetails' }),
    layerIndex() {
      return _.get(this.$route.query, 'layerIndex', 1);
    },
    skuInfo() {
      return this.isEmpty
        ? null
        : this.data.sku_info.filter(
            item => item.layer_index === parseInt(this.layerIndex, 10)
          );
    },
    layerInfo() {
      return this.isEmpty
        ? null
        : this.data.layer_info.filter(
            item => item.layer_index === parseInt(this.layerIndex, 10)
          )[0];
    },
    startSnapshot() {
      return this.isEmpty || !_.has(this.layerInfo, 'start_image')
        ? null
        : this.layerInfo.start_image;
    },
    endSnapshot() {
      return this.isEmpty || !_.has(this.layerInfo, 'end_image')
        ? null
        : this.layerInfo.end_image;
    },
    startDetectResult() {
      return this.isEmpty || !_.has(this.layerInfo, 'start_detect_result')
        ? null
        : this.layerInfo.start_detect_result.boxes_detected;
    },
    endDetectResult() {
      return this.isEmpty || !_.has(this.layerInfo, 'end_detect_result')
        ? null
        : this.layerInfo.end_detect_result.boxes_detected;
    },
    startDetectResultCurrentShow() {
      this.startLayerTotal =
        this.startDetectResult && this.startDetectResult.length;
      return this.hovering
        ? this.startDetectResultOfSku
        : this.startDetectResult;
    },
    endDetectResultCurrentShow() {
      this.endLayerTotal = this.endDetectResult && this.endDetectResult.length;
      return this.hovering ? this.endDetectResultOfSku : this.endDetectResult;
    },
    hasOrigin() {
      return this.isEmpty ? false : this.data.is_distorted;
    },
    startOrigin() {
      return this.isEmpty || !_.has(this.layerInfo, 'distorted_start_image')
        ? null
        : this.layerInfo.distorted_start_image;
    },
    endOrigin() {
      return this.isEmpty || !_.has(this.layerInfo, 'distorted_end_image')
        ? null
        : this.layerInfo.distorted_end_image;
    },
    rawDetectResultMatchedIcon() {
      if (!this.hybridEnabled) {
        return null;
      }
      return this.hybridMatchedCurrentLayer
        ? ['md-checkmark-circle', 'green']
        : ['md-close-circle', 'red'];
    },
    hybridEnabled() {
      return this.isEmpty ? false : this.data.hybrid_enabled;
    },
    hybridMatchedCurrentLayer() {
      return this.isEmpty || !_.has(this.layerInfo, 'hybrid_matched')
        ? true
        : this.layerInfo.hybrid_matched;
    }
  },
  methods: {
    overInBlock(row) {
      this.startDetectResultOfSku = row.start_detect_result;
      this.endDetectResultOfSku = row.end_detect_result;
      this.hovering = true;
      this.hoverPuid = row.barcode;
      this.setCurrentRow();
    },
    overOutBlock() {
      this.hovering = false;
      this.hoverPuid = '';
      this.setCurrentRow();
    },
    renderRawDetectResult(h) {
      return h('span', [
        h('Strong', 'Detector原始结果 '),
        h('Icon', {
          props: {
            type: this.rawDetectResultMatchedIcon[0],
            color: this.rawDetectResultMatchedIcon[1]
          }
        })
      ]);
    },
    hoverPuidHandle(puid) {
      this.hoverPuid = puid;
      const currentRow = this.skuInfo.filter(row => row.barcode === puid)[0];
      this.setCurrentRow(currentRow);
    },
    setCurrentRow(row) {
      this.$refs.table.setCurrentRow(row);
    },
    auxLineHandle(val) {
      this.auxLineY = val;
    }
  }
};
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
