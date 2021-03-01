<template lang="pug">
  section.patrol-list
    Card
      h6(slot='title') 运营异常监控
      Form.search
        FormItem.form-item
          ElDatePicker(v-model="queryDateTimeRange", :disabled="state.isFetching", placeholder='请选择时间', type="datetimerange", :width="300", format="yyyy-MM-dd HH:mm:ss", :clearable="false")
          Input.ml5(v-model="searchSchema.keyword", type="text", placeholder="商户ID/商户名称", style="width:300px", clearable)
          Select.ml5(v-model="searchSchema.status", style="width:250px")
            Option(v-for="status in statusMap", :key="status.id", :value="status.id") {{status.label}}
          Button.query-btn.ml5(type='primary', searchSchemahtml-type='submit', :loading='state.isFetching', @click.prevent='doSearch', html-type="submit", icon='ios-search') 查询
          Button.query-btn(type='primary', :loading='state.isFetching', style="float:right", @click="$router.push({name:'_patrols_create'})") 新建任务
      PatrolListTable(:state="state", :sort-change="sortChange")
      PaginationBox(:total='dataTotal', :isFetching='state.isFetching')
</template>

<script lang="ts">
import Component, { mixins } from 'vue-class-component';
import { parseDateRange } from '@/utils/misc';
import LoadPageMixin, { LoadPageMixinInstance } from '@/mixins/loadPage';
import { DefaultApiType } from '@/interface';
import ElDatePicker from '@/components/shared/ElDatePicker.vue';
import SearchMixin, { SearchMixinInstance } from '@/mixins/search';
import PatrolListTable from '@/view/patrol/components/PatrolListTable.vue';
import PaginationBox from '@/components/shared/PaginationBox.vue';
import { getPatrols$ } from '@/api/patrol';
import { PatrolStatus } from '@/const/data/patrol';

@Component({
  components: { PaginationBox, ElDatePicker, PatrolListTable }
})
export default class PatrolList extends mixins(LoadPageMixin, SearchMixin)
  implements LoadPageMixinInstance, SearchMixinInstance {
  queryDateTimeRange: Date[] = parseDateRange('last week', false)();
  defaultApi: DefaultApiType = getPatrols$;
  defaultParams: any = {
    pageIndex: 1,
    pageSize: Number(process.env.PAGE_SIZE),
    from: this.queryDateTimeRange[0],
    to: this.queryDateTimeRange[1]
  };
  searchSchema: any = {
    ...this.defaultParams,
    keyword: '',
    status: 'all'
  };
  statusMap = [{ id: 'all', label: '全部' }, ...PatrolStatus];

  transformParams(params: any) {
    return params;
  }

  transformData(state: any): any {
    if (state.isFulfill) {
      state.payload.data.results.forEach((item: any) => {
        this.$set(item, 'isEdited', false);
        this.$set(item, 'isLoading', false)
      });
    }
    return state;
  }
}
</script>

<style scoped lang="scss"></style>
