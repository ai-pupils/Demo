import { map, catchError } from 'rxjs/operators';
import { MetaType } from '@/interface';
import { Observable, of } from 'rxjs';

const buildRequest = <T = void, R = any>(
  requestFn: (...params: T | any) => Observable<R>
): ((...params: T | any) => Observable<MetaType<R>>) => {
  const withMeta: MetaType<R> = {
    isFetching: true,
    isError: false,
    error: undefined,
    payload: null,
    isFulfill: false
  };
  return (...args: T | any): Observable<MetaType<R>> =>
    requestFn(...args).pipe(
      map((res: any) => {
        if (res.status != 0) throw res;
        const state = {...withMeta};
        state.payload = res;
        state.isFulfill = true;
        state.isError = false;
        state.isFetching = false;
        state.error = undefined;

        return state;
      }),
      catchError(error => {
        const state = {...withMeta};
        state.payload = null;
        state.error = error;
        state.isFulfill = false;
        state.isError = true;
        state.isFetching = false;

        return of(state);
      })
    );
};
export default buildRequest;
