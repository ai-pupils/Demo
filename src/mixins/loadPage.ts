import Vue from 'vue';
import Component, { mixins } from 'vue-class-component';
import { merge, Observable, Subject } from 'rxjs';
import { mapTo, startWith, take } from 'rxjs/operators';
import { queryChange$, getRouteQuery } from '@/utils/observables';
import { buildResponseStream } from './helper';
import ComponentOptionsMixin from './componentOptions';
import {
  DataListResponse,
  DataResponse,
  DefaultDataResponse,
  MetaType
} from '@/interface';
import { createEmptyTrackMeta } from '@/utils/misc';

export interface LoadPageMixinInstance<P = any, R = any> extends Vue {
  beforeDefaultApi?: () => Observable<any>;
  defaultApi: (params: P) => Observable<any>;
  defaultParams: P;
  transformParams(params: P): P;
  transformData?(data: R): any;
  fetchOnce?: boolean;
}

@Component<any>({
  subscriptions(this: LoadPageMixinInstance) {
    this.$options.subscriptions = undefined;
    // 初始化数据Subject
    const initData$: Observable<any> = new Subject();
    // 页面路由参数
    const _query = getRouteQuery(this);
    // 路由参数变化流
    const _queryChange$ = queryChange$(this).pipe(
      startWith({ ..._query }),
      take(this.fetchOnce ? 1 : Number.MAX_SAFE_INTEGER)
    );
    // 数据请求流
    const request$ = merge(initData$, _queryChange$);
    // 数据响应流
    const response$ = buildResponseStream(
      request$,
      this.defaultApi,
      this.defaultParams,
      this.transformParams,
      this.beforeDefaultApi
    );
    // 数据请求状态流
    const isFetching$ = merge(
      request$.pipe(mapTo(true)),
      response$.pipe(mapTo(false))
    );

    return {
      initData$,
      request$,
      response$
    };
  }
})
export default class LoadPageMixin extends mixins<
  ComponentOptionsMixin<DefaultDataResponse>
>(ComponentOptionsMixin) {
  fetchOnce: boolean = false;

  created() {
    this.watchApiStream();
  }

  destroyed() {}

  private watchApiStream() {
    if (this.$observables && this.$observables.response$) {
      this.$observables.response$.subscribe({
        next: (res: MetaType<DataListResponse | DataResponse>) => {
          if (res.isFulfill) {
            const paging = (res.payload as DataListResponse).data.paging;
            this.state = { ...res };
            if(typeof (this as any).transformData === 'function') {
              this.state = (this as any).transformData(this.state);
            }
            this.dataTotal =
              (paging && paging.total) ||
              this.state.payload!.data.total ||
              // private api 默认返回total_count
              this.state.payload!.data.total_count ||
              0;
          }
        }
      });
    }

    if (this.$observables && this.$observables.request$) {
      this.$observables.request$.pipe(this.startFetchOperator()).subscribe({
        next: () => {
          this.state = createEmptyTrackMeta();
        }
      });
    }
  }

  public loadDefaultApi(
    this: LoadPageMixin | LoadPageMixinInstance,
    params?: any
  ) {
    (this.$observables.initData$ as Subject<any>).next({
      ...(<LoadPageMixinInstance>this).defaultParams,
      ...params
    });
  }

  public internalPageChange(page: any) {
    this.loadDefaultApi({ ...page });
  }
}
