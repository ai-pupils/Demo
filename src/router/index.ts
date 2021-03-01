import Vue from 'vue';
import Router from 'vue-router';
import routes from './routers';
import store from '@/store';
import {LoadingBar} from 'iview';
import {setToken, getToken, canTurnTo, setTitle} from '@/libs/util';
import config from '@/const/config';
import {VueRouter} from 'vue-router/types/router';

const {homeName} = config;

Vue.use(Router);

const router: VueRouter = new Router({
  routes,
  mode: 'history',
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else if (to.hash) {
      return {
        selector: to.hash
      };
    }
    return {x: 0, y: 0};
  }
});
const LOGIN_PAGE_NAME = 'login';

const turnTo = (to: any, access: any, next: any) => {
  if (canTurnTo(to.name, access, routes)) next();
  // 有权限，可访问
  else next({replace: true, name: '403'}); // 无权限，重定向到403页面
};

router.beforeEach((to, from, next) => {
  LoadingBar.start();
  // const token = getToken();
  // if (!token && to.name !== LOGIN_PAGE_NAME) {
  //   // 未登录且要跳转的页面不是登录页
  //   next({
  //     name: LOGIN_PAGE_NAME // 跳转到登录页
  //   });
  // } else
  //
  //   if (!token && to.name === LOGIN_PAGE_NAME) {
  //   // 未登陆且要跳转的页面是登录页
  //   next(); // 跳转
  // } else if (token && to.name === LOGIN_PAGE_NAME) {
  //   // 已登录且要跳转的页面是登录页
  //   next({
  //     name: homeName // 跳转到homeName页
  //   });
  // } else

  const userStore: any = store.state.user;
  if (userStore.hasGetInfo) {
    turnTo(to, userStore.access, next);
  } else {
    store.dispatch('user/getUserInfo')
      .then((user: any) => {
        // 拉取用户信息，通过用户权限和跳转的页面的name来判断是否有权限访问;access必须是一个数组，如：['super_admin'] ['super_admin', 'admin']
        turnTo(to, user.access, next);
      })
      .catch((error) => {
        setToken('');
        next({
          name: 'login'
        });
      });
  }
});

router.afterEach(to => {
  setTitle(to, router.app);
  LoadingBar.finish();
  window.scrollTo(0, 0);
});

export default router;
