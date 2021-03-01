<template lang="pug">
  section.clearfix
    .fr(v-if="total>0 && !isFetching")
      Page(@on-page-size-change="sizeChangeHandle" @on-change="currentChangeHandle"
      :current.sync="pageIndex"
      :page-size-opts="pageSizes"
      :page-size="pageSize"
      :total="total"
      show-total
      show-sizer)
</template>
<script>
export default {
  props: {
    total: {
      type: Number,
      default: 0
    },
    isFetching: true,
    pageSizeParams: {
      type: Number,
      default: process.env.PAGE_SIZE
    }
  },
  data() {
    return {
      pageIndex: 1,
      pageSize: this.pageSizeParams,
      pageSizes: process.env.PAGE_SIZES
    };
  },
  methods: {
    sizeChangeHandle(size) {
      this.$emit('sizeChange', { pageSize: size, pageIndex: 1 });
      this.pageIndex = 1;
      this.pageSize = size;
    },
    currentChangeHandle(page) {
      this.$emit('pageChange', { pageIndex: page, pageSize: this.pageSize });
    },
    init() {
      this.pageIndex = 1;
    }
  }
};
</script>

<style scoped>
</style>
