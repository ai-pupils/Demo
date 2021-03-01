import _ from 'lodash';
import rxios from 'axios-rx';
import StandardError from 'standard-error';
import { Message, Notice } from 'iview';
import Qs from 'qs';
import router from '@/router';
import { catchError, exhaustMap } from 'rxjs/operators';
import { throwError, of, Observable, pipe } from 'rxjs';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { setToken } from '@/libs/util';
import { parseQueryDate, toSamlLogin } from '@/utils/misc';
import { EmptyString } from '@/utils/EmptyString';
import { ErrorCodeList, defaultErrorMessage } from '@/const/data/errorCode';

export interface APIConfig extends AxiosRequestConfig {
  suppressWarning?: {
    [key: number]: boolean;
  };
}

declare module 'axios-rx' {
  interface RxiosInstance {
    request<T = any>(config: APIConfig): Observable<T>;
  }
}

/* eslint-disable */
const instance = rxios.create({
  withCredentials: true,
  timeout: 30000,
  paramsSerializer(data) {
    return Qs.stringify(data, { arrayFormat: 'brackets' });
  }
});

const DOCUMENT_LIKE_REGEX = /<(S*?)[^>]*>.*?|<\/.*?>/i;

const errorHandle = (error: any) => {
  let statusText = null;
  let data = null;
  if (error.response) {
    statusText = error.response.statusText;
    data = error.response.data;
  } else {
    statusText = error.statusText;
    data = error.message;
  }

  if (!error.suppress) {
    // for login expire
    const message =
      DOCUMENT_LIKE_REGEX.test(data) && process.env.NODE_ENV === 'production'
        ? '服务器发生未知错误，已自动上报，稍后会有跟进！'
        : data;
    Notice.error({
      title: statusText,
      duration: 0,
      desc: JSON.stringify(data) || message
    });
    return of(error);
  }
  return throwError(error);
};

function checkSchemeStatus(response: AxiosResponse) {
  const { data } = response;
  const { suppressWarning } = response.config as APIConfig;
  const path = `${location.pathname}${location.search}`;

  let suppress = false;

  if (
    !_.isNil(suppressWarning) &&
    !_.isEmpty(suppressWarning) &&
    data.msg &&
    suppressWarning[data.msg.error_code]
  ) {
    suppress = true;
  }

  /* eslint-disable default-case */
  switch (data.status) {
    case 0:
      return Promise.resolve(data);
    case 401:
      if (router.currentRoute.name !== 'login') {
        setToken('');
        toSamlLogin();
      }
      suppress = true; // suppress error notification for session expiration scenario
      break;
    case 50000:
      return Promise.resolve(data);
    case 403:
      if (router.currentRoute.name === 'login') {
        Message.error(data.msg);
      } else if (router.currentRoute.name !== '403') {
        router.replace({ name: '403' });
      }
      suppress = true; // suppress error notification for session expiration scenario
  }

  if (data.status !== 500) {
    // private处理过的返回
    if (
      data.content &&
      data.content.resp_content &&
      data.content.resp_content.error_code
    ) {
      const error_code = data.content.resp_content.error_code;
      if (error_code != 500) {
        const error = _.find(ErrorCodeList, ['code', error_code]);
        let message = defaultErrorMessage;
        if (error) {
          message = error.message;
        }
        Message.warning(message);
        return Promise.resolve({});
      }
    }
    // 未经过private处理的dashboard直接返回
    if (data.msg && data.msg.message && data.msg.message.error_code) {
      const error_code = data.msg.message.error_code;
      if (error_code != 500) {
        const error = _.find(ErrorCodeList, ['code', error_code]);
        let message = defaultErrorMessage;
        if (error) {
          message = error.message;
        }
        Message.warning(message);
        return Promise.resolve({});
      }
    }
  }

  // 处理返回是csv文件
  if (Object.is('arraybuffer', response.config.responseType)) {
    const contentType = response.headers['content-type'];
    if (contentType === 'application/json') {
      throw new StandardError({
        status: 500,
        statusText: '请求服务失败',
        message: '导出失败'
      });
    }
    const disposition = response.headers['content-disposition'] || '';
    const filenameMatch = disposition.match(
      /filename=\"(\S+\s*\S+\s*\S+)\.(xlsx|csv)\"/
    );
    const filename =
      filenameMatch instanceof Array ? filenameMatch[1] : undefined;
    return Promise.resolve({ filename, file: data, status: 0 });
  }

  throw new StandardError({
    status: data.status,
    statusText: '请求服务失败',
    message: data.msg,
    suppress,
    origin: data
  });
}

instance.interceptors.request.use((config: any) => {
  if (config.paramType === 'form') {
    const { data } = config;
    /* eslint-disable no-case-declarations */
    /* eslint-disable no-fallthrough */
    switch (config.method.toLocaleLowerCase()) {
      case 'post':
      case 'put':
        const queryParam = new FormData();
        _.forOwn(data, (item, key) => queryParam.append(key, item));
        config.data = queryParam;
    }
  }

  return config;
});

instance.interceptors.request.use((config: any) => {
  const { params, data } = config;
  let pd = params ? params : data;

  _.forIn(pd, (val: any, key: any) => {
    if (pd[key] instanceof EmptyString) {
      pd[key] = ''
    }
    if(pd[key] === '') {
      pd[key] = undefined
    }
  });

  return config;
});

instance.interceptors.response.use(
  response => checkSchemeStatus(response),
  error => Promise.reject(error)
);

instance.request = _.wrap(instance.request, (core: any, ...args: any[]) =>
  core.call(instance, ...args).pipe(catchError(errorHandle))
);

export default instance;
