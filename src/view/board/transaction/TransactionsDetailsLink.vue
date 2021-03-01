<template>
  <router-link :to="toDetails">
    查看详情
  </router-link>
</template>

<script>
export default {
  props: {
    queryParams: {
      type: Object,
      require: true
    }
  },
  computed: {
    toDetails() {
      const { queryParams } = this;
      return {
        name: 'board-transactions-details',
        params: { tid: queryParams.id }
      };
    }
  }
};
</script>

<style scoped>
</style>
