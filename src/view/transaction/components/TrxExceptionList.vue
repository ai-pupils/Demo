<template lang="pug">
  section
    Card
      <!--      Form.search-->
      <!--        FormItem.form-item-->
      <!--          AppDatePicker(v-model='queryDateRange', placeholder='查询时间', :options="datePickerOption")-->
      <!--          Select.ml5(v-model="searchSchema.priority", style='width: 200px', placeholder="异常等级", clearable)-->
      <!--            Option(v-for="item in exceptionPriorities", :value="item.id", :key="item.id") {{item.label}}-->
      <!--          Button.query-btn.ml5(type='primary', html-type='submit', @click.prevent='search', icon='ios-search') 查询-->
      exception-list(ref="exceptionList", :trx_sn="sn", type="tab")
</template>

<script lang="ts">
import Vue from 'vue';
import { parseDateRange, parseDaterangepickerOption } from '@/utils/misc';
import Component, { mixins } from 'vue-class-component';
import AppDatePicker from '@/components/shared/AppDatePicker.vue';
import TabsBox, { TabPaneType } from '@/components/shared/TabsBox.vue';
import { ExceptionPriorities, ExceptionTypes } from '@/const/data/monitor';
import ExceptionList from '@/view/monitor/exception/components/ExceptionList.vue';
import { GetExceptionParams } from '@/api/monitor';
import { Prop, Watch } from 'vue-property-decorator';
import SearchMixin, { SearchMixinInstance } from '@/mixins/search';

@Component({
  components: {
    TabsBox,
    AppDatePicker,
    ExceptionList
  }
})
export default class TrxExceptionList extends mixins(SearchMixin)
  implements SearchMixinInstance {
  @Prop() sn!: any;
  queryDateRange: Date[] = parseDateRange('last week', false)();
  currentTab: string = 'all';
  exceptionTypes: any[] = ExceptionTypes;
  exceptionPriorities: any[] = ExceptionPriorities;
  tabs: TabPaneType[] = this.exceptionTypes;

  searchSchema: any = {
    trx_sn: this.sn,
    priority: undefined,
    from: undefined,
    to: undefined,
    sortBy: 'started_at desc',
    sortDirection: 'down'
  };

  search() {
    (this.$refs['exceptionList'] as ExceptionList).search(this.searchSchema);
  }

  get datePickerOption() {
    return parseDaterangepickerOption(
      [
        { text: '昨天', distance: 'last day' },
        { text: '最近一周', distance: 'last week' },
        { text: '最近一个月', distance: 'last month' },
        { text: '最近三个月', distance: 'three month' }
      ],
      false
    );
  }
}
</script>

<style scoped></style>
