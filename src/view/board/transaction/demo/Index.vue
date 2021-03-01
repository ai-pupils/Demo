<template>
    <div class="transition-tabs">
        <Tabs v-model="currentTab">
            <TabPane label="交易明细" name="details">
                <InventoryDiff></InventoryDiff>
            </TabPane>

            <TabPane label="交易确认" name="confirm">
                <Confirm></Confirm>
            </TabPane>

            <TabPane label="调用分析" name="querys">
                <div class="demo-split">
                    <Split v-model="splitRatio">
                        <div slot="left" class="demo-split-pane">
                            <Preview inventoryType="start"></Preview>
                        </div>
                        <div slot="right" class="demo-split-pane">
                            <Preview inventoryType="end"></Preview>
                        </div>
                    </Split>
                </div>
            </TabPane>
        </Tabs>
        <Button type="warning" @click="show(true)" class="report-btn">上报错误</Button>
        <Modal
                v-model="reportModalVisable"
                title="错误反馈"
                width="60"
                :footer-hide="true">
            <Row>
                <Col span="2">
                    <span style="font-size: 14px;">反馈类型：</span>
                </Col>
                <Col span="22">
                    <Tag style="margin: 10px 0 0 10px;" v-for="(tag, index) in tags" :key="index" @click.native="checkLable(tag)"
                          :color="tag.color">{{tag.label}}
                    </Tag>
                </Col>
            </Row>
            <Row style="margin-top: 30px;">
                <Col span="2">
                    <span style="font-size: 14px;">备注：</span>
                </Col>
                <Col span="20">
                    <template>
                        <Input style="margin-left: 10px;" v-model="reportInfo.desc" @on-change="descChange" type="textarea" :rows="4"
                               placeholder="请输入错误备注..."/>
                    </template>
                </Col>
            </Row>
            <Row style="margin-top: 30px;">
                <Col span="2" offset="9">
                    <Button type="primary" :disabled="isDisabled" :loading="isSubmit" @click="report">提交</Button>
                </Col>
                <Col span="2" offset="2">
                    <Button @click="show(false)">取消</Button>
                </Col>
            </Row>
        </Modal>
    </div>
</template>

<script type="text/ecmascript-6">
import _ from 'lodash';
import InventoryDiff from '@/view/board/transaction/demo/InventoryDiff';
import Preview from '@/view/board/transaction/demo/Preview';
import Confirm from '@/view/board/transaction/demo/Confirm';
import { reportTrxIssue$, updateTrxIssue$ } from '@/api/transaction';
import {tags} from '@/const/data/transactionReport';

export default {
  props: ['dealerId', 'trxSn', 'trxReportInfo'],
  components: { Preview, InventoryDiff, Confirm },
  data() {
    return {
      splitRatio: 0.5,
      reportModalVisable: false,
      tags: [...tags],
      isSubmit: false,
      isUpdate: false,
      reportInfoChanged: false,
      reportInfo: {
        id: 0,
        trx_sn: '',
        report_type: 'error',
        error_code: 0,
        desc: '',
        dealer_id: 0
      }
    };
  },
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
        t => t.errorCode === Number(this.trxReportInfo.error_code))[0];
      if(obj){
        obj.isChecked = true;
        obj.color = 'warning';
      }
    }
  },
  methods: {
    checkLable(tag) {
      this.initTags();
      tag.color = 'warning';
      tag.isChecked = !tag.isChecked;
      const obj = this.tags.filter(t => t.isChecked)[0];
      if(obj){
        this.reportInfo.error_code = obj.errorCode;
      }
      this.reportInfoChanged = true;
    },
    initTags() {
      this.tags.forEach(t => {
        t.isChecked = false;
        t.color = 'orange';
      });
    },
    descChange() {
      this.reportInfoChanged = true;
    },
    show(visible) {
      this.reportModalVisable = visible;
    },
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
  },
  computed: {
    currentTab: {
      get() {
        const {
          $route: {
            query: { currentTab }
          }
        } = this;
        if (_.isNil(currentTab)) {
          return 'details';
        }
        return currentTab;
      },
      set(value) {
        const {
          $route: { query }
        } = this;
        this.$router.replace({
          query: { ...query, currentTab: value }
        });
      }
    },
    isDisabled() {
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
};
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

.transition-tabs {
  max-height: 800px;
}

.report-btn {
  position: absolute;
  top: 10px;
  right: 40px;
}
</style>
