import {
  getBreadCrumbList,
  setTagNavListInLocalstorage,
  getMenuByRouter,
  getTagNavListFromLocalstorage,
  getHomeRoute,
  getNextRoute,
  routeHasExist,
  routeEqual,
  getRouteTitleHandled,
  localSave,
  localRead
} from '@/libs/util';
import router from '@/router';
import routers from '@/router/routers';
import config from '@/const/config';
import { Module } from 'vuex';
import { Route } from 'vue-router';
const { homeName } = config;

export interface AppStoreState {
  breadCrumbList: any[];
  tagNavList: any[];
  homeRoute: any;
  local: any;
  errorList: any[];
  hasReadErrorPage: boolean;
}

const closePage = (state: AppStoreState, route: Route) => {
  const nextRoute = getNextRoute(state.tagNavList, route);
  state.tagNavList = state.tagNavList.filter((item: any) => {
    return !routeEqual(item, route);
  });
  router.push(nextRoute);
};

const AppStoreModule: Module<AppStoreState, any> = {
  state: {
    breadCrumbList: [],
    tagNavList: [],
    homeRoute: {},
    local: localRead('local'),
    errorList: [],
    hasReadErrorPage: false
  },
  getters: {
    menuList: (state, getters, rootState) =>
      getMenuByRouter(routers, rootState.user.access),
    errorCount: state => state.errorList.length
  },
  mutations: {
    setBreadCrumb(state, route) {
      state.breadCrumbList = getBreadCrumbList(route, state.homeRoute);
    },
    setHomeRoute(state, routes) {
      state.homeRoute = getHomeRoute(routes, homeName);
    },
    setTagNavList(state, list) {
      let tagList = [];
      if (list) {
        tagList = [...list];
      } else tagList = getTagNavListFromLocalstorage() || [];
      if (tagList[0] && tagList[0].name !== homeName) tagList.shift();
      let homeTagIndex = tagList.findIndex(
        (item: any) => item.name === homeName
      );
      if (homeTagIndex > 0) {
        let homeTag = tagList.splice(homeTagIndex, 1)[0];
        tagList.unshift(homeTag);
      }
      state.tagNavList = tagList;
      setTagNavListInLocalstorage([...tagList]);
    },
    closeTag(state, route) {
      let tag = state.tagNavList.filter(item => routeEqual(item, route));
      route = tag[0] ? tag[0] : null;
      if (!route) return;
      closePage(state, route);
    },
    addTag(state, { route, type = 'unshift' }) {
      let router = getRouteTitleHandled(route);
      if (!routeHasExist(state.tagNavList, router)) {
        if (type === 'push') state.tagNavList.push(router);
        else {
          if (router.name === homeName) state.tagNavList.unshift(router);
          else state.tagNavList.splice(1, 0, router);
        }
        setTagNavListInLocalstorage([...state.tagNavList]);
      }
    },
    setLocal(state, lang) {
      localSave('local', lang);
      state.local = lang;
    },
    addError(state, error) {
      state.errorList.push(error);
    },
    setHasReadErrorLoggerStatus(state, status = true) {
      state.hasReadErrorPage = status;
    }
  }
};

export default AppStoreModule;
