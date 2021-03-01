<template lang="pug">
  .page-content
    Form.search
      FormItem.form-item
        AppDatePicker(v-model='queryDateRange', placeholder='交易时间', :disabled='state.isFetching')
        Input.ml5(v-model='searchSchema.keyword', placeholder='交易SN', style='width: 250px')
        Button.query-btn.ml5(type='primary', searchSchemahtml-type='submit', :loading='state.isFetching', @click.prevent='search', icon='ios-search') 查询
        .fr(style="font-size: 14px")
          span 展示开关门时间
          i-switch.ml10(v-model='isShowTime')
            span(slot='open') 是
            span(slot='close') 否
    TrxHistoryList(:state='state', @sortChange="sortChange" :sort-change="sortChange" :default-sort="defaultSort" @refresh="refresh",
      :from="from", :to="to", :isShowTime="isShowTime")
    PaginationInnerBox(:total='dataTotal', :isFetching='isFetching', @pageChange='pageChange', @sizeChange='pageChange')
</template>

<script lang="ts">
  import {
    getTransactions$, TransactionParams,
  } from '@/api/transaction';
  import {Component, Prop} from "vue-property-decorator";
  import {mixins} from "vue-class-component";
  import LoadPageMixin, {LoadPageMixinInstance} from "../../../mixins/loadPage";
  import SearchMixin, {SearchMixinInstance} from "../../../mixins/search";
  import {parseDateRange} from "@/utils/misc";
  import {DefaultApiType} from '@/interface';
  import TrxHistoryList from './TrxHistoryList.vue';
  import AppDatePicker from '@/components/shared/AppDatePicker.vue';
  import PaginationInnerBox from '@/components/shared/PaginationInnerBox.vue';
  import moment from "moment";

  @Component({
    components: {
      TrxHistoryList,
      AppDatePicker,
      PaginationInnerBox
    }
  })
  export default class TrxHistory extends mixins(LoadPageMixin, SearchMixin)
    implements LoadPageMixinInstance, SearchMixinInstance {
    @Prop() cabinetId: any;
    queryDateRange: Date[] = parseDateRange('last week', false)();
    defaultApi: DefaultApiType = getTransactions$;
    defaultParams: TransactionParams = {
      pageIndex: 1,
      cabinetId: this.cabinetId,
      pageSize: Number(process.env.PAGE_SIZE),
      sortBy: "create_time",
      sortDirection: "down"
    };
    routeAction: any = 'replace';
    internalSearch: boolean = true;
    from:any = null;
    to:any = null;
    isShowTime = false;

    mounted() {
        const initDate:any = parseDateRange('last week', false)();
        this.from = moment(initDate[0]).format("YYYY-MM-DD");
        this.to =  moment(initDate[1]).format("YYYY-MM-DD");
    }

    search() {
      this.doSearch();
      this.from = this.searchSchema.from;
      this.to = this.searchSchema.to;
    }

    searchSchema: any = {
      ...this.defaultParams,
      keyword: '',
      from: undefined,
      to: undefined
    };

    defaultSort: any = {
      prop: 'create_time',
      order: 'descending'
    };

    transformParams(params: TransactionParams) {
      return params;
    }

    pageChange(page: any) {
      this.loadDefaultApi({ ...page, from :this.cached.from, to: this.cached.to });
    }

    refresh() {
      this.loadDefaultApi();
    }
  }
</script>

<style scoped>

</style>
