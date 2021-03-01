import { AppRoute } from '@/router/routers';
import Main from '@/components/main/Index.vue';

const SkuList = () => import('@/view/sku-v2/List.vue');
const SkuDetail = () => import('@/view/sku-v2/Detail.vue');
const SkuCreate = () => import('@/view/sku-v2/Create.vue');
const SkuAppearancesDetail = () =>
  import('@/view/sku-v2/appearances/Detail.vue');
const SkuAppearancesCreate = () =>
  import('@/view/sku-v2/appearances/Create.vue');
const Proposals = () => import('@/view/sku-v2/verify/Proposals.vue');
const ProposalDetail = () => import('@/view/sku-v2/verify/ProposalDetail.vue');
const AppearancesDetail = () =>
  import('@/view/sku-v2/verify/AppearancesDetail.vue');

const skuRouteModule: AppRoute[] = [
  {
    path: '/v2/sku',
    name: '_v2_sku',
    component: Main,
    meta: {
      icon: ' fa fa-money',
      title: '商品',
      showAlways: true
    },
    children: [
      // {
      //     path: 'statistics',
      //     name: 'sku-statistics',
      //     component: SkuStatistics,
      //     meta: {
      //         icon: 'md-stats',
      //         title: '商品统计'
      //     }
      // },
      {
        path: 'list',
        name: 'v2-sku-list',
        component: SkuList,
        meta: {
          icon: 'md-albums',
          title: '商品管理'
        }
      },
      {
        path: 'detail/:id',
        name: 'v2-sku-detail',
        component: SkuDetail,
        meta: {
          icon: 'md-albums',
          title: '商品详情',
          hideInMenu: true
        },
        props: true
      },
      {
        path: 'create',
        name: 'v2-sku-create',
        component: SkuCreate,
        meta: {
          icon: 'md-albums',
          title: '新建商品及包装',
          hideInMenu: true
        },
        props: (route: any) => {
          return { proposalId: route.query.proposalId };
        }
      },
      {
        path: 'appearances/detail/:id',
        name: 'v2-sku-appearances-detail',
        component: SkuAppearancesDetail,
        meta: {
          icon: 'md-albums',
          title: '商品包装详情',
          hideInMenu: true
        },
        props: true
      },
      {
        path: 'appearances/create/:skuId',
        name: 'v2-sku-appearances-create',
        component: SkuAppearancesCreate,
        meta: {
          icon: 'md-albums',
          title: '新建商品包装',
          hideInMenu: true
        },
        props: true
      },
      {
        path: 'verify/proposals',
        name: 'v2-sku-verify-proposals',
        component: Proposals,
        meta: {
          icon: 'md-albums',
          title: '商品审核'
        },
        props: true
      },
      {
        path: 'verify/proposal-detail/:id',
        name: 'v2-sku-verify-proposal-detail',
        component: ProposalDetail,
        meta: {
          icon: 'md-albums',
          title: '处理详情',
          hideInMenu: true
        },
        props: true
      },
      {
        path: 'verify/proposal/:proposalId/appearances/:skuId',
        name: 'v2-sku-verify-proposal-appearances',
        component: AppearancesDetail,
        meta: {
          icon: 'md-albums',
          title: '商品包装',
          hideInMenu: true
        },
        props: true
      }
    ]
  }
];

export default skuRouteModule;
