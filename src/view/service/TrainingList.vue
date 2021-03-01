<template>
    <div class="page-content">
        <Card>
            <h6 slot="title">训练列表</h6>
            <Form class="search">
                <FormItem>
                    <Input v-model="keyword" placeholder="任务名称，任务描述" style="width: 300px"></Input>
                    <Button icon="ios-search"
                            type="primary"
                            html-type="submit"
                            :loading="state$.isFetching"
                            @click.prevent="search">查询
                    </Button>
                </FormItem>
            </Form>
            <TrainingTable :state="state$" :sort-change="sortChange" :default-sort="defaultSort"
                           @refresh="refresh"></TrainingTable>
            <PaginationBox :total="total" :isFetching="state$.isFetching"></PaginationBox>
        </Card>
    </div>
</template>

<script>
import PaginationBox from '../../components/shared/PaginationBox';
import { routerPushWithQuery, getRouteQuery } from '../../utils/observables';
import { baseListMixin } from '../../mixins/commonListViewMixin';
import { getTrainTasks$ } from '../../api/train-tasks';
import TrainingTable from './components/TrainingTable';

export default {
  mixins: [baseListMixin],
  components: { TrainingTable, PaginationBox },
  data() {
    return {
      keyword: undefined,
      defaultApi: getTrainTasks$,
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
  },
  computed: {
    total() {
      if (this.state$.payload !== undefined) {
        return this.state$.payload.data.count;
      }
      return 0;
    }
  }
};
</script>
<style lang="scss" scoped>
</style>
