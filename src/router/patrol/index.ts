import { AppRoute } from '@/router/routers';
import Main from '@/components/main/Index.vue';

const List = () => import('@/view/patrol/List.vue');
const Detail = () => import('@/view/patrol/Detail.vue');
const Create = () => import('@/view/patrol/Create.vue');

const patrolModule: AppRoute[] = [
  {
    path: '/patrols',
    name: '_patrols',
    component: Main,
    meta: {
      icon: ' fa fa-th',
      title: '运营',
      showAlways: true
    },
    children: [
      {
        path: 'list',
        name: '_patrols_list',
        component: List,
        meta: {
          icon: 'md-albums',
          title: '货柜巡检'
        }
      },
      {
        path: 'detail/:id',
        name: '_patrols_detail',
        component: Detail,
        meta: {
          title: '巡检详情',
          hideInMenu: true
        },
        props: true
      },
      {
        path: 'create',
        name: '_patrols_create',
        component: Create,
        meta: {
          title: '新建巡检任务',
          hideInMenu: true
        }
      }
    ]
  }
];

export default patrolModule;
