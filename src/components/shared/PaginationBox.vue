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
import {
  getRouteQuery,
  routerPushWithQuery,
  watchRouteQuery$
} from '@/utils/observables';

const subscrptions = [];

export default {
  props: {
    total: {
      type: Number,
      default: 0
    },
    isFetching: Boolean
  },
  data() {
    return {
      pageIndex: 1,
      pageSize: process.env.PAGE_SIZE,
      pageSizes: process.env.PAGE_SIZES
    };
  },
  created() {
    subscrptions[0] = watchRouteQuery$(this).subscribe(
      ({ pageIndex, pageSize }) => {
        this.pageIndex = Number(pageIndex || 1);
        this.pageSize = Number(pageSize || this.pageSize);
      }
    );
  },
  mounted() {
    const { pageIndex, pageSize } = getRouteQuery(this);
    this.pageIndex = Number(pageIndex || 1);
    this.pageSize = Number(pageSize || this.pageSize);
  },
  destroyed() {
    subscrptions.forEach(subscrption => {
      subscrption.unsubscribe();
    });
  },
  methods: {
    sizeChangeHandle(size) {
      this.pageSize = size;
      routerPushWithQuery(this, { pageSize: size, pageIndex: 1 });
    },
    currentChangeHandle(page) {
      routerPushWithQuery(this, { pageIndex: page });
    },
    init() {
      this.pageIndex = 1;
    }
  },
  watch: {
    '$route.query': function({pageIndex}) {
      if (pageIndex) {
        this.pageIndex = Number(pageIndex);
      }
    }
  }
};
</script>

<style scoped></style>
