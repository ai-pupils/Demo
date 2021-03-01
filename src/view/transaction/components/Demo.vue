<template lang="pug">
  .transition-tabs
    Tabs(v-model='currentTab')
      TabPane(label='交易明细', name='details')
        InventoryDiff
      TabPane(label='交易确认', name='confirm')
        Confirm
      TabPane(label='模型调用分析', name='querys')
        .demo-split
          Split(v-model='splitRatio')
            .demo-split-pane(slot='left')
              Preview(inventoryType='start')
            .demo-split-pane(slot='right')
              Preview(inventoryType='end')
      TabPane(label='hybrid分析', name='hybrid')
        HybridResView(v-if="currentTab === 'hybrid'", :sn="trxSn")
      TabPane(label='历史异常', name='exception')
        TrxExceptionList(v-if="currentTab === 'exception'", :sn="trxSn")
    Button.report-btn(type='warning', @click='show(true)') 上报错误
    Modal(v-model='reportModalVisable', title='错误反馈', width='60', :footer-hide='true')
      Row
        Col(span="2")
          span(style='font-size: 14px;') 反馈类型：
        Col(span="22")
          Tag(style='margin: 10px 0 0 10px;', v-for='(tag, index) in tags', :key='index', @click.native='checkLable(tag)', :color='tag.color')
            | {{tag.label}}
      Row(style='margin-top: 30px;')
        Col(span="2")
          span(style='font-size: 14px;') 备注：
        Col(span="20")
          template
            Input(style='margin-left: 10px;', v-model='reportInfo.desc', @on-change='descChange', type='textarea', :rows='4', placeholder='请输入错误备注...')
      Row(style='margin-top: 30px;')
        Col(span="2", offset="9")
          Button(type='primary', :disabled='isDisabled', :loading='isSubmit', @click='report') 提交
        Col(span="2", offset="2")
          Button(@click='show(false)') 取消
</template>

<script lang="ts">
import Vue from 'vue';
import _ from 'lodash';
import InventoryDiff from './InventoryDiff.vue';
import Preview from './Preview.vue';
import Confirm from './Confirm.vue';
import HybridResView from './HybridResView.vue';
import { reportTrxIssue$, updateTrxIssue$ } from '@/api/transaction';
import { tags } from '@/const/data/transactionReport';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import TrxExceptionList from '@/view/transaction/components/TrxExceptionList.vue';

@Component({
  components: {
    TrxExceptionList,
    Preview,
    InventoryDiff,
    Confirm,
    HybridResView
  }
})
export default class Demo extends Vue {
  @Prop() dealerId!: any;
  @Prop() trxSn!: any;
  @Prop() trxReportInfo!: any;

  splitRatio: number = 0.5;
  reportModalVisable: boolean = false;
  tags: any[] = [...tags];
  isSubmit: boolean = false;
  isUpdate: boolean = false;
  reportInfoChanged: boolean = false;
  reportInfo: any = {
    id: 0,
    trx_sn: '',
    report_type: 'error',
    error_code: 0,
    desc: '',
    dealer_id: 0
  };

  mounted() {
    this.initTags();
    this.reportInfo.trx_sn = this.trxSn || '';
    this.reportInfo.dealer_id = this.dealerId || 0;
    if (this.trxReportInfo) {
      this.reportInfo.id = this.trxReportInfo.id;
      this.reportInfo.error_code = Number(this.trxReportInfo.error_code);
      this.reportInfo.desc = this.trxReportInfo.error_desc;
      this.isUpdate = true;
      const obj = this.tags.filter(
        t => t.errorCode === Number(this.trxReportInfo.error_code)
      )[0];
      if (obj) {
        obj.isChecked = true;
        obj.color = 'warning';
      }
    }
  }

  checkLable(tag: any) {
    this.initTags();
    tag.color = 'warning';
    tag.isChecked = !tag.isChecked;
    const obj = this.tags.filter(t => t.isChecked)[0];
    if (obj) {
      this.reportInfo.error_code = obj.errorCode;
    }
    this.reportInfoChanged = true;
  }

  initTags() {
    this.tags.forEach((t: any) => {
      t.isChecked = false;
      t.color = 'orange';
    });
  }

  descChange() {
    this.reportInfoChanged = true;
  }

  show(visible: any) {
    this.reportModalVisable = visible;
  }

  report() {
    this.isSubmit = true;
    if (this.isUpdate) {
      updateTrxIssue$({ ...this.reportInfo }).subscribe(() => {
        this.isSubmit = false;
        this.$Message.success('更新成功');
        this.$emit('exit');
        this.show(false);
      });
    } else {
      reportTrxIssue$({ ...this.reportInfo }).subscribe(() => {
        this.isSubmit = false;
        this.$Message.success('保存成功');
        this.$emit('exit');
        this.show(false);
      });
    }
  }

  get currentTab() {
    const {
      $route: {
        query: { currentTab }
      }
    } = this;
    if (_.isNil(currentTab)) {
      return 'details';
    }
    return currentTab;
  }

  set currentTab(value: any) {
    const {
      $route: { query }
    } = this;
    this.$router.replace({
      query: { ...query, currentTab: value }
    });
  }

  get isDisabled() {
    return (
      this.reportInfo.trx_sn === undefined ||
      this.reportInfo.error_code === undefined ||
      this.reportInfo.dealer_id === undefined ||
      this.reportInfo.desc === undefined ||
      this.reportInfo.trx_sn.length === 0 ||
      this.reportInfo.error_code <= 0 ||
      this.reportInfo.dealer_id <= 0 ||
      this.reportInfo.desc.length === 0 ||
      this.reportInfoChanged === false
    );
  }
}
</script>

<style type="text/less" lang="less" scoped>
.block {
  margin-bottom: 12px;
}

.demo-split {
  height: 100%;
  border: 1px solid #dcdee2;
}

.demo-split-pane {
  height: 100%;
  padding: 6px 2px 10px 10px;
}

.report-btn {
  position: absolute;
  top: 10px;
  right: 40px;
}
</style>
