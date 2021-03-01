<template lang="pug">
  Layout.main.page(style='height: 100%')
    Sider.left-sider(hide-trigger='', collapsible='', :collapsed-width='64', v-model='collapsed', :style="{overflow: 'hidden'}")
      side-menu(accordion='', ref='sideMenu', :active-name='$route.name', :collapsed='collapsed', @on-select='turnToPage', :menu-list='menuList')
        // 需要放在菜单上面的内容，如Logo，写在side-menu标签内部，如下
        span.logo-text(v-show="!collapsed") 码隆智能柜 - 运营系统
        <!--.logo-con-->
          <!--img(v-show='!collapsed', src='~@/assets/img/f_logo.svg', key='max-logo')-->
          <!--img(v-show='collapsed', src='~@/assets/img/f_logo.svg', key='min-logo')-->
    Layout
      Header.header-con
        header-bar(:collapsed='collapsed', @on-coll-change='handleCollapsedChange')
          <!--user(:message-unread-count='unreadCount', :user-avator='userAvator')-->
          User
          Language(v-if='$config.useI18n', @on-lang-change='setLocal', style='margin-right: 10px;', :lang='local')
          error-store(v-if="$config.plugin['error-store'] && $config.plugin['error-store'].showInHeader", :has-read='hasReadErrorPage', :count='errorCount')
          Fullscreen(v-model='isFullscreen', style='margin-right: 10px;')
      Content.main-content-con
        Layout.main-layout-con
          <!--.tag-nav-wrapper-->
            <!--tags-nav(:value='$route', @input='handleClick', :list='tagNavList', @on-close='handleCloseTag')-->
          Content.content-wrapper
            keep-alive(:include='cacheList')
              router-view
            <!--ABackTop(:height='100', :bottom='80', :right='50', container='.content-wrapper')-->
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Watch } from 'vue-property-decorator';
import { Getter, Mutation, Action } from 'vuex-class';
import SideMenu from './components/side-menu/Index.vue';
import TagsNav from './components/tags-nav/Index.vue';
import User from './components/user/Index.vue';
import HeaderBar from './components/header-bar/Index.vue';
// import ABackTop from './components/a-back-top/Index.vue';
import Fullscreen from './components/fullscreen/Index.vue';
import Language from './components/language/Index.vue';
import ErrorStore from './components/error-store/Index.vue';
import { getNewTagList, routeEqual } from '@/libs/util';
import routers from '@/router/routers';

@Component({
  components: {
    SideMenu,
    HeaderBar,
    Language,
    TagsNav,
    Fullscreen,
    ErrorStore,
    User
    // ABackTop
  }
})
export default class Main extends Vue {
  @Getter('errorCount') errorCount!: any;
  @Mutation('setTagNavList') setTagNavList!: any;
  @Mutation('setBreadCrumb') setBreadCrumb!: any;
  @Mutation('addTag') addTag!: any;
  @Mutation('setLocal') setLocal!: any;
  @Mutation('setHomeRoute') setHomeRoute!: any;
  @Mutation('closeTag') closeTag!: any;
  @Action('handleLogin') handleLogin!: any;
  @Action('user/getUnreadMessageCount') getUnreadMessageCount!: any;

  collapsed: boolean = false;
  minLogo: any = '~@/assets/img/f_logo.svg';
  maxLogo: any = '~@/assets/img/f_logo.svg';
  isFullscreen: boolean = false;

  @Watch('$route')
  routeChange(newRoute: any) {
    const { name, query, params, meta } = newRoute;
    this.addTag({
      route: { name, query, params, meta },
      type: 'push'
    });
    this.setBreadCrumb(newRoute);
    this.setTagNavList(getNewTagList(this.tagNavList, newRoute));
    (this.$refs.sideMenu as SideMenu).updateOpenName(newRoute.name);
  }

