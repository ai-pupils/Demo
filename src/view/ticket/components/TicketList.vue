<template lang="pug">
  section
    TableBox(:state='state', style='min-height:250px', @sortChange='sortChanged')
      Column(prop='id', align='center', label='工单编号', :width='180', :show-overflow-tooltip='true')
      Column(prop='type_name', align='center', label='问题分类', :idth='180', :show-overflow-tooltip='true')
      Column(prop='description', align='center', label='问题描述', :width='180', :show-overflow-tooltip='true')
      Column(prop='is_urgent', align='center', label='是否紧急', :width='180', :show-overflow-tooltip='true')
        template(slot-scope='{row}')
          span.important-text(v-if='row.is_urgent') 是
          span(v-else) 否
      Column(prop='reporter_id', align='center', label='商户ID', :width='180', :show-overflow-tooltip='true')
        template(slot-scope='{row}')
          router-link(v-if="row.reporter_id", :to="{name:'dealer-detail', params:{id: row.reporter_id}}") {{row.reporter_id}}
          span(v-else) {{'' | empty}}
      Column(prop='reporter_name', align='center', label='商户名称', :min-width='180', :show-overflow-tooltip='true')
        template(slot-scope='{row}') {{(row.dealer_name || row.reporter_name) | empty}}
      Column(prop='created_at', align='center', label='提交时间', :width='200', :show-overflow-tooltip='true')
        template(slot-scope='{row}') {{row.created_at | fmtLocalTime}}
      Column(prop='handler_name', align='center', label='受理客服', :width='200', :show-overflow-tooltip='true')
        template(slot-scope='{row}') {{row.handler_name | empty}}
      Column(align='center', label='操作', :width='160', :show-overflow-tooltip='true', fixed="right")
        template(slot-scope='{row}')
          a(@click.prevent='viewHandle(row.id)') 查看详情
    PaginationBox(ref="paginationBox", :total='dataTotal', :isFetching='state.isFetching')
</template>

<script lang="ts">
import Component, { mixins } from 'vue-class-component';
import { DataListResponse, DefaultApiType, MetaType } from '@/interface';
import LoadPageMixin, { LoadPageMixinInstance } from '@/mixins/loadPage';
import { getTickets$, GetTicketsData, GetTicketsParams } from '@/api/ticket';
import { Prop, Watch } from 'vue-property-decorator';
import SearchMixin, { SearchMixinInstance } from '@/mixins/search';
import _ from 'lodash';
import TableBox from '@/components/shared/TableBox.vue';
import PaginationBox from '@/components/shared/PaginationBox.vue';

@Component({
  components: { TableBox, PaginationBox }
})
export default class TicketList extends mixins(LoadPageMixin, SearchMixin)
  implements LoadPageMixinInstance, SearchMixinInstance {
  @Prop({ type: String, default: 'PENDING,PROCESSING' }) status!: string;
  @Prop() personType!: any;
  defaultApi: DefaultApiType = getTickets$;
  defaultParams: GetTicketsParams = {
    keyword: undefined,
    handler_id: undefined,
    handler_name: undefined,
    from: undefined,
    to: undefined,
    status: this.status,
    person_type: this.personType,
    pageIndex: 1,
    pageSize: Number(process.env.PAGE_SIZE),
    sortBy: 'is_urgent desc',
    sortDirection: 'down'
  };

  searchSchema: GetTicketsParams = {
    ...this.defaultParams
  };

  transformParams(params: GetTicketsParams) {
    return params;
  }

  sortChanged(params: any) {
    if (!_.isEmpty(params)) {
      const { sortBy, sortDirection } = params;
      if (sortBy && sortDirection) {
        const direction = sortDirection === 'down' ? 'desc' : 'asc';
        this.searchSchema.sortBy = `${sortBy} ${direction}`;
        // 排序时，页码调整为1
        (this.$refs.paginationBox as any).init();
      } else {
        this.searchSchema.sortBy = undefined;
      }
    }
    this.doSearch();
  }

  viewHandle(ticketId: any) {
    this.$router.push({ name: 'ticket-detail', params: { id: ticketId } });
  }
}
</script>

<style scoped>
.important-text {
  color: #fa9d11;
}
</style>
