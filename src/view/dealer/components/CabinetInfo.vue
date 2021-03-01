<template lang="pug">
  section
    Row
      span.bold 货柜数:
      span.ml20 {{cabinetCount}}
      span.bold.ml-50 运营货柜数:
      span.ml20 {{enableCabinetCount}}
    Row
      TableBox(:state="state")
        Column(prop='id', align='center', label='货柜', :show-overflow-tooltip='true')
        Column(prop='manager_cabinet_id', align='center', label='货柜ManagerID', :show-overflow-tooltip='true')
        Column(prop='name', align='center', label='货柜名称', :show-overflow-tooltip='true')
          template(slot-scope="{row}")
            | {{row.name | emptyText}}
        Column(prop='desc', align='center', label='货柜描述', :show-overflow-tooltip='true')
          template(slot-scope="{row}")
            | {{row.desc | emptyText}}
        Column(prop='location', align='center', label='货柜位置', :show-overflow-tooltip='true')
          template(slot-scope="{row}")
            | {{row.location | emptyText}}
        Column(prop='binding_service.id', align='center', label='所属服务', :show-overflow-tooltip='true')
          template(slot-scope="{row}")
            | {{(row.binding_service && row.binding_service.id) | emptyText}}
        Column(align='center', label='货柜运营状态', :show-overflow-tooltip='true')
          template(slot-scope='{row}') {{row.status | getCabinetStatusTypes}}
        Column(align='center', label='货柜运行状态', :show-overflow-tooltip='true')
          template(slot-scope='{row}') {{row.runtime_status | getCabinetRuntimeStatusTypes}}
        Column(align='center', label='柜体类型', :show-overflow-tooltip='true')
          template(slot-scope='{row}') {{row.cabinet_type_info.name | emptyText}}
        Column(align='center', label='操作')
          template(slot-scope="{row}")
            Button(@click="viewCabinetDetail(row)") 查看
      PaginationInnerBox(:total="dataTotal", :isFetching="isFetching", @pageChange="pageChange", @sizeChange="pageChange")
</template>


<script lang="ts">
import Component, { mixins } from 'vue-class-component';
import TableBox from '@/components/shared/TableBox.vue';
import LoadPageMixin, { LoadPageMixinInstance } from '@/mixins/loadPage';
import { DefaultApiType } from '@/interface';
import {
  GetCabinetParams,
  getCabinets$,
  getCabinetStatus$
} from '@/api/cabinet';
import PaginationInnerBox from '@/components/shared/PaginationInnerBox.vue';
import { Prop } from 'vue-property-decorator';

@Component({
  components: { PaginationInnerBox, TableBox }
})
export default class CabinetInfo extends mixins(LoadPageMixin)
  implements LoadPageMixinInstance {
  @Prop() id!: string;
  fetchOnce: boolean = true;
  defaultApi: DefaultApiType = getCabinets$;
  defaultParams: GetCabinetParams = {
    pageIndex: 1,
    pageSize: Number(process.env.PAGE_SIZE),
    dealerId: this.id
  };
  cabinetCount: number = 0;
  enableCabinetCount: number = 0;

  created() {
    getCabinetStatus$({ dealerId: Number(this.id) }).subscribe(state => {
      const results = state.payload!.data.results;
      const availableCabinet = results.filter((e) => e.status === 'available')[0];
      this.cabinetCount = (state.payload!.data as any).total_count;
      this.enableCabinetCount = availableCabinet ? availableCabinet.count : 0;
    });
  }

  transformParams(params: any) {
    return params;
  }

  viewCabinetDetail(row: any) {
    this.$router.push({ name: 'cabinet-detail', params: { id: row.id } });
  }

  pageChange(page: any) {
    this.loadDefaultApi({ ...page });
  }
}
</script>
