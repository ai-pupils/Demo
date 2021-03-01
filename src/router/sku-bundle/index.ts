import { AppRoute } from '@/router/routers';
import Main from '@/components/main/Index.vue';

const SkuBundleList = () => import('@/view/sku-bundle-v2/List.vue');
const SkuBundleCreate = () => import('@/view/sku-bundle-v2/Create.vue');
const SkuBundleDetail = () => import('@/view/sku-bundle-v2/Detail.vue');
const SkuBundleClone = () => import('@/view/sku-bundle-v2/Clone.vue');
const SkuBundleVerifyList = () => import('@/view/sku-bundle-v2/VerifyList.vue');
const VerifyDetail = () =>
  import('@/view/sku-bundle-v2/components/VerifyDetail.vue');
const VerifySkuBundleDetail = () =>
  import('@/view/sku-bundle-v2/VerifySkuBundleDetail.vue');

export const skuBundleRouteModule: AppRoute[] = [
  {
    path: '/v2/sku-bundle',
    name: '_v2_sku-bundle',
    component: Main,
    meta: {
      icon: 'ios-calendar',
      title: '商品组',
      showAlways: true
    },
    children: [
      {
        path: 'list',
        name: 'v2-sku-bundle-list',
        component: SkuBundleList,
        meta: {
          icon: 'md-albums',
          title: '商品组管理'
        }
      },
      {
        path: 'verify',
        name: 'v2-sku-bundle-verify-list',
        component: SkuBundleVerifyList,
        meta: {
          // todo add icon
          icon: 'md-albums',
          title: '商品组审核'
        }
      },
      {
        path: 'verify/:id',
        name: 'v2-sku-bundle-verify',
        component: VerifyDetail,
        meta: {
          title: '审核商品组',
          hideInMenu: true
        },
        props: true
      },
      {
        path: 'verify/detail/:id',
        name: 'v2-sku-bundle-verify-detail',
        component: VerifySkuBundleDetail,
        meta: {
          title: '审核商品组详情',
          hideInMenu: true
        },
        props: true
      },
      {
        path: 'create',
        name: 'v2-sku-bundle-create',
        component: SkuBundleCreate,
        meta: {
          icon: 'md-albums',
          title: '新建商品组',
          hideInMenu: true
        },
        props: true
      },
      {
        path: 'detail/:skuBundleId',
        name: 'v2-sku-bundle-detail',
        component: SkuBundleDetail,
        meta: {
          icon: 'md-albums',
          title: '商品组详情',
          hideInMenu: true
        },
        props: true
      },
      {
        path: 'clone/:skuBundleId',
        name: 'v2-sku-bundle-clone',
        component: SkuBundleClone,
        meta: {
          icon: 'md-albums',
          title: '克隆商品组',
          hideInMenu: true
        },
        props: true
      }
    ]
  }
];
export default skuBundleRouteModule;
