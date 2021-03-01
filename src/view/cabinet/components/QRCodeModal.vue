<template lang="pug">
  Modal(v-model='isVisible', :width='600', :footer-hide='true', @on-cancel='onCancel')
    template(slot='header')
      div 货柜出厂测试
    Form(:label-width='120')
      FormItem(label='货柜ManagerID:') {{rowData.manager_cabinet_id}}
      FormItem(label='商户ID:') {{rowData.dealer_id}}
      FormItem(label='有效期设置:')
        ElInputNumber(size='small', v-model='limitHourValue', :step='2', :min='2', :max='7*24', :precision='0', readonly='', @blur='inputNumberBlurHandle', @change='inputNumberChangeHandle')
        span(style='margin-left: 10px;margin-right: 10px;') 小时
        Button(@click='addInputNumberValue(3*24)') 3天
        Button(@click='addInputNumberValue(5*24)') 5天
        Button(@click='addInputNumberValue(7*24)') 7天
      FormItem(label='货柜环境:')
        RadioGroup(v-model='envType', type='button', @on-change='changeEnvTypeValue')
          Radio(label='正式环境')
          Radio(label='预发环境')
      FormItem(label='测试二维码生成:')
        Button(type='primary', @click='initQRcode', :disabled='!isCanHandleBuildQRcode') 生成测试二维码
        Button(type='primary', :disabled='!isBuildQRcodeSuccess', v-print="'#printBox'") 打印
      Alert(type='warning', show-icon='', v-if='isShowHasOwnerMsg') 当前货柜已存在有效二维码
      #printBox.qrcode-box(ref='qrcodeRef', v-show='isShowQRcodeBox')
        Spin(size='large', fix='', v-if='isFetching')
        Spin(size='large', fix='', v-if='url && isCanHandleBuildQRcode')
          span.tip 请重新生成二维码
        div(v-show='!isFetching')
          span(style='font-size:32px;') 货柜出厂测试
          div 二维码有效日期：{{startTime}}  -  {{endTime}}
          qrcode(v-if='url', :value='url', :options='{ width: 512, height: 512 }', tag='img', :title='url')
          div
            .col(style="font-size: 30px; font-weight: bold;'")
              span.col_key 货柜环境：
              span.col_value {{envType}}
            .col(style="font-size: 30px; font-weight: bold;'")
              span.col_key ManagerID：
              span.col_value {{rowData.manager_cabinet_id}}
            .col(style="font-size: 30px; font-weight: bold;'")
              span.col_key 商户ID：
              span.col_value
                | {{rowData.dealer_id}}
                span(style='margin-left:20px') {{rowData.dealer_info && rowData.dealer_info.name}}
            .col(style="font-size: 30px; font-weight: bold;'")
              span.col_key 生成人：
              span.col_value {{operator}}
</template>

<script lang="ts">
  import Vue from 'vue';
  import Component from "vue-class-component";
  import ServiceTable from './ServiceTable.vue';
  import {Prop, Provide} from "vue-property-decorator";
  import moment from 'moment';
  import {InputNumber} from 'element-ui';
  import {getCabinetTestUrl$} from '@/api/cabinet';
  import ComponentOptionsMixin from "@/mixins/componentOptions";
  import {finalize, mergeMap} from "rxjs/operators";

  const envObj: any = {
    正式环境: 'prod',
    预发环境: 'staging'
  };

  @Component({
    components: {
      ServiceTable,
      ElInputNumber: InputNumber
    }
  })
  export default class QrCodeModal extends ComponentOptionsMixin {
    @Prop() rowData!: any;
    QRcodeInfo: any;
    isVisible: boolean = false;
    limitHourValue: number = 1;
    isBuildQRcodeSuccess: boolean = false;
    isInputNumberChanged: boolean = false;
    isEnvTypeChanged: boolean = false;
    isShowQRcodeBox: boolean = false;
    url: any = null;
    isFetched: boolean = true;
    startTime: any = null;
    endTime: any = null;
    operator: string = '';
    envType: string = '正式环境';

    get isCanHandleBuildQRcode(): any {
      if (!this.url) {
        return true;
      }
      if (this.isInputNumberChanged) {
        return true;
      }
      if (this.isEnvTypeChanged) {
        return true;
      }
      return false;
    }

    get isShowHasOwnerMsg(): any {
      return this.url && !this.QRcodeInfo.is_owner;
    }

    get isFetching(): boolean {
      return this.isFetched;
    }

    set isFetching(newVal: boolean) {
      this.isFetched = newVal;
    }

    initQRcode() {
      this.isFetching = true;
      this.isShowQRcodeBox = true;
      this.isInputNumberChanged = false;
      this.isEnvTypeChanged = false;
      const expire = this.limitHourValue * 3600;

      this.startFetch$()
        .pipe(
          mergeMap(() =>
            getCabinetTestUrl$({
              expire,
              cabinetId: this.rowData.id,
              envType: envObj[this.envType] || envObj['正式环境']
            })
          ),
          finalize(() => {
            this.endFetch();
          })
        )
        .subscribe((res: any) => {
          if (res.isFulfill) {
            const {
              payload: {data}
            } = res;
            this.QRcodeInfo = data;
            this.isBuildQRcodeSuccess = true;
            this.url = data.link;
            this.startTime = moment(data.created_at).format('YYYY-MM-DD HH:mm');
            this.endTime = moment(data.expired_at).format('YYYY-MM-DD HH:mm');
            this.operator = data.operator;
            this.isFetching = false;
          }
        });
    }

    open() {
      this.isVisible = true;
    }

    inputNumberBlurHandle() {
      if (!this.limitHourValue) {
        this.$nextTick().then(() => {
          this.limitHourValue = 1;
        });
      }
    }

    envTypeChangeHandle() {
      this.isEnvTypeChanged = true;
      this.isBuildQRcodeSuccess = false;
    }

    inputNumberChangeHandle() {
      this.isInputNumberChanged = true;
      this.isBuildQRcodeSuccess = false;
    }

    onCancel() {
      this.QRcodeInfo = {};
      this.url = undefined;
      this.isShowQRcodeBox = false;
      this.isBuildQRcodeSuccess = false;
      this.isInputNumberChanged = false;
      this.isEnvTypeChanged = false;
      this.limitHourValue = 1;
      this.envType = '正式环境';
    }

    getEndTime(hours: number) {
      return moment()
        .add(hours, 'h')
        .format('YYYY-MM-DD HH:mm');
    }

    addInputNumberValue(value: number) {
      this.limitHourValue = value;
      this.inputNumberChangeHandle();
    }

    changeEnvTypeValue(value: string) {
      this.envType = value;
      this.envTypeChangeHandle();
    }

  }
</script>

<style lang="scss" scoped>
  .qrcode-box {
    position: relative;
    min-height: 256px;
    text-align: center;
  }

  .tip {
    color: #000;
  }

  .col {
    display: flex;
    position: relative;
  }

  .col_key {
    text-align: left;
    margin-left: 40px;
    flex: 1;
  }

  .col_value {
    text-align: right;
    font-weight: bold;
    margin-right: 40px;
    max-width: 12em;
    overflow: hidden;
    word-break: normal;
    word-wrap: break-word;
  }
</style>
