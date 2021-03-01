<!--suppress ALL -->
<template>
  <div class="page-content">
    <Card>
      <h6 slot="title">客户统计</h6>
      <Form class="search">
        <FormItem>
          <Input v-model="keyword" placeholder="商户ID，客户类型，备注" style="width: 300px"></Input>
          <Button icon="ios-search"
                  type="primary"
                  html-type="submit"
                  :loading="isFetching"
                  @click.prevent="load">查询</Button>
        </FormItem>
      </Form>

      <StatisticsTable :state="customers"
                       :pageIndex="start"
                       :pageLimit="limit"
                       @change="pageChange"
                       @sortChange="sortChange"></StatisticsTable>
    </Card>
  </div>
</template>

<script type="text/jsx">
import { mapActions, mapGetters } from 'vuex';
import StatisticsTable from './StatisticsTable';

export default {
  components: { StatisticsTable },
  data() {
    return {
      start: 0,
      limit: 20,
      keyword: '',
      sortBy: ['created_at', 'up']
    };
  },
  computed: {
    ...mapGetters('customer', ['customers']),
    isFetching() {
      return this.customers.isFetching;
    }
  },
  methods: {
    ...mapActions('customer', ['getCustomers']),
    load() {
      const { start, limit, keyword, sortBy } = this;
      this.getCustomers({ start, limit, keyword, sortBy });
    },
    pageChange({ pageIndex, pageLimit }) {
      this.start = pageIndex;
      this.limit = pageLimit;
      this.load();
    },
    sortChange({ sortBy }) {
      this.sortBy = sortBy;
      this.load();
    }
  },
  mounted() {
    this.load();
  }
};
</script>
