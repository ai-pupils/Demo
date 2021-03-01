import { AppRoute } from '@/router/routers';
import Main from "@/components/main/Index.vue";

const CabinetStatistics = () => import('@/view/cabinet/Statistics.vue');
const CabinetList = () => import('@/view/cabinet/List.vue');
const CabinetDetail = () => import('@/view/cabinet/Detail.vue');
const CabinetTypeList = () => import('@/view/cabinet/CabinetTypeList.vue');
const CabinetTypeDetail = () => import('@/view/cabinet/CabinetTypeDetail.vue');

const cabinetRouteModule: AppRoute[] = [
  {
    path: '/cabinet',
    name: 'cabinet',
    component: Main,
    meta: {
      icon: 'ios-archive',
      title: '货柜'
    },
    children: [
      {
        path: 'statistics',
        name: 'cabinet-statistics',
        component: CabinetStatistics,
        meta: {
          icon: 'md-stats',
          title: '货柜统计'
        }
      },
      {
        path: 'cabinet-list',
        name: 'cabinet-list',
        component: CabinetList,
        meta: {
          icon: 'md-albums',
          title: '货柜管理'
        },
        props: true
      },
      {
        path: 'cabinet-detail/:id',
        name: 'cabinet-detail',
        component: CabinetDetail,
        meta: {
          icon: 'md-albums',
          title: '货柜详情',
          hideInMenu: true
        },
        props: true
      },
      {
        path: 'cabinet-type-list',
        name: 'cabinet-type-list',
        component: CabinetTypeList,
        meta: {
          icon: 'md-albums',
          title: '柜体管理'
        },
        props: true
      },
      {
        path: 'cabinet-type-detail/:id',
        name: 'cabinet-type-detail',
        component: CabinetTypeDetail,
        meta: {
          icon: 'md-albums',
          title: '柜体详情',
          hideInMenu: true
        },
        props: true
      }
    ]
  }
];

export default cabinetRouteModule;
