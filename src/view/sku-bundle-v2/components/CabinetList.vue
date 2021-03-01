<template lang="pug">
  section
    TableBox(:state="state")
      Column(label="货柜ID", align="center", prop='id')
      Column(label="货柜ManagerID", align="center", prop='manager_cabinet_id', show-overflow-tooltip)
      Column(label="货柜名称", align="center", show-overflow-tooltip)
        template(slot-scope="{row}")
          | {{row.name | emptyText}}
      Column(label="货柜描述", align="center", show-overflow-tooltip)
        template(slot-scope="{row}")
          | {{row.desc | emptyText}}
      Column(label="货柜位置", align="center", show-overflow-tooltip)
        template(slot-scope="{row}")
          | {{row.location | emptyText}}
      Column(label="货柜运营状态", align="center")
        template(slot-scope='{row}')
          | {{row.status | getCabinetStatusTypes}}
      Column(label="货柜运行状态", align="center")
        template(slot-scope='{row}')
          | {{row.runtime_status | getCabinetRuntimeStatusTypes}}
      Column(label="模型ID", align="center", prop="model_id")
      Column(label="操作", align="center", fixed="right")
        template(slot-scope="{row}")
          Button(size="small", @click="viewCabinet(row)") 查看
          Button.ml5(size="small", type="primary", @click="updateModel(row)") 修改模型
    PaginationInnerBox(ref="PaginationInnerBox", :total="dataTotal", :isFetching="isFetching", @pageChange="internalPageChange", @sizeChange="internalPageChange")
    UpdateModelModal(ref="UpdateModelModal", @complete="reload")
</template>


<script lang="ts">
import Component, { mixins } from 'vue-class-component';
import TableBox from '@/components/shared/TableBox.vue';
import { DefaultApiType, MetaType } from '@/interface';
import UpdateModelModal from '@/view/sku-bundle-v2/components/UpdateModelModal.vue';
import LoadPageMixin, { LoadPageMixinInstance } from '@/mixins/loadPage';
import { GetCabinetParams, getCabinets$ } from '@/api/cabinet';
import { Prop } from 'vue-property-decorator';
import PaginationInnerBox from '@/components/shared/PaginationInnerBox.vue';
import { getBundleModelsV2$ } from '@/api/sku-bundle';

@Component({
  components: { PaginationInnerBox, UpdateModelModal, TableBox }
})
export default class CabinetList extends mixins(LoadPageMixin)
  implements LoadPageMixinInstance {
  @Prop() bundleId!: string;
  fetchOnce: boolean = true;
  defaultApi: DefaultApiType = getCabinets$;
  defaultParams: GetCabinetParams = {
    pageIndex: 1,
    pageSize: 20,
    bundleId: this.bundleId
  };

  visible: boolean = false;

  viewCabinet(row: any) {
    this.$router.push({ name: 'cabinet-detail', params: { id: row.id } });
  }

  transformParams(params: any) {
    return params;
  }

  updateModel(row: any) {
    this.msgbox$({
      message: `该商品组已经绑定模型${row.model_id}, 确认修改模型?`,
      api: getBundleModelsV2$,
      apiParams: {
        id: row.bundle_id
      }
    }).subscribe({
      next: (res: MetaType) => {
        if (res.isFulfill) {
          this.openModelListModal(res, row);
        }
      }
    });
  }

  openModelListModal(data: any, row: any) {
    const UpdateModelModalRef: UpdateModelModal = this.$refs[
      'UpdateModelModal'
    ] as UpdateModelModal;
    UpdateModelModalRef.open(data, row);
  }

  reload() {
    const PaginationInnerBox: any = this.$refs['PaginationInnerBox'];

    this.loadDefaultApi({
      pageIndex: PaginationInnerBox.pageIndex,
      pageSize: PaginationInnerBox.pageSize
    });
  }
}
</script>
