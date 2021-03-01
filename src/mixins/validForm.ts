import Component, { mixins } from 'vue-class-component';
import { bindCallback, EMPTY, Observable } from 'rxjs';
import { finalize, mergeMap } from 'rxjs/operators';
import ComponentOptionsMixin from '@/mixins/componentOptions';

export interface ValidFormOptions<T = any, R = any>
  extends ComponentOptionsMixin {
  formName: string;
  formApi: (params: T) => Observable<R>;
  transformFormParams: () => any;
}

@Component({})
export default class ValidFormMixin<T = any, R = any> extends mixins(
  ComponentOptionsMixin
) {
  public validAndHandleForm$(): Observable<R> {
    const formName = (this as any).formName;
    const formApi = (this as any).formApi;
    const valid$ = bindCallback<[boolean, any]>(
      (this.$refs[<string>formName] as any).validate
    );

    return valid$().pipe(
      this.startFetchOperator(),
      mergeMap(result => {
        const valid = result instanceof Array ? result[0] : result;
        if (!valid) return EMPTY;
        return formApi((this as any).transformFormParams()) as Observable<R>;
      }),
      finalize(() => {
        this.endFetch();
      })
    );
  }
}
