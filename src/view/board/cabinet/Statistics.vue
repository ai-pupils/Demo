<template>
  <div class="page-content">
    <Card>
      <h6 slot="title">货柜统计</h6>
      <Form class="search">
        <FormItem>
          <Input v-model="searchKeyword" placeholder="商户ID/货柜ManagerID/货柜名称/货柜描述/货柜ID" style="width: 300px"></Input>
          <Button icon="ios-search"
                  type="primary"
                  html-type="submit"
                  :loading="isFetching"
                  @click.prevent="load">查询</Button>
        </FormItem>
      </Form>

      <StatisticsTable :state="cabinets"
                       :pageIndex="start"
                       :pageLimit="limit"
                       @change="pageChange"
                       @sortChange="sortChange"></StatisticsTable>
    </Card>
  </div>
</template>

<script type="text/ecmascript-6">
import _ from 'lodash';
import { mapActions, mapGetters } from 'vuex';
import StatisticsTable from './StatisticsTable';

export default {
  components: { StatisticsTable },
  data() {
    return {
      start: 0,
      limit: 20,
      sortBy: ['id', 'up']
    };
  },
  computed: {
    ...mapGetters('cabinet', ['cabinets']),
    isFetching() {
      return this.cabinets.isFetching;
    },
    searchKeyword: {
      get() {
        const {
          $route: {
            query: { keyword }
          }
        } = this;
        if (!_.isNil(keyword)) {
          return keyword;
        }
        return '';
      },
      set(newVal) {
        this.$router.replace({ query: { keyword: newVal } });
      }
    }
  },
  methods: {
    ...mapActions('cabinet', ['getCabinets']),
    load() {
      const { start, limit, sortBy } = this;
      const keyword = this.searchKeyword;
      this.getCabinets({ start, limit, keyword, sortBy });
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
