<template lang="pug">
  section
    SupportCabinetListTable(:state="state")
    Alert(type="error") *注：同一商品支持不同货柜类型使用，需要在每种类型的货柜采集一组上新图片数据用作训练
    <!--PaginationInnerBox(:total="dataTotal", :isFetching="isFetching", @pageChange="pageChange", @sizeChange="pageChange")-->
</template>


<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import PaginationInnerBox from '@/components/shared/PaginationInnerBox.vue';
import SupportCabinetListTable from '@/view/sku-v2/appearances/components/SupportCabinetListTable.vue';

@Component({
  components: {
    SupportCabinetListTable,
    PaginationInnerBox
  }
})
export default class SupportCabinetInfo extends Vue {
  @Prop() state!: any;
}
</script>
