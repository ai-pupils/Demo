import { AppRoute } from '@/router/routers';
import Main from '@/components/main/Index.vue';

const DealerList = () => import('@/view/dealer/List.vue');
const DealerDetail = () => import('@/view/dealer/Detail.vue');

const dealerRouteModule: AppRoute[] = [
  {
    path: '/dealer',
    name: 'dealer',
    component: Main,
    meta: {
      icon: 'md-people',
      title: '商户',
      showAlways: true
    },
    children: [
      {
        path: 'list',
        name: 'dealer-list',
        component: DealerList,
        meta: {
          icon: 'md-albums',
          title: '商户管理'
        }
      },
      {
        path: 'detail/:id',
        name: 'dealer-detail',
        component: DealerDetail,
        meta: {
          icon: 'md-albums',
          title: '商户详情',
          hideInMenu: true
        },
        props: true
      }
    ]
  }
];

export default dealerRouteModule;
