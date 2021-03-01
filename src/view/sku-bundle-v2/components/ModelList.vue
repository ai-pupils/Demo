<template lang="pug">
  section
    TableBox(:state="state", dataKey="models")
      Column(label="模型ID", align="center", prop="model_id")
      Column(label="模型名称", align="center", prop="model_name")
        template(slot-scope="{row}") {{row.model_name | emptyText}}
      Column(label="模型描述", align="center", prop=model_desc)
        template(slot-scope="{row}") {{row.model_desc | emptyText}}
      Column(label="分配状态", align="center", prop="model_status")
        template(slot-scope="{row}") {{row.is_allocated === true ? '已分配' : '未分配'}}
      Column(label="版本", align="center", prop="is_default")
        template(slot-scope="{row}") {{row.is_default === true ? '正式' : 'beta'}}
      Column(label="模型地址", align="center", prop="model_url")
        template(slot-scope="{row}") {{row.model_url | emptyText}}
      Column(label="创建时间", align="center", prop="create_time")
        template(slot-scope="{row}") {{row.create_time | fmtLocalTime}}
    PaginationInnerBox(:total="dataTotal", :isFetching="isFetching", @pageChange="internalPageChange", @sizeChange="internalPageChange")
</template>


<script lang="ts">
import Component, { mixins } from 'vue-class-component';
import TableBox from '@/components/shared/TableBox.vue';
import LoadPageMixin, { LoadPageMixinInstance } from '@/mixins/loadPage';
import { DefaultApiType } from '@/interface';
import { getBundleModelsV2$ } from '@/api/sku-bundle';
import { Prop } from 'vue-property-decorator';
import PaginationInnerBox from "@/components/shared/PaginationInnerBox.vue";

@Component({
  components: { TableBox, PaginationInnerBox }
})
export default class ModelList extends mixins(LoadPageMixin)
  implements LoadPageMixinInstance {
  @Prop() bundleId!: string;
  fetchOnce: boolean = true;
  defaultApi: DefaultApiType = getBundleModelsV2$;
  defaultParams: any = {
    id: this.bundleId
  };

  transformParams(params: any) {
    return params;
  }
}
</script>
