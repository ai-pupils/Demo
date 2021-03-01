<template lang="pug">
  .demo-box
    .demo-box-content.content-box(v-show='isFulfill')
      ResViewCtrl(:response='hybridResult', title="Hybrid调用分析")
    .loading-response-content(v-show='isFetching')
      Spin(:fix='true', size='large')
</template>

<script lang="ts">
import _ from 'lodash';
import { Tabs, TabPane } from 'element-ui';
import ResViewCtrl from './ResponseView.vue';
import Component, { mixins } from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import { Getter } from 'vuex-class';
import LoadPageMixin, { LoadPageMixinInstance } from '@/mixins/loadPage';
import { DefaultApiType } from '@/interface';
import { getHybridResults$ } from '@/api/transaction';
import { MetaType } from '../../../interface';

@Component({
  components: {
    ResViewCtrl,
    Tabs,
    TabPane
  }
})
export default class HybridResView extends mixins(LoadPageMixin)
  implements LoadPageMixinInstance {
  @Prop({ type: String, required: true }) sn!: string;

  defaultApi: DefaultApiType = getHybridResults$;
  defaultParams: any = {
    trx_sn: this.sn
  };
  hybridResult = {};

  @Watch('state', { deep: true })
  stateChanged(state: MetaType) {
    if (state.isFulfill) {
      this.hybridResult = _.get(state, 'payload.data');
    }
  }

  transformParams(params: any) {
    return params;
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
