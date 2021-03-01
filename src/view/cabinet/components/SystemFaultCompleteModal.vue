<template lang="pug">
  section
    Modal(v-model='visible', @on-ok='submit', @on-cancel="closeHandle")
      div(slot='header') 故障处理完成确认
      Form(:label-width='100', ref='completeForm', :rules='rules', :model='putData')
        FormItem(label='故障ID:')
          | {{rowData.id}}
        FormItem(label='故障来源:')
          | {{rowData.source | getCabinetFaultSourceFilter}}
        FormItem(label='故障简述:')
          | {{rowData.desc}}
        FormItem(label='处理结果:', prop='fixer_comment')
          Input(v-model='putData.fixer_comment', type='textarea', :rows='4', placeholder='请简述货柜故障的处理结果，最多500汉字，1000字符。')
        FormItem(label='故障类型:', prop='type')
          RadioGroup(v-model='putData.type', v-for='type in CabinetFaultTypes', :key='type.id')
            Radio(:label="type.id") {{type.label}}
        FormItem(label='是否蓄意破坏:', prop='is_vandalism')
          RadioGroup(v-model='putData.is_vandalism')
            Radio(:label="type.id" v-for='type in booleanType', :key='type.id') {{type.label}}
      div(slot='footer')
        Button(type='text', @click='closeHandle') 取消
        Button(type='primary', @click='submit') 确认
</template>

<script lang="ts">
import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import {
  updateCabinetFault$,
  GetCabinetFaultParams,
  refreshCabinetFaults$
} from '@/api/cabinet-fault';
import { CabinetFaultTypes } from '@/const/data/cabinetFault';
import _ from 'lodash';
import { booleanType } from '@/const/data/common';
import { refreshCabinet$ } from '@/api/cabinet';

@Component({})
export default class SystemFaultInitModal extends Vue {
  @Prop() sortChange!: any;
  @Prop() defaultSort!: any;
  visible: boolean = false;
  rowData: GetCabinetFaultParams = {};
  putData: GetCabinetFaultParams = {
    fixer_comment: undefined,
    type: undefined,
    is_vandalism: undefined
  };
  CabinetFaultTypes = CabinetFaultTypes;
  booleanType = booleanType;

  load(row: GetCabinetFaultParams) {
    this.visible = true;
    this.rowData = row;
    this.putData.status = 'RESOLVED';
  }

  get rules() {
    return {
      fixer_comment: [
        { required: true, message: '请填写处理结果', trigger: 'blur' }
      ],
      type: [{ required: true, message: '请填写处理结果', trigger: 'change' }],
      is_vandalism: [
        {
          type: 'number',
          required: true,
          message: '请填写是否蓄意破坏',
          trigger: 'change'
        }
      ]
    };
  }

  submit() {
    (this.$refs.completeForm as any).validate((isValid: any) => {
      if (isValid) {
        this.confirmHandle();
      } else {
        this.$Message.error('请完善表单信息');
      }
    });
  }

  closeHandle() {
    this.visible = false;
    // 关闭弹出时，清空数据
    (this.$refs.completeForm as any).resetFields();
  }

  confirmHandle() {
    _.assignIn(this.rowData, this.putData);
    updateCabinetFault$({ ...this.rowData }).subscribe({
      next: state => {
        if (!state.isError && state.payload) {
          this.$Message.success('更新成功');
          // 广播，更新故障数据
          refreshCabinetFaults$.next();
          //更新货柜信息
          refreshCabinet$.next();
        }
        this.closeHandle();
      }
    });
  }
}
</script>

<style scoped></style>
