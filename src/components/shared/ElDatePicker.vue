<template lang="pug">
  section.app-datepicker
    el-date(
      v-if="isDateRange",
      v-model='queryDate',
      :style="{ width: width + 'px' }",
      :type='type',
      :picker-options='options || datePickerOption',
      :clearable='clearable',
      :format='format',
      placement='bottom-start',
      :placeholder='placeholder',
      @change='doChange',
      :disabled='disabled')
    el-date(
      v-if="isSingleDate",
      v-model='querySingleDate',
      :style="{ width: width + 'px' }",
      :clearable='clearable',
      placement='bottom-start',
      :disabled='disabled'
      :picker-options='options',
      @change='doChange',
    )
    el-date(
      v-if="isDateTimeRange",
      v-model='queryDateTimeRange',
      :style="{ width: width + 'px' }",
      :type='type',
      :picker-options='options || dateTimeRangePickerOption',
      :clearable='clearable',
      :format='format',
      placement='bottom-start',
      :placeholder='placeholder',
      @change='doChange',
      :disabled='disabled',
      start-placeholder="开始日期"
      end-placeholder="结束日期"
    )
    el-date(
      v-if="isDateTime",
      v-model='queryDateTime',
      :style="{ width: width + 'px' }",
      :type='type',
      :clearable='clearable',
      :format='format',
      placement='bottom-start',
      :placeholder='placeholder',
      @change='doChange',
      :disabled='disabled'
    )
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { parseDateRange, parseDaterangepickerOption } from '@/utils/misc';
import { Model, Prop, Watch } from 'vue-property-decorator';
import moment from 'moment';

export function disableTodayAndFuture(date: Date) {
  const momentDate = moment(date);
  const today = new Date();
  return momentDate.isSame(today, 'day') || momentDate.isAfter(today, 'day');
}

export function getYesterday() {
  return moment()
    .subtract(1, 'day')
    .toDate();
}

@Component
export default class ElDatePicker extends Vue {
  @Prop({
    type: Boolean,
    default: false
  })
  clearable!: boolean;
  @Prop({
    type: String,
    default: ''
  })
  placeholder!: string;
  @Prop({
    type: Number,
    default: 200
  })
  width!: number;
  @Prop({
    type: Object,
    default: () => null
  })
  options!: any;
  @Prop({
    type: Boolean,
    default: false
  })
  disabled!: boolean;
  @Prop({
    type: String,
    default: 'yyyy/MM/dd'
  })
  format!: string;
  @Prop({
    type: String,
    default: 'daterange'
  })
  type!: string;
  @Model('change', { type: [Array, String, Date] })
  date!: any[];
  @Prop({ type: String, default: 'last week' }) distance!: string;

  queryDate: any = parseDateRange(this.distance, false)();

  querySingleDate: any = '';

  queryDateTimeRange: any = [];

  queryDateTime: any = '';

  mounted() {
    if (!this.options) {
      this.doChange();
    }
  }

  @Watch('date', { immediate: true })
  dateChange(v: any) {
    if (!v) return;
    if (this.isDateRange) {
      this.queryDate = v;
    } else if (this.isSingleDate) {
      this.querySingleDate = v;
    } else if (this.isDateTimeRange) {
      this.queryDateTimeRange = v;
    } else if (this.isDateTime) {
      this.queryDateTime = v;
    }
  }

  @Watch('$route.query', { immediate: true })
  routerQueryChange(query: any) {
    if (query.from && query.to && this.isDateRange) {
      this.queryDate = [query.from, query.to];
    }
    if ((query.from || query.to) && this.isDateTimeRange) {
      this.queryDateTimeRange = [query.from, query.to];
    }
    if (query.day) {
      this.querySingleDate = new Date(query.day);
    }
  }

  get datePickerOption() {
    return parseDaterangepickerOption(
      [
        { text: '最近一周', distance: 'last week' },
        { text: '最近一个月', distance: 'last month' },
        { text: '最近三个月', distance: 'three month' }
      ],
      false
    );
  }

  get dateTimeRangePickerOption() {
    return {
      shortcuts: [
        {
          text: '最近一周',
          onClick(picker: any) {
            picker.$emit('pick', parseDateRange('last week', false)());
          }
        },
        {
          text: '最近一个月',
          onClick(picker: any) {
            picker.$emit('pick', parseDateRange('last month', false)());
          }
        },
        {
          text: '最近三个月',
          onClick(picker: any) {
            picker.$emit('pick', parseDateRange('three month', false)());
          }
        }
      ]
    };
  }
  get isDateRange() {
    return this.type === 'daterange';
  }

  get isSingleDate() {
    return this.type === 'date';
  }

  get isDateTimeRange() {
    return this.type === 'datetimerange';
  }

  get isDateTime() {
    return this.type === 'datetime';
  }

  doChange() {
    if (this.isDateRange) {
      this.$emit('change', this.queryDate);
    } else if (this.isSingleDate) {
      this.$emit('change', this.querySingleDate);
    } else if (this.isDateTimeRange) {
      this.$emit('change', this.queryDateTimeRange);
    } else if (this.isDateTime) {
      this.$emit('change', this.queryDateTime);
    }
  }
}
</script>

<style scoped lang="scss">
.app-datepicker {
  display: inline-block;
  position: relative;
  vertical-align: middle;
  line-height: normal;
}
</style>
<style lang="scss">
.app-datepicker {
  .el-date-editor .el-range__icon {
    line-height: 1 !important;
  }
  .el-date-editor .el-range-separator {
    display: inline-table;
    height: 100%;
    padding: 0 5px;
    margin: 0;
    text-align: center;
    line-height: 32px;
    font-size: 12px;
    width: 5%;
    color: #303133;
  }
  .el-range-editor.el-input__inner,
  .el-date-editor--datetime .el-input__inner {
    &:hover {
      border-color: #57a3f3;
    }
    display: inline-flex;
    width: 100%;
    height: 32px;
    line-height: 1.5;
    padding: 4px 7px;
    font-size: 12px;
    border: 1px solid #dcdee2;
    border-radius: 4px;
    color: #515a6e;
    background-color: #fff;
    background-image: none;
    position: relative;
    cursor: text;
  }
  .el-date-editor {
    .el-range-input {
      font-size: 12px;
    }
  }
  .el-range-editor .el-date-editor {
    .is-disabled {
      border-color: #e4e7ed !important;
      cursor: not-allowed !important;
      background-color: #f3f3f3 !important;
      opacity: 1 !important;
      color: #ccc !important;
    }
  }
  .el-input--prefix .el-input__inner {
    padding-left: 30px;
  }
  .el-input__icon {
    line-height: 35px !important;
  }
  .el-range-editor.is-disabled {
    background-color: #f5f7fa !important;
    border-color: #e4e7ed !important;
    color: #c0c4cc !important;
    cursor: not-allowed !important;
  }
}
// hack 清空按钮隐藏, element-ui 后续新版本会修复这个问题
// https://github.com/ElemeFE/element/issues/17349
.el-picker-panel {
  .el-button--text {
    display: none !important;
  }
}
</style>
