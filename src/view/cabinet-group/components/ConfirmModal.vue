<template lang="pug">
  section
    Modal(v-model="visible", fullscreen, :footer-hide='true', :closable="false")
      .header(slot="header")
        h3 将以下货柜添加至货柜组中
        .btn-group
          Button(@click="cancel") 取消
          Button.ml10(:disabled="isDisabled", type="primary",
              @click="submit", :loading="isLoading") 提交
      h3 已添加货柜数：{{selectCabinets.length}}
      CabinetTable(:cabinets="cabinets", :setSelectAll="true")
      Page.fr(:total="selectCabinets.length", @on-change="pageChange", @on-page-size-change="pageSizeChange",
        :current.sync="pageIndex", :page-size="pageSize", :page-size-opts="pageSizes", show-total, show-sizer)
</template>

<script lang="ts">
import Component from 'vue-class-component';
import Vue from 'vue';
import { Getter } from 'vuex-class';
import CabinetTable from '@/view/cabinet-group/components/CabinetTable.vue';

@Component({
  components: { CabinetTable }
})
export default class ConfirmModal extends Vue {
  @Getter('cabinetGroup/cabinets') selectCabinets!: any[];
  visible = false;
  isLoading = false;
  pageIndex = 1;
  pageSize = Number(process.env.PAGE_SIZE);
  pageSizes = process.env.PAGE_SIZES;

  open() {
    this.visible = true;
  }

  get cabinets() {
    if (this.selectCabinets.length === 0) {
      this.visible = false;
    }
    const start = (this.pageIndex - 1) * this.pageSize;
    const end = this.pageIndex * this.pageSize;
    return this.selectCabinets.slice(start, end);
  }

  get isDisabled() {
    return !(this.cabinets.length > 0);
  }

  cancel() {
    this.visible = false;
    this.isLoading = false;
  }

  showLoading(loading: boolean) {
    this.isLoading = loading;
  }

  submit() {
    this.$emit('next');
  }

  pageChange(page: number) {
    this.pageIndex = page;
  }
  pageSizeChange(pageSize: number) {
    this.pageSize = pageSize;
  }
}
</script>

<style scoped>
.header {
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
}
</style>
