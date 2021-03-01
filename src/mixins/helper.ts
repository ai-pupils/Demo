import { Observable, of } from 'rxjs';
import { exhaustMap, mapTo, mergeMap, share } from 'rxjs/operators';

export const buildResponseStream = (
  request$: Observable<any>,
  defaultApi: (params: any) => Observable<any>,
  defaultParams: any,
  transformParams: (params: any) => any,
  beforeDefaultApi?: () => Observable<any>
) => {
  return request$.pipe(
    mergeMap(params => {
      if (beforeDefaultApi) {
        return beforeDefaultApi().pipe(mapTo(params));
      } else {
        return of(params);
      }
    }),
    exhaustMap(params => {
      if (!defaultApi) return of(defaultApi);
      return defaultApi({
        ...transformParams({ ...defaultParams, ...params })
      });
    }),
    share()
  );
};

// 获取文件后缀名
export function getFileExt(fileName: string) {
  const index = fileName.lastIndexOf(".");
  const len = fileName.length;
  return fileName.substring(index, len);
}
