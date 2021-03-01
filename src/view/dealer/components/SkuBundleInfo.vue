<template lang="pug">
  section
    Row
      span.bold 商品组数:
      span.ml20 {{dataTotal}}
      span.bold.ml-50 可用商品组数
      Tooltip(content="商品组状态为可用的商品组数量" placement="top")
        Icon(type="ios-help-circle-outline")
        | ：
      span.ml20 {{enableSkuBundleCount}}
      span.bold.ml-50 运营商品组数
      Tooltip(content="货柜绑定的可用商品组数量" placement="top")
        Icon(type="ios-help-circle-outline")
        | ：
      span.ml20 --
    Row
      TableBox(:state="state", data-key="bundles")
        Column(label='商品组ID', align='center', prop='id', sortable="custom")
        Column(label='商品组名称', align='center', prop='name', sortable="custom", :min-width='150')
          template(slot-scope="{row}")
            | {{row.name | emptyText}}
        Column(label='商品组描述', align='center', prop='description', sortable="custom", :width='150', show-overflow-tooltip)
          template(slot-scope="{row}")
            | {{row.description | emptyText}}
        Column(label='sku数', align='center', prop='skus')
          template(slot-scope='{row}')
            | {{row.sku_count | emptyText}}
        Column(label='创建时间', align='center', prop='create_time', sortable="custom", :width='160')
          template(slot-scope='{row}')
            | {{row.create_time | fmtLocalTime | emptyText}}
        Column(label="视觉ID", align="center", prop="vision_id")
        Column(align='center', label='柜体名称', :show-overflow-tooltip='true')
          template(slot-scope="{row}")
            p(v-for="type in row.cabinet_types")
              router-link(:to="{name:'cabinet-type-detail',params:{id: type.id}}")
                | {{type.name}}
        Column(align='center', label='操作')
          template(slot-scope="{row}")
            Button(@click="viewCabinetDetail(row)") 查看
      PaginationInnerBox(:total="dataTotal", :isFetching="isFetching", @pageChange="pageChange", @sizeChange="pageChange")
      SkuBundleSkusModal(ref="SkuBundleSkusModal")
      SkuBundleServicesModal(ref="SkuBundleServicesModal")
</template>

<script lang="ts">
import Component, { mixins } from 'vue-class-component';
import TableBox from '@/components/shared/TableBox.vue';
import LoadPageMixin, { LoadPageMixinInstance } from '@/mixins/loadPage';
import { DefaultApiType, MetaType } from '@/interface';
import PaginationInnerBox from '@/components/shared/PaginationInnerBox.vue';
import { Prop, Watch } from 'vue-property-decorator';
import { GetSkuBundlesParams, getSkuBundlesV2$ } from '@/api/sku-bundle';
import SkuBundleSkusModal from '@/view/common/SkuBundleSkusModal.vue';
import SkuBundleServicesModal from '@/view/common/SkuBundleServicesModal.vue';

@Component({
  components: {
    SkuBundleServicesModal,
    SkuBundleSkusModal,
    PaginationInnerBox,
    TableBox
  }
})
export default class CabinetInfo extends mixins(LoadPageMixin)
  implements LoadPageMixinInstance {
  @Prop() id!: string;
  fetchOnce: boolean = true;
  defaultApi: DefaultApiType = getSkuBundlesV2$;
  defaultParams: GetSkuBundlesParams = {
    pageIndex: 1,
    pageSize: Number(process.env.PAGE_SIZE),
    dealerId: Number(this.id)
  };
  skuBundleCount: number = 0;
  enableSkuBundleCount: number = 0;

  created() {}

  transformParams(params: any) {
    return params;
  }

  @Watch('state', { immediate: true })
  stateChanged(state: MetaType) {
    if (state.isFulfill) {
      let {
        payload: {
          data: { bundles }
        }
      } = state;
      bundles = bundles.filter((b: any) => b.is_available);
      this.enableSkuBundleCount = bundles.length;
    }
  }

  viewCabinetDetail(row: any) {
    this.$router.push({
      name: 'v2-sku-bundle-detail',
      params: { skuBundleId: row.id },
      query: { footprint: row.footprint }
    });
  }

  pageChange(page: any) {
    this.loadDefaultApi({ ...page });
  }

  openSkuModal(row: any) {
    const SkuBundleSkusModalRef = <SkuBundleSkusModal>(
      this.$refs.SkuBundleSkusModal
    );
    SkuBundleSkusModalRef.load(row.skus);
  }

  openServiceModal(row: any) {
    const SkuBundleServicesModal = <SkuBundleServicesModal>(
      this.$refs.SkuBundleServicesModal
    );
    SkuBundleServicesModal.load(row.models);
  }
}
</script>
