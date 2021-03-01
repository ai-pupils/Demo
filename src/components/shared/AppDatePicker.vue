<template lang="pug">
  section.app-datepicker.font12
    DatePicker(
    v-model='queryDate',
    :style="{ width: width + 'px' }",
    :type='type',
    :options='options || datePickerOption',
    :clearable='clearable',
    :format='format',
    :placement='placement',
    :placeholder='placeholder',
    @on-change='doChange',
    :disabled='disabled')
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { parseDaterangepickerOption, parseDateRange } from '@/utils/misc';
import { Model, Prop, Watch } from 'vue-property-decorator';

@Component
export default class AppDatePicker extends Vue {
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
  @Model('change', { type: Array })
  date!: any[];
  @Prop({ type: String, default: 'last week' }) distance!: string;
  @Prop({ type: String, default: 'bottom-start' }) placement!: string;

  queryDate: any = parseDateRange(this.distance, false)();

  created() {
    if (!this.options) {
      this.doChange();
    }
  }

  @Watch('date')
  dateChange(v: any) {
    this.queryDate = v;
  }

  @Watch('$route.query', { immediate: true })
  routerQueryChange(query: any) {
    if (query.from && query.to) {
      this.queryDate = [query.from, query.to];
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

  doChange() {
    this.$emit('change', this.queryDate);
  }
}
</script>

<style scoped>
.app-datepicker {
  display: inline-block;
}
.font12 {
  font-size: 12px;
}
</style>
