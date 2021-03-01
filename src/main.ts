// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
/* eslint-disable import/first */

import Vue from 'vue';
import moment from 'moment';
import 'moment/locale/zh-cn';
import iView, { Select } from 'iview';
import Meta from 'vue-meta';
import VueHighcharts from 'vue-highcharts';
import Vue2Filters from 'vue2-filters';
import VueMoment from 'vue-moment';
import { Table, TableColumn, Pagination, Tooltip, DatePicker } from 'element-ui';
import VueScrollTo from 'vue-scrollto';
import VueHighlightJS from 'vue-highlightjs';
import VueRx from 'vue-rx';
import Highcharts from 'highcharts';
import VueQrcode from '@chenfengyuan/vue-qrcode';
import Print from 'vue-print-nb';
import VueAwesomeSwiper from 'vue-awesome-swiper';

import 'classlist-polyfill';
import './css/element-ui-theme/variables.scss';
import './css/iview-theme/index.less';
import '@/css/index.less';
import 'swiper/dist/css/swiper.min.css';

import 'font-awesome/css/font-awesome.css';
import Money from '@/plugins/money';
import Numberic from '@/plugins/numberic';
import OssImgResize from '@/plugins/ossImgResize';
import Date from '@/plugins/date';
import EscapeImgPlugin from '@/plugins/escapeImg';
import App from './App.vue';
import router from './router';
import store from './store';
// import i18n from './locale';

import './initVueEnv';
import './mock';
import "./icons"; // icon

import * as filters from './filters';
import config from '@/const/config';
import { VueConfigOptions } from '@/const/config';
import plugins from './plugins';
import VueLazyload from 'vue-lazyload';
import loadErrorPng from '@/assets/img/load-error.png';

declare module 'vue/types/vue' {
  interface Vue {
    $config: VueConfigOptions;
  }
}

Object.keys(filters).forEach((key: any) => {
  Vue.filter(key, (filters as any)[key]);
});

/** hotfix: iview/Select always show not found text */
(Select as any).computed.notFoundShow = function notFoundShow(this: any) {
  return (
    (this.notFound && !this.remote) ||
    (this.remote && !this.loading && !this.options.length)
  );
};
/** end hotfix */

Vue.use(VueRx);
Vue.use(iView);
Vue.use(Meta);
Vue.use(Vue2Filters);
Vue.use(VueMoment, { moment });
Vue.use(VueHighcharts, { Highcharts });
Vue.use(VueScrollTo, { container: '.page-content' });
Vue.use(VueHighlightJS);
Vue.use(Print);
Vue.use(VueAwesomeSwiper);

Vue.use(Money);
Vue.use(Numberic);
Vue.use(Date);
Vue.use(EscapeImgPlugin);
Vue.use(OssImgResize);
Vue.use(plugins.msgbox);
Vue.use(VueLazyload, buildLazyLoad());

Vue.component(VueQrcode.name, VueQrcode);
Vue.component('Table', Table);
Vue.component('Column', TableColumn);
Vue.component(Pagination.name, Pagination);
Vue.component('ElementTooltip', Tooltip);
Vue.component('ElDate', DatePicker);

Vue.config.productionTip = process.env.NODE_ENV === 'production';
Vue.config.performance = Vue.config.devtools =
  process.env.NODE_ENV === 'development';

Vue.prototype.$config = config;

/* eslint-disable no-new */
const VueInstance = new Vue({
  el: '#app',
  router,
  store,
  // i18n,
  template: '<App/>',
  components: { App }
});

// xAxis.type ='datetime'时，坐标轴不使用utc
Highcharts.setOptions(
  {global: { useUTC: false }}
);

function buildLazyLoad() {
  return {
    // set observer to true
    observer: true,
    listenEvents: ['scroll'],
    throttleWait: 0,
    error: loadErrorPng,
    dispatchEvent: true,
    attempt: 2,
    adapter: {
      loading(listender: any, Init: any) {},
      error(listender: any, Init: any) {
        const imgEl: HTMLImageElement = listender.el;
        const parentEl = imgEl.parentElement;

        if (parentEl) {
          parentEl.className = `${parentEl.className} error-image`;
        }
      },
      loaded({ el }: any) {}
    }
  };
}

export default VueInstance;
