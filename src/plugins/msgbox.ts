import { MessageBox } from 'element-ui';
import Vue from 'vue';
import {
  ElMessageBoxOptions,
  MessageBoxData
} from 'element-ui/types/message-box';
import { Observable, from, Subject, throwError, of } from 'rxjs';
import { exhaustMap, mapTo, tap, catchError, map } from 'rxjs/operators';
import { MetaType } from '@/interface';

declare module 'vue/types/vue' {
  interface Vue {
    msgbox$: ObservableMessageBox;
  }
}

interface MessageOptions<P = any, R = any> extends ElMessageBoxOptions {
  confirmInitData?: boolean; // 是否调用当前实例挂载的列表defaultApi方法
  initDataOptions?: any; // 调用defaultApi方法传入的参数
  api?(params?: P): Observable<R>; // 提示框确认后需要调用的api方法
  apiParams?: P; // api方法参数
  successText?: string; // api方法调用成功需要提示的成功信息
  errorText?: string; // api方法调用成功需要提示的失败信息
  confirmCallback?: () => void; // 确认按钮点击cb
  initData$?: Subject<any>; // 初始化数据流
  init?: boolean; // 是否默认使用初始化流
}

interface ObservableMessageBox {
  (options: MessageOptions): Observable<any>;
}

const msgbox$: ObservableMessageBox = function(this: Vue, options) {
  const args: any[] = Array.prototype.slice.call(arguments);
  const settings: MessageOptions = {
    title: options.title || '提示',
    type: options.type || 'warning',
    distinguishCancelAndClose: options.distinguishCancelAndClose || true,
    showCancelButton: options.showCancelButton || true,
    confirmButtonText: options.confirmButtonText || '确认',
    cancelButtonText: options.cancelButtonText || '取消',
    successText: options.successText,
    errorText: options.errorText,
    customClass: options.customClass,
    initData$: options.initData$
  };

  if (args.length === 0) {
    throw new Error('msgbox$ has no argument!');
  }

  options = { ...options, ...settings };

  return from(MessageBox(options)).pipe(
    map(action => {
      if (typeof options.confirmCallback === 'function') {
        options.confirmCallback();
      }
      return action;
    }),
    exhaustMap((action: any) => {
      if (action !== 'confirm') return throwError(action);
      if (options.api) {
        return options.api(options.apiParams).pipe(
          tap((state: MetaType) => {
            if (state.isError) {
              throw new Error(state.error);
            }
            if (options.successText) {
              this.$Message.success(options.successText);
            }
            if (options.initData$) {
              options.initData$.next(options.initDataOptions);
            }
            if (options.init) {
              (this.$observables.initData$ as Subject<any>).next(
                options.initDataOptions
              );
            }
          }),
          catchError(error => {
            if (error !== 'cancel') {
              this.$Message.error(options.errorText || '服务器出现错误');
            }
            return throwError(new Error(error));
          })
        );
      }
      return of(action);
    })
  );
};

export default msgbox$;
