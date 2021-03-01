import { AppRoute } from '@/router/routers';
import Main from '@/components/main/Index.vue';

const CabinetGroupList = () => import('@/view/cabinet-group/index.vue');
const CabinetGroupCreate = () => import('@/view/cabinet-group/components/Create.vue');
const CabinetGroupDetail = () => import('@/view/cabinet-group/components/Detail.vue');

export const skuBundleRouteModule: AppRoute[] = [
  {
    path: '/cabinet-group',
    name: 'cabinet-group',
    component: Main,
    meta: {
      icon: 'ios-calendar', // todo fix icon
      title: '货柜组',
      showAlways: true
    },
    children: [
      {
        path: 'list',
        name: 'cabinet-group-list',
        component: CabinetGroupList,
        meta: {
          icon: 'md-albums',
          title: '货柜组管理'
        }
      },
      {
        path: 'create',
        name: 'cabinet-group-create',
        component: CabinetGroupCreate,
        meta: {
          icon: 'md-albums',
          title: '新建商品组',
          hideInMenu: true
        },
        props: true
      },
      {
        path: 'detail/:id',
        name: 'cabinet-group-detail',
        component: CabinetGroupDetail,
        meta: {
          icon: 'md-albums',
          title: '货柜组详情',
          hideInMenu: true
        },
        props: true
      },
    ]
  }
];
export default skuBundleRouteModule;
