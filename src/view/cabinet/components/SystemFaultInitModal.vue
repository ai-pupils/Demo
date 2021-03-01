<template lang="pug">
  section
    Modal(v-model='visible', @on-ok='submit', @on-cancel="closeHandle")
      div(slot='header') {{isReport ?'报告故障': '异常转故障处理'}}
      Form(:label-width='75', :model='putData', :rules='rules', ref='initForm')
        FormItem(v-if='!isReport', label='异常ID:')
          label {{rowData.id}}
        FormItem(v-if='!isReport', label='异常代码:')
          label {{rowData.start_reason_code}}
        FormItem(v-if='!isReport', label='异常名称:')
          label {{rowData.error_name}}
        FormItem(label='故障简述:', prop='desc')
          Input(v-model='putData.desc', type='textarea', :rows='4',
            placeholder='请简述货柜故障的处理结果，最多500汉字，1000字符。')
      div(slot='footer')
        Button(type='text', @click='closeHandle') 取消
        Button(type='primary', @click='submit') 确认
</template>

<script lang="ts">
import Vue from 'vue';
import { Component, Prop, Provide } from 'vue-property-decorator';
import {
  createCabinetFault$,
  GetCabinetFaultParams,
  refreshCabinetFaults$
} from '@/api/cabinet-fault';
import { CabinetFaultSource } from '@/const/data/cabinetFault';
import _ from 'lodash';
import { refreshCabinet$ } from '@/api/cabinet';

@Component({})
export default class SystemFaultInitModal extends Vue {
  visible: boolean = false;
  rowData: any = {};
  @Prop() faultType!: string;
  putData: GetCabinetFaultParams = {
    cabinetId: undefined,
    desc: undefined,
    exception_id: undefined,
    source: undefined
  };

  load(row: any) {
    this.visible = true;
    if (row && !_.isEmpty(row)) {
      this.rowData = row;
      this.putData.exception_id = row.id;
      this.putData.cabinetId = row.cabinetId;
    }
    this.putData.source = this.faultType;
  }

  get isReport() {
    return this.faultType === CabinetFaultSource.REPORT.id;
  }

  get rules() {
    return {
      desc: [{ required: true, message: '请填写故障简述', trigger: 'blur' }]
    };
  }

  closeHandle() {
    this.visible = false;
    (this.$refs.initForm as any).resetFields();
  }

  get currentTab() {
    const {
      $route: {
        query: { currentTab }
      }
    } = this;
    return currentTab;
  }

  submit() {
    (this.$refs.initForm as any).validate((isValid: any) => {
      if (isValid) {
        this.confirmHandle();
      } else {
        this.$Message.error('请完善表单信息');
      }
    });
  }

  confirmHandle() {
    createCabinetFault$({ ...this.putData }).subscribe({
      next: state => {
        if (!state.isError && state.payload) {
          this.$Message.success('创建成功');
          if (this.currentTab === 'systemFaultLogs') {
            // 广播，更新数据
            refreshCabinetFaults$.next();
            //更新货柜信息
            refreshCabinet$.next();
          } else {
            this.$router.push({
              name: 'cabinet-detail',
              params: { id: String(this.putData.cabinetId) },
              query: { currentTab: 'systemFaultLogs' }
            });
          }
        }
        this.closeHandle();
      }
    });
  }
}
</script>

<style scoped></style>
