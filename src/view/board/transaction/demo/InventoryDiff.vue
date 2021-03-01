<template>
  <div class="demo-box">
    <Card class="block" >
      <p class="card-title" slot="title">交易前后库存对比
        <Form class="fr">
          <FormItem label="只显示差异商品:" :label-width="150">
              <i-switch v-model="isShowDiff">
                  <span slot="open">是</span>
                  <span slot="close">否</span>
              </i-switch>
            </FormItem>
        </Form>
      </p>

      <Table :data="skuInfo" :border="true" :fit="true" max-height="700" :row-class-name="tableRowClassName">
        <Column prop="layer_index" align="center" label="层序" :width="100"></Column>
        <Column prop="sku_id" align="center" label="SKU ID" :width="100"></Column>
        <Column prop="name" align="center" label="名称" :min-width="120"></Column>
        <Column prop="start_count" align="center" label="开门前数量" :width="120"></Column>
        <Column prop="end_count" align="center" label="关门后数量" :width="120"></Column>
        <Column prop="diff_count" align="center" label="最终交易数量" :width="120">
          <template slot-scope="scope">
            <span :class="{hasDiff: (scope.row.diff_count !== 0)}">
              {{scope.row.diff_count}}
            </span>
          </template>
        </Column>
        <Column align="center" :render-header="renderRawDetectResult" v-if="hybridEnabled">
          <Column prop="raw_start_count" align="center" label="开门前数量" :width="120"></Column>
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
        <Column prop="barcode" align="center" label="Bar Code" :width="120"></Column>
        <template slot="empty">
          <StatusBox :isFetching="isFetching" :error="error" :isEmpty="isEmpty || isFilterEmpty"></StatusBox>
        </template>
      </Table>
    </Card>
  </div>
</template>

<script type="text/ecmascript-6">
import { mapGetters } from 'vuex';
import stateParseMixin from '../../../../mixins/commonStateParseMixin';
import transDetailsParseMixin from '../../../../mixins/transactionDetailsParseMixin';
import StatusBox from '../../../../components/shared/StatusBox';

export default {
  components: { StatusBox },
  mixins: [stateParseMixin, transDetailsParseMixin],
  data() {
    return {
      isShowDiff: true,
      isFilterEmpty: false
    };
  },
  computed: {
    ...mapGetters('transaction', { state: 'transactionDetails' }),
    skuInfo() {
      if (this.isEmpty) return [];
      this.data.sku_info.forEach(e => {
        e.raw_start_count = e.start_count;
      });
      if (!this.isShowDiff) {
        return this.data.sku_info;
      }
      const diffCountItems = this.data.sku_info.filter(
        e => e.diff_count !== 0 || e.raw_diff_count !== 0
      );
      if (diffCountItems && diffCountItems.length === 0) {
        this.isFilterEmpty = true;
      } else {
        this.isFilterEmpty = false;
      }
      return diffCountItems;
    },
    hybridEnabled() {
      return this.isEmpty ? false : this.data.hybrid_enabled;
    },
    hybridMatched() {
      return this.isEmpty ? true : this.data.hybrid_matched;
    },
    rawDetectResultMatchedIcon() {
      if (!this.hybridEnabled) {
        return null;
      }
      return this.hybridMatched
        ? ['md-checkmark-circle', 'green']
        : ['md-close-circle', 'red'];
    }
  },
  methods: {
    showAllDiff() {
      this.isShowDiff = !this.isShowDiff;
    },
    tableRowClassName({ row }) {
      const layerIndex = row['layer_index'];
      if (layerIndex % 2 === 0) {
        return 'even-layer';
      } else if (layerIndex === 'Total') {
        return 'total-layer';
      }
      return 'odd-layer';
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
    }
  }
};
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
