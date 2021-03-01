export default [
  {
    title: '首页',
    icon: 'home',
    to: {
      name: 'home'
    }
  },
  {
    title: '监控统计',
    icon: 'dashboard',
    children: [
      {
        to: {
          name: 'board-customers'
        },
        title: '客户统计'
      },
      {
        to: {
          name: 'board-transactions'
        },
        title: '交易统计'
      }
    ]
  },
  {
    title: '货柜管理',
    icon: 'paw',
    children: [
      {
        to: {
          name: 'cabinets'
        },
        title: '货柜列表'
      },
    ]
  },
  {
    title: '商品管理',
    icon: 'money',
    children: [
      {
        to: {
          name: 'sku-list',
        },
        title: '商品列表'
      },
      {
        to: {
          name: 'sku-ingression'
        },
        title: '上新审核'
      },
      {
        to: {
          name: 'sku-bundle-list',
        },
        title: '商品组列表'
      },
    ]
  },
  {
    title: '服务管理',
    icon: 'server',
    children: [
      {
        to: {
          name: 'service-common'
        },
        title: '服务列表'
      },
      {
        to: {
          name: 'service-training'
        },
        title: '训练队列'
      },
    ]
  },
  {
    title: '异常管理',
    icon: 'exclamation',
    children: [
      {
        to: {
          name: 'system-anomalies'
        },
        title: '系统异常'
      }
    ]
  },
];
