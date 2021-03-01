import { RouteConfig } from 'vue-router';
import Main from '@/components/main/Index.vue';
import Vue from 'vue';
import transactionRouteModule from '@/router/transaction';
import cabinetRouteModule from '@/router/cabinet';
import dealerRouteModule from '@/router/dealer';
import skuRouteModule from '@/router/sku';
import skuBundleRouteModule from '@/router/sku-bundle';
import monitorRouteModule from '@/router/monitor';
import ticketRouteModule from '@/router/ticket';
import patrolModule from '@/router/patrol';
import caninetGroupRouteModule from '@/router/cabinet-group';
import ingressionRouteModule from '@/router/ingression';
import Demo from '@/view/demo/demo.vue';

const Home = () => import('@/view/home/Index.vue');
const Login = () => import('@/view/login/Index.vue');
const NotFound = () => import('@/view/frame/404.vue');
const PermissionDeniedPage = () => import('@/view/frame/403.vue');
const SkuRegister = () => import('@/view/sku/Register.vue');
const SkuUpdate = () => import('@/view/sku/Update.vue');
const SkuStatistics = () => import('@/view/sku/Statistics.vue');
const TrainingList = () => import('@/view/service/TrainingList.vue');
const LogsDateLogList = () => import('@/view/log/DateLogList.vue');
const SkuBundleList = () => import('@/view/sku-bundle/List.vue');
const CreateBundle = () => import('@/view/sku-bundle/Create.vue');
const UpdateBundle = () => import('@/view/sku-bundle/Update.vue');
const ServiceList = () => import('@/view/service/List.vue');
const IngressionImages = () => import("@/view/sku-bundle-v2/IngressionImages.vue");
/**
 * iview-admin中meta除了原生参数外可配置的参数:
 * meta: {
 *  title: { String|Number|Function }
 *         显示在侧边栏、面包屑和标签栏的文字
 *         使用'{{ 多语言字段 }}'形式结合多语言使用，例子看多语言的路由配置;
 *         可以传入一个回调函数，参数是当前路由对象，例子看动态路由和带参路由
 *  hideInBread: (false) 设为true后此级路由将不会出现在面包屑中，示例看QQ群路由配置
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  notCache: (false) 设为true后页面在切换标签后不会缓存，如果需要缓存，无需设置这个字段，而且需要设置页面组件name属性和路由配置的name一致
 *  access: (null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 *  beforeCloseName: (-) 设置该字段，则在关闭当前tab页时会去'@/router/before-close.js'里寻找该字段名对应的方法，作为关闭前的钩子函数
 * }
 */

type titleFn = () => string | number;

export interface AppRoute extends RouteConfig {
  meta?: {
    title?: string | number | titleFn;
    hideInBread?: boolean;
    hideInMenu?: boolean;
    notCache?: boolean;
    access?: string[] | null | undefined;
    icon?: string;
    beforeCloseName?: string;
    showAlways?: boolean;
  };
  children?: AppRoute[];
}

const routers: AppRoute[] = [
  {
    path: '/',
    name: '_index',
    redirect: { name: 'demo' },
    component: Main,
    meta: {
      icon: 'md-home',
      title: '首页',
      hideInMenu: true
    }
  },
  {
    path: '/demo',
    name: '_demo',
    component: Main,
    meta: {
      icon: 'md-home',
      title: 'demo',
      hideInMenu: true,
      hideInBread: true
    },
    children: [
      {
        name: 'demo',
        path: 'index',
        component: Demo,
        meta: {
          title: 'demo'
        }
      }
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: { hideInMenu: true }
  },
  {
    path: '/403',
    name: '403',
    component: PermissionDeniedPage,
    meta: { hideInMenu: true, hideInBread: true }
  },
  {
    path: '/logs',
    name: '_logs',
    meta: {
      hideInMenu: true
    },
    component: Main,
    children: [
      {
        path: 'index',
        name: 'logs',
        component: LogsDateLogList,
        meta: {
          title: '操作日志'
        }
      }
    ]
  },
  {
    path: '/ingression_images',
    name: 'ingression-images',
    component: IngressionImages,
    meta: {
      title: "采集图片",
      hideInMenu: true
    },
    props: true
  },
  ...monitorRouteModule,
  ...transactionRouteModule,
  ...cabinetRouteModule,
  ...caninetGroupRouteModule,
  ...skuRouteModule,
  ...skuBundleRouteModule,
  ...ingressionRouteModule,
  // TODO: 待废弃
  {
    path: '/sku',
    name: '_sku',
    component: Main,
    meta: {
      title: '商品管理',
      icon: ' fa fa-money',
      hideInMenu: true
    },
    children: [
      {
        path: 'register',
        component: SkuRegister,
        name: 'sku-register',
        meta: { title: '商品注册', hideInMenu: true }
      },
      {
        path: 'update/:id',
        component: SkuUpdate,
        name: 'sku-update',
        meta: { title: '编辑商品', hideInMenu: true }
      },
      {
        path: 'list',
        component: SkuStatistics,
        name: 'sku-list',
        meta: { title: '商品列表' }
      },
      {
        path: 'sku-bundle',
        name: 'sku_bundle',
        meta: { title: '商品组列表' },
        component: {
          created(this: Vue) {
            this.$router.push({ name: 'sku-bundle-list' });
          }
        },
        beforeEnter(to: any, from: any, next: any) {
          next({ name: 'sku-bundle-list' });
        }
      }
    ]
  },
  // TODO: 待废弃
  {
    path: '/sku-bundle',
    name: '_sku-bundle',
    component: Main,
    meta: {
      title: '商品组',
      hideInMenu: true
    },
    children: [
      {
        path: 'list',
        component: SkuBundleList,
        name: 'sku-bundle-list',
        meta: { title: '商品组列表' }
      },
      {
        path: 'create',
        component: CreateBundle,
        name: 'sku-bundle-create',
        meta: { title: '创建商品组', hideInMenu: true }
      },
      {
        path: 'update/:id',
        component: UpdateBundle,
        name: 'sku-bundle-update',
        meta: { title: '编辑商品组', hideInMenu: true },
        props: route => ({
          id: route.params.id,
          dealerId: route.query.dealerId
        })
      }
    ]
  },
  // TODO: 待废弃
  {
    path: '/service',
    name: '_service',
    component: Main,
    meta: { title: '服务管理', icon: ' fa fa-server', hideInMenu: true },
    children: [
      {
        path: 'list',
        component: ServiceList,
        name: 'service-common',
        meta: { title: '服务列表' }
      },
      {
        path: 'training',
        component: TrainingList,
        name: 'service-training',
        meta: { title: '训练队列' }
      }
    ]
  },
  ...dealerRouteModule,
  ...ticketRouteModule,
  ...patrolModule,
  {
    path: '*',
    component: NotFound,
    meta: {
      hideInMenu: true
    }
  }
];

export default routers;
