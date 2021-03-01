import Mock from 'mockjs';

export function postSnapshot() {
  return Mock.mock({
    data: {
      error_code: 200,
      message: 'operation successful',
      request_id: '@id',
      snapshot_id: '@id'
    },
    status: 0
  });
}

export function getSnapshot() {
  return Mock.mock({
    data: {
      error_code: 200,
      paging: {
        end_time: '2018-12-12T00:00:00',
        page_index: 0,
        page_size: 2,
        search_text: 'TM80F3D2664E100',
        sort_by: 'create_time',
        sort_direction: 'desc',
        start_time: '2018-12-10T00:00:00',
        total: 1
      },
      results: [
        {
          cabinet_id: 77,
          create_time: '2018-12-11T23:59:38',
          manager_cabinet_id: 'TM80F3D2664E100',
          model_id: 712,
          module_id: 3512,
          serial_id: 4403,
          snapshot: {
            layers: [
              {
                sku_nums: [
                  {
                    barcode: '4891028164456',
                    count: 1,
                    manager_sku_id: '',
                    name: '维他奶维他柠檬茶饮料250ml盒装',
                    sku_id: 171
                  },
                  {
                    barcode: '4891599338393',
                    count: 4,
                    manager_sku_id: '',
                    name: '加多宝凉茶310ml罐装',
                    sku_id: 174
                  },
                  {
                    barcode: '6901939621608',
                    count: 4,
                    manager_sku_id: '',
                    name: '可口可乐Coca - Cola汽水碳酸饮料330ml罐装',
                    sku_id: 173
                  },
                  {
                    barcode: '6911988019134',
                    count: 7,
                    manager_sku_id: '',
                    name: '达利园又一餐黑米紫薯粥360g罐装',
                    sku_id: 177
                  },
                  {
                    barcode: '6917878030623',
                    count: 6,
                    manager_sku_id: '',
                    name: '雀巢(Nestle)丝滑拿铁口味 即饮雀巢咖啡饮料268ml瓶装',
                    sku_id: 179
                  },
                  {
                    barcode: '6925303754112',
                    count: 2,
                    manager_sku_id: '',
                    name: '统一海之言柠檬口味500ml瓶装',
                    sku_id: 227
                  },
                  {
                    barcode: '6925303754884',
                    count: 1,
                    manager_sku_id: '',
                    name: '统一小茗同学冷泡茶冰橘绿茶480ml瓶装',
                    sku_id: 169
                  }
                ],
                snapshot: {
                  detect_results: [
                    'public_api/release/detected/snapshot/77_de2bab4c-fde3-11e8-ad43-0242ac18850c_1544601576160/snapshot_1.json'
                  ],
                  hybrid_detector_results_matched: true,
                  images: [
                    'http://img.zhangshangyuebing.com/ImageRecognition_image/2018/12/12/2018121215592526115/2018121215592526115_3_1__20181212_155935_842.jpg'
                  ],
                  index: 1
                }
              },
              {
                sku_nums: [
                  {
                    barcode: '6901939621608',
                    count: 4,
                    manager_sku_id: '',
                    name: '可口可乐Coca - Cola汽水碳酸饮料330ml罐装',
                    sku_id: 173
                  },
                  {
                    barcode: '6917878030623',
                    count: 1,
                    manager_sku_id: '',
                    name: '雀巢(Nestle)丝滑拿铁口味 即饮雀巢咖啡饮料268ml瓶装',
                    sku_id: 179
                  },
                  {
                    barcode: '6925303754884',
                    count: 3,
                    manager_sku_id: '',
                    name: '统一小茗同学冷泡茶冰橘绿茶480ml瓶装',
                    sku_id: 169
                  }
                ],
                snapshot: {
                  detect_results: [
                    'public_api/release/detected/snapshot/77_de2bab4c-fde3-11e8-ad43-0242ac18850c_1544601576160/snapshot_2.json'
                  ],
                  hybrid_detector_results_matched: true,
                  images: [
                    'http://img.zhangshangyuebing.com/ImageRecognition_image/2018/12/12/2018121215592526115/2018121215592526115_3_2__20181212_155935_873.jpg'
                  ],
                  index: 2
                }
              },
              {
                sku_nums: [
                  {
                    barcode: '4891028164456',
                    count: 1,
                    manager_sku_id: '',
                    name: '维他奶维他柠檬茶饮料250ml盒装',
                    sku_id: 171
                  },
                  {
                    barcode: '4891599338393',
                    count: 6,
                    manager_sku_id: '',
                    name: '加多宝凉茶310ml罐装',
                    sku_id: 174
                  },
                  {
                    barcode: '6901939621608',
                    count: 4,
                    manager_sku_id: '',
                    name: '可口可乐Coca - Cola汽水碳酸饮料330ml罐装',
                    sku_id: 173
                  },
                  {
                    barcode: '6911988019134',
                    count: 6,
                    manager_sku_id: '',
                    name: '达利园又一餐黑米紫薯粥360g罐装',
                    sku_id: 177
                  },
                  {
                    barcode: '6917878030623',
                    count: 7,
                    manager_sku_id: '',
                    name: '雀巢(Nestle)丝滑拿铁口味 即饮雀巢咖啡饮料268ml瓶装',
                    sku_id: 179
                  },
                  {
                    barcode: '6925303754112',
                    count: 2,
                    manager_sku_id: '',
                    name: '统一海之言柠檬口味500ml瓶装',
                    sku_id: 227
                  },
                  {
                    barcode: '6925303754884',
                    count: 2,
                    manager_sku_id: '',
                    name: '统一小茗同学冷泡茶冰橘绿茶480ml瓶装',
                    sku_id: 169
                  }
                ],
                snapshot: {
                  detect_results: [
                    'public_api/release/detected/snapshot/77_de2bab4c-fde3-11e8-ad43-0242ac18850c_1544601576160/snapshot_3.json'
                  ],
                  hybrid_detector_results_matched: true,
                  images: [
                    'http://img.zhangshangyuebing.com/ImageRecognition_image/2018/12/12/2018121215592526115/2018121215592526115_3_3__20181212_155935_890.jpg'
                  ],
                  index: 3
                }
              }
            ],
            total_sku_nums: [
              {
                barcode: '4891028164456',
                count: 2,
                manager_sku_id: '',
                name: '维他奶维他柠檬茶饮料250ml盒装',
                sku_id: 171
              },
              {
                barcode: '4891599338393',
                count: 10,
                manager_sku_id: '',
                name: '加多宝凉茶310ml罐装',
                sku_id: 174
              },
              {
                barcode: '6901939621608',
                count: 12,
                manager_sku_id: '',
                name: '可口可乐Coca - Cola汽水碳酸饮料330ml罐装',
                sku_id: 173
              },
              {
                barcode: '6911988019134',
                count: 13,
                manager_sku_id: '',
                name: '达利园又一餐黑米紫薯粥360g罐装',
                sku_id: 177
              },
              {
                barcode: '6917878030623',
                count: 14,
                manager_sku_id: '',
                name: '雀巢(Nestle)丝滑拿铁口味 即饮雀巢咖啡饮料268ml瓶装',
                sku_id: 179
              },
              {
                barcode: '6925303754112',
                count: 4,
                manager_sku_id: '',
                name: '统一海之言柠檬口味500ml瓶装',
                sku_id: 227
              },
              {
                barcode: '6925303754884',
                count: 6,
                manager_sku_id: '',
                name: '统一小茗同学冷泡茶冰橘绿茶480ml瓶装',
                sku_id: 169
              }
            ]
          },
          snapshot_id: '77_de2bab4c-fde3-11e8-ad43-0242ac18850c_1544601576160',
          udpate_time: '2018-12-11T23:59:38',
          user_id: 3528
        }
      ]
    },
    status: 0
  });
}
