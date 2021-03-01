import { AppRoute } from '@/router/routers';
import Main from '@/components/main/Index.vue';

const Home = () => import('@/view/home/Index.vue');
const MonitorExceptionList = () => import('@/view/monitor/exception/Index.vue');
const MonitorRecognitionList = () =>
  import('@/view/monitor/recognition/Index.vue');
const LicenseList = () => import('@/view/license/index.vue');
const LicenseDetail = () => import('@/view/license/components/Detail.vue');

const monitorRouteModule: AppRoute[] = [
  {
    path: '/monitor',
    name: 'monitor',
    component: Main,
    meta: {
      icon: ' fa fa-dashboard',
      title: '监控统计',
      showAlways: true
    },
    children: [
      {
        path: '/index',
        name: 'index',
        component: Home,
        meta: {
          title: '设备监控',
          icon: 'md-home'
        }
      },
      {
        path: '/exception/list',
        name: 'monitor-exception-list',
        component: MonitorExceptionList,
        meta: {
          icon: ' fa fa-exclamation-triangle',
          title: '异常监控'
        }
      },
      {
        path: '/recognition/list',
        name: 'monitor-recognition-list',
        component: MonitorRecognitionList,
        meta: {
          icon: 'md-stats',
          title: '准确率统计'
        }
      },
      {
        path: '/license/list',
        name: 'license-list',
        component: LicenseList,
        meta: {
          icon: 'md-albums',
          title: 'License监控'
        }
      },
      {
        path: 'license/detail/:lkey',
        name: 'license-detail',
        component: LicenseDetail,
        meta: {
          icon: 'md-albums',
          title: 'License详情',
          hideInMenu: true
        },
        props: true
      }
    ]
  }
];

export default monitorRouteModule;
