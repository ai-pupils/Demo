<template>
  <div class="page-content">
    <Card>
      <h6 slot="title">商品组列表</h6>
      <Form class="search">
        <FormItem>
          <Input v-model="keyword" placeholder="商品组ID，名称，描述，商户ID" style="width: 300px"></Input>
          <Button icon="ios-search"
                  type="primary"
                  html-type="submit"
                  :loading="state$.isFetching"
                  @click.prevent="search">查询</Button>
           <Button class="fr" type="primary" @click="$router.push('/sku-bundle/create')">创建商品组</Button>
        </FormItem>
      </Form>
      <BundleTable :state="state$" :sort-change="sortChange" :default-sort="defaultSort"></BundleTable>

      <PaginationBox :total="total$" :isFetching="state$.isFetching"></PaginationBox>
    </Card>
  </div>
</template>

<script>
import PaginationBox from '../../components/shared/PaginationBox';
import { routerPushWithQuery, getRouteQuery } from '../../utils/observables';
import { baseListMixin } from '../../mixins/commonListViewMixin';
import { getSkuBundles$ } from '../../api/sku-bundle';
import BundleTable from './components/BundleTable';

export default {
  mixins: [baseListMixin],
  components: { BundleTable, PaginationBox },
  data() {
    return {
      keyword: undefined,
      defaultApi: getSkuBundles$,
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