  get tagNavList() {
    return this.$store.state.app.tagNavList;
  }
  get tagRouter() {
    return this.$store.state.app.tagRouter;
  }
  get userAvator() {
    return this.$store.state.user.avatorImgPath;
  }
  get cacheList() {
    const list = [
      'ParentView',
      ...(this.tagNavList.length
        ? this.tagNavList
            .filter((item: any) => !(item.meta && item.meta.notCache))
            .map((item: any) => item.name)
        : [])
    ];
    return list;
  }
  get menuList() {
    return this.$store.getters.menuList;
  }
  get local() {
    return this.$store.state.app.local;
  }
  get hasReadErrorPage() {
    return this.$store.state.app.hasReadErrorPage;
  }
  get unreadCount() {
    return this.$store.state.user.unreadCount;
  }

  turnToPage(route: any) {
    let { name, params, query }: any = {};
    if (typeof route === 'string') name = route;
    else {
      name = route.name;
      params = route.params;
      query = route.query;
    }
    if (name.indexOf('isTurnByHref_') > -1) {
      window.open(name.split('_')[1]);
      return;
    }
    this.$router.push({
      name,
      params,
      query
    });
  }

  handleCollapsedChange(state: any) {
    this.collapsed = state;
  }

  handleCloseTag(res: any, type: any, route: any) {
    if (type !== 'others') {
      if (type === 'all') {
        this.turnToPage(this.$config.homeName);
      } else {
        if (routeEqual(this.$route, route)) {
          this.closeTag(route);
        }
      }
    }
    this.setTagNavList(res);
  }

  handleClick(item: any) {
    this.turnToPage(item);
  }

  mounted() {
    /**
     * @description 初始化设置面包屑导航和标签导航
     */
    this.setTagNavList();
    this.setHomeRoute(routers);
    const { name, params, query, meta } = this.$route;
    this.addTag({
      route: { name, params, query, meta }
    });
    this.setBreadCrumb(this.$route);
    if (this.$config.useI18n) {
      // 设置初始语言
      this.setLocal(this.$i18n.locale);
    }
    // 如果当前打开页面不在标签栏中，跳到homeName页
    if (!this.tagNavList.find((item: any) => item.name === this.$route.name)) {
      this.$router.push({
        name: this.$config.homeName
      });
    }
    // 获取未读消息条数
    this.getUnreadMessageCount();
  }
}
</script>

<style lang="less">
.main {
  .logo-con {
    height: 50px;
    padding: 10px;
    img {
      height: 36px;
      width: auto;
      display: block;
      margin: 0 auto;
    }
  }
  .header-con {
    background: #fff;
    padding: 0 20px;
    width: 100%;
  }
  .main-layout-con {
    height: 100%;
    overflow: hidden;
  }
  .main-content-con {
    height: ~'calc(100% - 60px)';
    overflow: hidden;
  }
  .tag-nav-wrapper {
    padding: 0;
    height: 40px;
    background: #f0f0f0;
  }
  .content-wrapper {
    padding: 18px;
    height: ~'calc(100% - 80px)';
    overflow: auto;
  }
  .left-sider {
    .ivu-layout-sider-children {
      overflow-y: scroll;
      margin-right: -18px;
    }
  }
}
.ivu-menu-item > i {
  margin-right: 12px !important;
}
.ivu-menu-submenu > .ivu-menu > .ivu-menu-item > i {
  margin-right: 8px !important;
}
.collased-menu-dropdown {
  width: 100%;
  margin: 0;
  line-height: normal;
  padding: 7px 0 6px 16px;
  clear: both;
  font-size: 12px !important;
  white-space: nowrap;
  list-style: none;
  cursor: pointer;
  transition: background 0.2s ease-in-out;
  &:hover {
    background: rgba(100, 100, 100, 0.1);
  }
  & * {
    color: #515a6e;
  }
  .ivu-menu-item > i {
    margin-right: 12px !important;
  }
  .ivu-menu-submenu > .ivu-menu > .ivu-menu-item > i {
    margin-right: 8px !important;
  }
}

.ivu-select-dropdown.ivu-dropdown-transfer {
  max-height: 400px;
}
.logo-text {
  color: #fff;
  font-size: 16px;
  text-align: center;
  width: 100%;
  display: block;
  vertical-align: middle;
  padding-top: 13px;
  height: 50px;
}
</style>
