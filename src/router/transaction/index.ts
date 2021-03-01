import { AppRoute } from '@/router/routers';
import Main from "@/components/main/Index.vue";

const TransactionStatistics = () => import('@/view/transaction/Statistics.vue');
const TransactionList = () => import('@/view/transaction/List.vue');
const TransactionDetail = () => import('@/view/transaction/Detail.vue');

const transactionRouteModule: AppRoute[] = [
  {
    path: '/transaction',
    name: 'transaction',
    component: Main,
    meta: {
      icon: 'logo-usd',
      title: '交易',
      showAlways: true
    },
    children: [
      {
        path: 'statistics',
        name: 'transaction-statistics',
        component: TransactionStatistics,
        meta: {
          icon: 'md-stats',
          title: '交易统计'
        }
      },
      {
        path: 'list',
        name: 'transaction-list',
        component: TransactionList,
        meta: {
          icon: 'md-albums',
          title: '交易管理'
        }
      },
      {
        path: 'detail/:id',
        name: 'transaction-detail',
        component: TransactionDetail,
        meta: {
          icon: 'md-albums',
          title: '交易详情',
          hideInMenu: true
        },
        props: true
      }
    ]
  }
];

export default transactionRouteModule;
