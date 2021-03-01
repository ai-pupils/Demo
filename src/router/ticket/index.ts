import { AppRoute } from '@/router/routers';
import Main from '@/components/main/Index.vue';

const TicketList = () => import('@/view/ticket/Index.vue');
const TicketDetail = () => import('@/view/ticket/components/TicketDetail.vue');

const ticketRouteModule: AppRoute[] = [
  {
    path: "/ticket",
    name: "ticket",
    component: Main,
    meta: {
      title: "工单",
      icon: " fa fa-list-alt",
      showAlways: true
    },
    children: [
      {
        path: "list",
        name: "ticket-list",
        meta: {
          title: "工单管理",
          icon: 'md-albums'
        },
        component: TicketList,
        props: true
      },
      {
        path: "detail/:id",
        name: "ticket-detail",
        meta: {
          title: "处理工单",
          icon: 'md-albums',
          hideInMenu: true
        },
        component: TicketDetail,
        props: true
      }
    ]
  }
];

export default ticketRouteModule;
