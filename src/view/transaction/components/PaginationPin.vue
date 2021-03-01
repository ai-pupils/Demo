<template lang="pug">
  .pagination-pin
    ElementTooltip(content="根据交易列表排序展示上一笔交易", placement="top")
      Button(@click="changePage(-1)", type="success", :loading="isFetching") 查看前一笔交易
    ElementTooltip(content="根据交易列表排序展示下一笔交易", placement="top")
      Button.ml5(@click="changePage(1)", type="success", :loading="isFetching") 查看后一笔交易
</template>


<script lang="ts">
import Component, { mixins } from 'vue-class-component';
import { Watch } from 'vue-property-decorator';
import ComponentOptionsMixin from '@/mixins/componentOptions';
import {
  getTransactions$,
  TransactionParams
} from '@/api/transaction';
import { catchError, finalize, map, mergeMap, pluck } from 'rxjs/operators';
import { DefaultApiType } from '@/interface';

@Component({})
export default class PaginationPin extends mixins(ComponentOptionsMixin) {
  query: any = {};

  @Watch('$route', { immediate: true })
  routeChange({ query }: any) {
    this.query = query;
  }

  mounted() {
    this.state.isFetching = false;
  }

  changePage(count: number) {
    const index: number = Number(this.query.index) + count;
    if (index < 1) {
      this.$Message.info('没有内容了！');
      return;
    }
    const getDetailId$: DefaultApiType = params =>
      getTransactions$({
        ...params
      }).pipe(
        pluck('payload', 'data', 'results', '0', 'id'),
        map((id: any) => {
          if (!id) throw '没有内容了';
          return id;
        }),
        catchError(
          (err: any): never => {
            this.$Message.info('没有内容了！');
            throw err;
          }
        )
      );

    this.startFetch$()
      .pipe(
        mergeMap(() =>
          getDetailId$({
            ...(this.query as TransactionParams),
            pageIndex: index,
            pageSize: 1
          })
        ),
        finalize(() => this.endFetch())
      )
      .subscribe((id: any) => {
        this.$router.replace({
          params: { id },
          query: { ...this.$route.query, index: String(index) }
        });
        this.$emit('load');
      });
  }
}
</script>

<style lang="less" scoped>
.pagination-pin {
  position: fixed;
  bottom: 50px;
  right: 50px;
}
</style>
