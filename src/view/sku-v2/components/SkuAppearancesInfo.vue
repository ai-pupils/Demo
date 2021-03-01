<template lang="pug">
  section(v-if="state.isFulfill")
    SkuAppearancesListTable(:state="state")
    <!--PaginationInnerBox(:total="state.payload.data.sku_appearance_count", :isFetching="state.isFetching", @pageChange="pageChange", @sizeChange="pageChange")-->
</template>


<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import SkuAppearancesListTable from '@/view/sku-v2/appearances/components/ListTable.vue';
import { Prop } from 'vue-property-decorator';
import PaginationInnerBox from '@/components/shared/PaginationInnerBox.vue';
@Component({
  components: { PaginationInnerBox, SkuAppearancesListTable }
})
export default class SkuAppearancesInfo extends Vue {
  @Prop() state!: any;

}
</script>
