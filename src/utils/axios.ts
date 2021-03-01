import _ from 'lodash';
import axios, {AxiosInstance, AxiosResponse} from 'axios';
import StandardError from 'standard-error';
import { Notice } from 'iview';
import Qs from 'qs';
import router from '@/router';
import {setToken} from "@/libs/util";
import { toSamlLogin } from '@/utils/misc';

function checkSchemeStatus(response: AxiosResponse) {
  const {data} = response;
  const path = `${location.pathname}${location.search}`;

  let suppress = false;
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
    case 403:
      if (router.currentRoute.name !== '403') {
        router.replace({name: '403'});
      }
      suppress = true; // suppress error notification for session expiration scenario
  }

  return Promise.reject(new StandardError({
    status: data.status,
    statusText: '请求服务失败',
    message: data.msg,
    suppress,
    origin: data
  }));
}

const instance:AxiosInstance = axios.create({
  withCredentials: true,
  timeout: 30000,
  paramsSerializer(data) {
    return Qs.stringify(data, {arrayFormat: 'brackets'});
  }
});

instance.interceptors.request.use((config: any) => {
  if (config.paramType === 'form') {
    const {data} = config;
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

const requestFuncs = ['request', 'get', 'delete', 'head', 'options', 'post', 'put', 'patch'];
const DOCUMENT_LIKE_REGEX = /<(S*?)[^>]*>.*?|<\/.*?>/i;

_.forEach(requestFuncs, (funcName:any) => {
  (instance as any)[funcName] = _.wrap((instance as any)[funcName], (core, ...arg) =>
    core(...arg)
      .then(checkSchemeStatus)
      .catch((error: any) => {
        let statusText = null;
        let data = null;
        if (error.response) {
          statusText = error.response.statusText;
          data = error.response.data;
        } else {
          statusText = error.statusText;
          data = error.message;
        }

        if (!error.suppress) { // for login expire
          const message = DOCUMENT_LIKE_REGEX.test(data) && process.env.NODE_ENV === 'production' ? '服务器发生未知错误，已自动上报，稍后会有跟进！' : data;
          Notice.error({title: statusText, desc: message});
        }
        return Promise.reject(error);
      })
  );
});

export default instance;
