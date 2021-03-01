<template lang="pug">
  .page-content
    Form.search
      FormItem
        AppDatePicker(v-model='queryDateRange', placeholder='交易时间', :disabled='state.isFetching')
        Select.ml5(v-model='searchSchema.status', style='width:200px;margin-right: 5px;', placeholder='请选择异常状态')
          Option(value='all') 全部
          Option(v-for='item in statusTypes', :value='item.id', :key='item.id') {{ item.label }}
        Button(icon='ios-search', type='primary', html-type='submit', :loading='state.isFetching', @click.prevent='search') 查询
    SystemAnomaliesList(:cabinetId='cabinetId', :state='state', @sortChange="sortChange", :sort-change='sortChange', :default-sort='defaultSort')
    PaginationInnerBox(:total='dataTotal', :isFetching='isFetching', @pageChange='pageChange', @sizeChange='pageChange')
</template>

<script lang="ts">

  import {Component, Prop} from "vue-property-decorator";
  import LoadPageMixin, {LoadPageMixinInstance} from "@/mixins/loadPage";
  import {mixins} from "vue-class-component";
  import SearchMixin, {SearchMixinInstance} from "@/mixins/search";
  import PaginationInnerBox from '@/components/shared/PaginationInnerBox.vue';
  import SystemAnomaliesList from "./SystemAnomaliesList.vue";
  import {DefaultApiType} from "@/interface";
  import {getAnomalies$, GetAnomaliesParams} from '@/api/anomalies';
  import {AnomaliesStatus} from '@/const/data/anomalies';
  import AppDatePicker from "@/components/shared/AppDatePicker.vue";
  import {parseDateRange} from "@/utils/misc";

  @Component({
    components: {
      PaginationInnerBox,
      SystemAnomaliesList,
      AppDatePicker
    }
  })
  export default class SystemAnomalies extends mixins(LoadPageMixin, SearchMixin)
    implements LoadPageMixinInstance, SearchMixinInstance {
    @Prop() cabinetId!: number;
    statusTypes: any = [...AnomaliesStatus];
    queryDateRange: Date[] = parseDateRange('last week', false)();
    defaultApi: DefaultApiType = getAnomalies$;
    defaultParams: GetAnomaliesParams = {
      pageIndex: 1,
      pageSize: Number(process.env.PAGE_SIZE),
      cabinetId: this.cabinetId,
      sortBy: "status_start_time",
      sortDirection: "down"
    };
    routeAction: any = 'replace';
    internalSearch: boolean = true;

    search() {
      this.doSearch();
    }

    searchSchema: any = {
      ...this.defaultParams,
      status: 'all',
      from: undefined,
      to: undefined
    };

    defaultSort: any = {
      prop: 'status_start_time',
      order: 'descending'
    };

    pageChange(page: any) {
      this.loadDefaultApi({ ...page, from: this.cached.from, to: this.cached.to });
    }

    transformParams(params: GetAnomaliesParams) {
      return params;
    }

  }
</script>

<style scoped>

</style>
