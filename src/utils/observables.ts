import { Observable, ObservableInput, timer, UnaryFunction } from 'rxjs';
import {
  pluck,
  startWith,
  scan,
  exhaustMap,
  take,
  share,
  map
} from 'rxjs/operators';
import Vue from 'vue';

export const queryChange$: (instance: Vue) => Observable<any> = (
  VueInstance: any
) =>
  VueInstance.$watchAsObservable('$route.query', {
    deep: true
  }).pipe(
    share(),
    pluck('newValue'),
    map(params => ({ ...params, ...VueInstance.$route.params }))
  );

export function watchRouteQuery$(vueInstance: Vue) {
  return vueInstance
    .$watchAsObservable('$route.query', { deep: true })
    .pipe(pluck('newValue'));
}

export function getRouteQuery(vueInstance: Vue) {
  return vueInstance.$route.query;
}

export function routerPushWithQuery(
  vueInstance: Vue,
  query: any,
  isPush: boolean = true
) {
  const currentQuery = getRouteQuery(vueInstance);
  return vueInstance.$router[isPush ? 'push' : 'replace']({
    query: {
      ...currentQuery,
      ...query
    }
  });
}

export function polling$(
  dueTime = 0,
  period = 1000,
  totalTIme = 1000,
  callBack$: ObservableInput<any>,
  countDownOperator$: UnaryFunction<any, any>
) {
  const limitCount = totalTIme / period;
  const timer$ = timer(dueTime, period).pipe(
    startWith(-1),
    scan(acc => acc + 1, 0),
    countDownOperator$,
    take(limitCount),
    exhaustMap(() => callBack$)
  );

  return timer$;
}
