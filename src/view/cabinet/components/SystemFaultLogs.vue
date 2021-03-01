<template lang="pug">
  .page-content
    Form.search
      FormItem
        AppDatePicker(v-model='queryDateRange', placeholder='交易时间', :disabled='state.isFetching')
        Select.ml5(v-model='searchSchema.status', style='width:200px;margin-right: 5px;', placeholder='请选择故障状态')
          Option(value='all') 全部
          Option(v-for='item in statusTypes', :value='item.id', :key='item.id') {{ item.label }}
        Button(icon='ios-search', type='primary', html-type='submit', :loading='state.isFetching', @click.prevent='search') 查询
    SystemFaultLogsList(:cabinetId='cabinetId', :state='state', @sortChange="sortChange", :sort-change='sortChange', :default-sort='defaultSort')
    PaginationInnerBox(:total='dataTotal', :isFetching='isFetching', @pageChange='pageChange', @sizeChange='pageChange')
</template>

<script lang="ts">

  import {Component, Prop} from "vue-property-decorator";
  import LoadPageMixin, {LoadPageMixinInstance} from "@/mixins/loadPage";
  import {mixins} from "vue-class-component";
  import SearchMixin, {SearchMixinInstance} from "@/mixins/search";
  import PaginationInnerBox from '@/components/shared/PaginationInnerBox.vue';
  import SystemFaultLogsList from "@/view/cabinet/components/SystemFaultLogsList.vue";
  import {DefaultApiType} from "@/interface";
  import {CabinetFaultResovedStatus} from '@/const/data/cabinetFault';
  import AppDatePicker from "@/components/shared/AppDatePicker.vue";
  import {parseDateRange} from "@/utils/misc";
  import {
    GetCabinetFaultParams,
    getCabinetFaults$,
    refreshCabinetFaults$
  } from "@/api/cabinet-fault";

  @Component({
    components: {
      PaginationInnerBox,
      SystemFaultLogsList,
      AppDatePicker
    }
  })
  export default class SystemFaultLogs extends mixins(LoadPageMixin, SearchMixin)
    implements LoadPageMixinInstance, SearchMixinInstance {
    @Prop() cabinetId!: number;
    statusTypes: any = [...CabinetFaultResovedStatus];
    queryDateRange: Date[] = parseDateRange('last week', false)();
    defaultApi: DefaultApiType = getCabinetFaults$;
    defaultParams: GetCabinetFaultParams = {
      cabinetId: this.cabinetId,
      pageIndex: 1,
      pageSize: Number(process.env.PAGE_SIZE),
      sortBy: "created_at",
      sortDirection: "down"
    };
    routeAction: any = 'replace';
    internalSearch: boolean = true;

    mounted() {
      refreshCabinetFaults$.subscribe(()=> this.refresh());
    }

    refresh() {
      this.loadDefaultApi(this.searchSchema);
    }

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
      prop: 'created_at',
      order: 'descending'
    };

    pageChange(page: any) {
      this.loadDefaultApi({ ...page });
    }

    transformParams(params: GetCabinetFaultParams) {
      return params;
    }

  }
</script>

<style scoped>

</style>
