<template lang="pug">
  .table-wrapper
    TableBox(:state="state", dataKey="bundles")
      Column(prop='id', align='center', label='商品组ID', :show-overflow-tooltip='true')
      Column(prop='name', align='center', label='商品组名称', :show-overflow-tooltip='true', :min-width="150")
        template(slot-scope="{row}")
          | {{row.name | emptyText}}
      Column(align='center', label='商品数', :show-overflow-tooltip='true')
        template(slot-scope="{row}")
          | {{row.sku_count | emptyText}}
      Column(align='center', label='视觉ID', :show-overflow-tooltip='true', prop="vision_id")
      Column(align='center', label='支持柜体', :show-overflow-tooltip='true')
        template(slot-scope="{row}")
          p(v-for="type in row.cabinet_types")
            router-link( :to="{name:'cabinet-type-detail',params:{id: type.id}}")
              | {{type.name}}
      Column(align='center', label='商户ID', :show-overflow-tooltip='true', prop="dealer_id")
      Column(align='center', label='商户名称', :show-overflow-tooltip='true')
        template(slot-scope="{row}")
          router-link(v-if="row.dealer_info", :to="{name:'dealer-detail', params:{id: row.dealer_id}}")
            | {{row.dealer_info.name | emptyText}}
          span(v-else) {{'' | emptyText}}
      Column(align='center', label='提交时间', :show-overflow-tooltip='true')
        template(slot-scope="{row}")
          | {{row.create_time  | fmtLocalTime}}
      Column(v-if="currentTab === 'already'", align='center', label='审核时间', :show-overflow-tooltip='true')
        template(slot-scope="{row}")
          span(v-if="row.reviewed_at") {{row.reviewed_at | fmtLocalTime}}
          span(v-else) {{'' | emptyText('--')}}
      Column(align='center', label='审核状态', :show-overflow-tooltip='true')
        template(slot-scope="{row}")
          Tag(:color="(row.status === 'in_review' ? (row.status+'+'+row.audited_status) : row.status) | getSkuBundleReviewedColorFilter")
            | {{(row.status === 'in_review' ? (row.status+'+'+row.audited_status) : row.status)  | getSkuBundleReviewedStatusFilter}}
      Column(align='center', label='操作', :show-overflow-tooltip='true', fixed="right")
        template(slot-scope='{row}')
          Button(v-if="currentTab === 'waiting' || currentTab === 'again'", type="primary", size="small", @click="verifyHandler(row)") 审核
          Button(v-else, type="primary", size="small", @click="viewHandler(row)") 查看详情
    PaginationBox(:total='dataTotal', :isFetching='state.isFetching')
</template>

<script lang="ts">
import Component, { mixins } from 'vue-class-component';
import LoadPageMixin, { LoadPageMixinInstance } from '@/mixins/loadPage';
import SearchMixin, { SearchMixinInstance } from '@/mixins/search';
import { DefaultApiType } from '@/interface';
import { getSkuBundlesV2$ } from '@/api/sku-bundle';
import PaginationBox from '@/components/shared/PaginationBox.vue';
import TableBox from '@/components/shared/TableBox.vue';
import _ from 'lodash';
import { Prop } from 'vue-property-decorator';

@Component({
  components: { TableBox, PaginationBox }
})
export default class VerifyListTable extends mixins(LoadPageMixin)
  implements LoadPageMixinInstance {
  @Prop({ type: String, default: 'waiting' }) currentTab!: string;
  defaultApi: DefaultApiType = getSkuBundlesV2$;
  defaultParams: any = {
    pageIndex: 1,
    pageSize: Number(process.env.PAGE_SIZE)
  };

  transformParams(params: any) {
    const getStatus = (tabName: string) => {
      const params: any = {
        auditedStatus: undefined,
        status: undefined
      };
      switch (tabName) {
        case 'waiting':
          params.status = 'in_review';
          params.auditedStatus = 'PENDING,ACCEPTED_FIRST';
          break;
        case 'again':
          params.status = 'in_review';
          params.auditedStatus = 'ACCEPTED_SECOND';
          break;
        case 'already':
          params.status = 'refused,approval,deploying';
      }
      return params;
    };
    return {
      ...params,
      sortBy: 'create_time',
      sortDirection: 'desc',
      ...getStatus(this.currentTab)
    };
  }

  viewHandler(row: any) {
    this.$router.push({
      name: 'v2-sku-bundle-verify-detail',
      params: { id: row.id }
    });
  }

  verifyHandler(row: any) {
    this.$router.push({
      name: 'v2-sku-bundle-verify',
      params: {
        id: row.id,
        cabinet_type_name: row.cabinet_type_info
          ? row.cabinet_type_info.name
          : '',
        dealer_id: row.dealer_id
      }
    });
  }
}
</script>
