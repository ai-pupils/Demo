<template>
  <div class="page-content">
    <Card>
      <h6 slot="title">系统异常</h6>
      <Form class="search">
        <FormItem>
          <Input v-model="keyword" placeholder="柜体ID" style="width: 300px"></Input>
          <Select v-model="status" style="width:200px" placeholder="请选择异常状态">
              <Option v-for="item in statusTypes" :value="item.id" :key="item.id">{{ item.label }}</Option>
          </Select>
          <Button icon="ios-search"
                  type="primary"
                  html-type="submit"
                  :loading="state$.isFetching"
                  @click.prevent="search">查询</Button>
        </FormItem>
      </Form>
      <AnomaliesTable :state="state$" :sort-change="sortChange" :default-sort="defaultSort"></AnomaliesTable>

      <PaginationBox :total="total$" :isFetching="state$.isFetching"></PaginationBox>
    </Card>
  </div>
</template>

<script>
import PaginationBox from '../../components/shared/PaginationBox';
import { routerPushWithQuery, getRouteQuery } from '../../utils/observables';
import { baseListMixin } from '../../mixins/commonListViewMixin';
import { getAnomalies$ } from '../../api/anomalies';
import { AnomaliesStatus } from '../../const/data/anomalies';
import AnomaliesTable from './components/AnomaliesTable';

export default {
  mixins: [baseListMixin],
  components: { AnomaliesTable, PaginationBox },
  data() {
    return {
      statusTypes: [...AnomaliesStatus],
      keyword: undefined,
      status: undefined,
      defaultApi: getAnomalies$,
      defaultParams: {
        sortBy: 'status_start_time',
        sortDirection: 'down'
      },
      defaultSort: {
        prop: 'status_start_time',
        order: 'descending'
      }
    };
  },
  created() {
    console.log(1);
    this.statusTypes.unshift({ id: 'all', label: '全部' });
  },
  mounted() {
    const { keyword } = getRouteQuery(this);
    this.keyword = keyword;
  },
  methods: {
    search() {
      routerPushWithQuery(this, {
        pageIndex: 1,
        keyword: this.keyword,
        status: this.status
      });
    },
    sortChange(params) {
      routerPushWithQuery(this, {
        pageIndex: 1,
        ...params
      });
    }
  }
};
</script>
<style lang="scss" scoped>
</style>
