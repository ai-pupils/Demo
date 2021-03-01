<template lang="pug">
  .table-wrapper
    TableBox(:state="state", dataKey="bundles")
      Column(prop='id', align='center', label='商品组ID', :show-overflow-tooltip='true')
      Column(prop='name', align='center', label='商品组名称', :show-overflow-tooltip='true', :min-width="150")
        template(slot-scope="{row}")
          | {{row.name | emptyText}}
      Column(prop='description', align='center', label='商品组描述', :show-overflow-tooltip='true')
        template(slot-scope="{row}")
          | {{row.description | emptyText}}
      Column(prop='sku_count', align='center', label='商品数', :show-overflow-tooltip='true')
        template(slot-scope="{row}")
          | {{row.sku_count | emptyText}}
      Column(align='center', label='视觉ID', :show-overflow-tooltip='true', prop="vision_id")
      Column(align='center', label='柜体名称', :show-overflow-tooltip='true')
        template(slot-scope="{row}")
          p.ellipsis(v-for="type in row.cabinet_types")
            router-link(:to="{name:'cabinet-type-detail',params:{id: type.id}}")
              | {{type.name}}
      Column(prop='dealer_id', align='center', label='商户ID', :show-overflow-tooltip='true')
      Column(prop='dealer_id', align='center', label='商户名称', :show-overflow-tooltip='true')
        template(slot-scope="{row}")
          router-link(v-if="row.dealer_info", :to="{name:'dealer-detail', params:{id: row.dealer_id}}")
            | {{row.dealer_info.name | emptyText}}
          span(v-else) {{'' | emptyText('--')}}
      Column(prdop='status', align='center', label='商品组状态', :show-overflow-tooltip='true')
        template(slot-scope="{row}")
          Tag(v-if="row.status === bundleStatus.approval.id", color="success") 可用
          Tag(v-else, color="error") 不可用
      Column(prdop='status', align='center', label='审核状态', :show-overflow-tooltip='true')
        template(slot-scope="{row}")
          VerifyStatusTag(:bundle="row")
      Column(prop='create_time', align='center', label='创建时间', :show-overflow-tooltip='true')
        template(slot-scope="{row}")
          | {{row.create_time  | fmtLocalTime}}
      Column(align='center', label='操作', :show-overflow-tooltip='true', fixed="right")
        template(slot-scope='{row}')
          Button(type="primary", size="small", @click="viewHandler(row)") 查看详情
          Button.ml5(:disabled="isDisabled(row)", type="primary", size="small", @click="verifyHandler(row)") 送审
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import TableBox from '@/components/shared/TableBox.vue';
import { Prop } from 'vue-property-decorator';
import LazyLoadImg from '@/components/shared/LazyloadImg.vue';
import { updateSkuBundleV2$ } from '@/api/sku-bundle';
import { skuBundleReviewedStatus } from '@/const/data/sku-bundle';
import VerifyStatusTag from '@/view/sku-bundle-v2/components/VerifyStatusTag.vue';

@Component({
  components: { VerifyStatusTag, TableBox, LazyLoadImg }
})
export default class SkuBundleListTable extends Vue {
  @Prop() state!: any;
  bundleStatus = skuBundleReviewedStatus;

  viewHandler(row: any) {
    this.$router.push({
      name: `v2-sku-bundle-detail`,
      params: { skuBundleId: row.id, status: row.status },
      query: { footprint: row.footprint, visionId: row.vision_id, tabName: "skuBundleInfo" }
    });
  }

  verifyHandler(row: any) {
    this.$Modal.confirm({
      title: '确认',
      content: '送审后将无法编辑组内商品信息，确认送审该商品组吗？',
      onOk: () => {
        this.confirmHandler(row.id);
      }
    });
  }

  confirmHandler(bundleId: string) {
    updateSkuBundleV2$({ id: bundleId, status: 'in_review' }).subscribe({
      next: state => {
        if (!state.isError && state.payload) {
          this.$Message.success('送审成功！');
          this.$router.replace({
            name: 'v2-sku-bundle-verify-list'
          });
        }
      }
    });
  }

  isDisabled(row: any) {
    return (
      !(row.status === 'initialized' || row.status === 'refused') ||
      row.ingress_status !== 'accepted'
    );
  }
}
</script>
