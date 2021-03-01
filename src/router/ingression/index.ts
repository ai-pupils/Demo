import { AppRoute } from '@/router/routers';
import Main from '@/components/main/Index.vue';

const IngressionTasks = () =>
  import('@/view/sku-v2/ingression/Tasks.vue');
const IngressionJobs = () =>
  import('@/view/sku-v2/ingression/JobsTable.vue');
const IngressionGuides = () =>
  import('@/view/sku-v2/ingression/guides/Index.vue')
const IngressionGuideDetail = () =>
  import('@/view/sku-v2/ingression/guides/Detail.vue')
const IngressionGuideDispatch = () =>
  import('@/view/sku-v2/ingression/dispatch/Index.vue')
const IngressionExperimentalGuideDispatch = () =>
  import('@/view/sku-v2/ingression/experiment/Index.vue')
const IngressionInstructions = () =>
  import('@/view/sku-v2/ingression/instructions/Index.vue')

const ingressionRouteModule: AppRoute[] = [
  {
    path: '/v2/ingression',
    name: '_v2_ingression',
    component: Main,
    meta: {
      icon: ' fa fa-database',
      title: '上新',
      showAlways: true
    },
    children: [
      {
        path: 'tasks',
        component: IngressionTasks,
        name: 'v2-sku-ingression-list',
        meta: { icon: 'md-albums', title: '上新审核' },
        props: true
      },
      {
        path: 'jobs',
        component: IngressionJobs,
        name: 'sku-ingression-jobs',
        meta: {title: '商品相关任务', icon: ' fa fa-tasks', hideInMenu: true},
        props: true
      },
      {
        path: 'guides',
        component: IngressionGuides,
        name: 'v2-guides-list',
        meta: { icon: 'md-list', title: '指南管理' },
        props: true
      },
      {
        path: 'instructions',
        component: IngressionInstructions,
        name: 'v2-instructions',
        meta: {title: '指令管理', icon: ' fa fa-tasks'},
        props: true
      },
      {
        path: 'guides_disaptch',
        component: IngressionGuideDispatch,
        name: 'v2-guide-dispatch',
        meta: { icon: 'md-list', title: '指南激活' },
        props: true
      },
      {
        path: 'experimental_guides_disaptch',
        component: IngressionExperimentalGuideDispatch,
        name: 'v2-experimental-guide-dispatch',
        meta: { icon: 'md-list', title: '实验指南激活' },
        props: true
      },
      {
        path: 'guides/:id',
        component: IngressionGuideDetail,
        name: 'v2-guide-detail',
        meta: {title: '指南详情', icon: ' fa fa-tasks', hideInMenu: true},
        props: true
      }
    ]
  }
];

export default ingressionRouteModule;
