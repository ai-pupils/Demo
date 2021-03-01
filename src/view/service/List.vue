<template>
  <div class="page-content">
    <Card>
      <h6 slot="title">识别服务列表</h6>
      <Form class="search">
        <FormItem>
          <Input v-model="keyword" placeholder="服务ID, 服务地址URL, 商品组ID，商户ID" style="width: 300px"></Input>
          <Button icon="ios-search"
                  type="primary"
                  html-type="submit"
                  :loading="state$.isFetching"
                  @click.prevent="search">查询</Button>
           <Button class="fr" type="primary" @click="$router.push('/service/create')">创建服务</Button>
        </FormItem>
      </Form>
      <ServiceTable :state="state$" :sort-change="sortChange" :default-sort="defaultSort"
        @refresh="refresh"></ServiceTable>

      <PaginationBox :total="total$" :isFetching="state$.isFetching"></PaginationBox>
    </Card>
  </div>
</template>

<script>
import PaginationBox from '@/components/shared/PaginationBox';
import { routerPushWithQuery, getRouteQuery } from '@/utils/observables';
import { baseListMixin } from '@/mixins/commonListViewMixin';
import { getModels$ } from '@/api/models';
import ServiceTable from './components/ServiceTable';

export default {
  mixins: [baseListMixin],
  components: { ServiceTable, PaginationBox },
  data() {
    return {
      keyword: undefined,
      defaultApi: getModels$,
      defaultParams: {
        sortBy: 'create_time',
        sortDirection: 'down'
      },
      defaultSort: {
        prop: 'create_time',
        order: 'descending'
      }
    };
  },
  mounted() {
    const { keyword } = getRouteQuery(this);
    this.keyword = keyword;
  },
  methods: {
    refresh() {
      this.initData$().subscribe();
    },
    search() {
      routerPushWithQuery(this, {
        pageIndex: 1,
        keyword: this.keyword
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
