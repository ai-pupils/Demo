import { merge, Subject } from 'rxjs';
import {
  exhaustMap,
  startWith,
  share,
  mapTo,
  pluck,
  map
} from 'rxjs/operators';
import { watchRouteQuery$, getRouteQuery } from '@/utils/observables';

/* eslint-disable */
const defaultStatus = {
  isFetching: true,
  isError: false,
  error: undefined,
  payload: undefined,
  isFulfill: false
};

const paginationOptions = {
  pageIndex: 1,
  pageSize: process.env.PAGE_SIZE
};

export const baseListMixin = {
  data: function() {
    const initDataSubject = new Subject();
    return {
      initDataSubject,
      query: getRouteQuery(this),
      query$: merge(watchRouteQuery$(this), initDataSubject).pipe(
        startWith({ ...this.query }),
        share()
      ),
      list$: queryList$ =>
        this.query$.pipe(
          exhaustMap(params =>
            queryList$({
              ...paginationOptions,
              ...this.defaultParams,
              ...getRouteQuery(this),
              ...this.transformParams(params)
            })
          ),
          share()
        )
    };
  },
  methods: {
    transformParams(params) {
      return params;
    }
  },
  subscriptions() {
    const list$ = this.list$(this.defaultApi);
    const loadStatus$ = merge(
      this.query$.pipe(mapTo({ ...defaultStatus })),
      list$.pipe(map(res => res))
    );
    return {
      list$,
      loadStatus$,
      state$: loadStatus$.pipe(startWith({ ...defaultStatus })),
      // result$: list$.pipe(pluck('payload','data','results')),
      // paging$: list$.pipe(pluck('payload','data','paging')),
      total$: list$.pipe(pluck('payload', 'data', 'paging', 'total')),
      initData$: this.initDataSubject
    };
  }
};

export const baseInnerListMixin = {
  domStreams: ['pageChange$', 'sizeChange$'],
  data() {
    return {
      defaultParams: {
        pageIndex: 1,
        pageSize: process.env.PAGE_SIZE
      }
    };
  },
  methods: {
    transformParams(params) {
      return params;
    }
  },
  subscriptions() {
    const initData$ = new Subject();
    const params$ = merge(
      this.pageChange$.pipe(
        startWith({
          event: { msg: { ...this.defaultParams } }
        })
      ),
      this.sizeChange$
    ).pipe(
      map(pagerParams => ({
        pageIndex: pagerParams.event.msg.pageIndex,
        pageSize: pagerParams.event.msg.pageSize
      }))
    );
    const list$ = merge(params$, initData$).pipe(
      exhaustMap(params =>
        this.defaultApi({ ...this.defaultParams, ...params })
      ),
      share()
    );
    const load$ = merge(params$.pipe(mapTo(true)), list$.pipe(mapTo(false)));
    return {
      initData$,
      list$,
      load$,
      state$: list$.pipe(startWith({ ...defaultStatus })),
      total$: list$.pipe(pluck('payload', 'data', 'paging', 'total')),
    };
  }
};
