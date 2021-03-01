<template lang="pug">
  .page-content
    Form.search
      FormItem.form-item
        Select(v-model="searchSchema.status", placeholder="请选择状态", style="width:150px", clearable)
          Option(v-for="item in status", :value="item.value", :key="item.value") {{ item.label }}
        Button.query-btn.ml5(type='primary', html-type='submit', :loading='state.isFetching', @click.prevent='doSearch', icon='ios-search') 查询
        Button.query-btn.ml5(type='primary', html-type='submit', @click.prevent='reSearch', icon='ios-refresh') 重置
    TableBox(:state='state', :default-sort='defaultSort', @sortChange='sortChange')
      Column(prop='id', align='center', label='Cabinet Key ID')
      Column(prop='cabinet_serial_id', align='center', label='当前绑定货柜')
        template(slot-scope='{row}')
          .link(v-if="row.cabinet_serial_id")
            router-link(:to="{name: 'cabinet-list', query:{pageIndex: 1, pageSize: 20, keyword: row.cabinet_serial_id}}") {{row.cabinet_serial_id}}
          .text(v-else)
            span --
      Column(prop='create_time', align='center', label='激活时间')
        template(slot-scope='{row}')
          | {{row.create_time | fmtLocalTime | emptyText}}
      Column(prop='expire_time', align='center', label='到期时间')
        template(slot-scope='{row}')
          | {{row.expire_time | fmtLocalTime | emptyText}}
      Column(prop='status', align='center', label='状态')
        template(slot-scope='{row}')
          Tag(:color="row.status | getCabinetKeyStatusColor") {{row.status | getCabinetKeyStatus}}
</template>
<script lang="ts">
import _ from 'lodash';
import Component, { mixins } from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import LoadPageMixin, { LoadPageMixinInstance } from '@/mixins/loadPage';
import { DefaultApiType, MetaType } from '@/interface';
import SearchMixin, { SearchMixinInstance } from '@/mixins/search';
import { getLicenseCabinetKeys$ } from '@/api/v3/license';
import TableBox from '@/components/shared/TableBox.vue';
import { getCabinetKeyStatusColor } from '@/filters';
import { CabinetKeyStatus } from '@/const/data/v3/license';

@Component({
  components: {
    TableBox
  }
})
export default class CabinetKeyDetail extends mixins(SearchMixin, LoadPageMixin)
  implements LoadPageMixinInstance, SearchMixinInstance {
  @Prop() lkey!: any;
  defaultApi: DefaultApiType = getLicenseCabinetKeys$;
  defaultParams: any = {
    pageIndex: 1,
    pageSize: Number(process.env.PAGE_SIZE),
    key: this.lkey
  };
  searchSchema: any = {
    ...this.defaultParams,
    status: undefined
  };
  defaultSort: any = {
    prop: 'id',
    order: 'ascending'
  };
  status = CabinetKeyStatus;

  reSearch() {
    this.searchSchema.status = undefined;
    this.doSearch();
  }

  transformParams(params: any) {
    return params;
  }
}
</script>

<style scoped>
</style>
