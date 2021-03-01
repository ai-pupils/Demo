<template lang="pug">
  .page-content
    Form.search
      FormItem
        AppDatePicker(v-model='queryDateRange', placeholder='锁柜时间', :disabled='state.isFetching')
        Button.ml5(icon='ios-search', type='primary', html-type='submit', :loading='state.isFetching', @click.prevent='search') 查询
    CabinetLockedLogsList(:cabinetId='cabinetId', :state='state', @sortChange="sortChange", :sort-change='sortChange')
    PaginationInnerBox(:total='dataTotal', :isFetching='isFetching', @pageChange='pageChange', @sizeChange='pageChange')
</template>

<script lang="ts">

  import {Component, Prop} from "vue-property-decorator";
  import LoadPageMixin, {LoadPageMixinInstance} from "@/mixins/loadPage";
  import {mixins} from "vue-class-component";
  import SearchMixin, {SearchMixinInstance} from "@/mixins/search";
  import PaginationInnerBox from '@/components/shared/PaginationInnerBox.vue';
  import {DefaultApiType} from "@/interface";
  import AppDatePicker from "@/components/shared/AppDatePicker.vue";
  import {parseDateRange} from "@/utils/misc";
  import CabinetLockedLogsList
    from "@/view/cabinet/components/CabinetLockedLogsList.vue";
  import {
    getCabinetLockedLogs$,
    GetCabinetLockedLogsParams, refreshCabinetExceptions$
  } from "@/api/v2/cabinet-exceptions";

  @Component({
    components: {
      PaginationInnerBox,
      CabinetLockedLogsList,
      AppDatePicker
    }
  })
  export default class CabinetLockedLogs extends mixins(LoadPageMixin, SearchMixin)
    implements LoadPageMixinInstance, SearchMixinInstance {
    @Prop() cabinetId!: number;
    queryDateRange: Date[] = parseDateRange('last week', false)();
    defaultApi: DefaultApiType = getCabinetLockedLogs$;
    defaultParams: GetCabinetLockedLogsParams = {
      cabinet_id: this.cabinetId,
      pageIndex: 1,
      pageSize: Number(process.env.PAGE_SIZE),
      sortBy: "started_at",
      sortDirection: "down",
      codes: '35002,35003'
    };
    routeAction: any = 'replace';
    internalSearch: boolean = true;

    mounted() {
      refreshCabinetExceptions$.subscribe(()=> this.refresh());
    }

    refresh() {
      this.loadDefaultApi(this.searchSchema);
    }

    search() {
      this.doSearch();
    }

    searchSchema: any = {
      ...this.defaultParams,
      from: undefined,
      to: undefined
    };

    pageChange(page: any) {
      this.loadDefaultApi({ ...page });
    }

    transformParams(params: GetCabinetLockedLogsParams) {
      return params;
    }

  }
</script>

<style scoped>

</style>
