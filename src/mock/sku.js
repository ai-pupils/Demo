// import Mock from 'mockjs';

export function getSkus() {
  return {
    status: 0,
    data: {
      error_code: 200,
      paging: {
        page_index: 0,
        page_size: 20,
        search_text: '',
        sort_by: 'id',
        sort_direction: 'up',
        total: 508
      },
      results: [
        {
          id: 46,
          creator_id: 3088,
          barcode: '6907992513249',
          barcode_type: 'standard',
          package_type: 'BOTTLE',
          status: 'offline',
          created_at: '2018-09-29 19:53:25',
          owner_id: 2014,
          name: '智利蓝莓',
          url:
            'http://rai-console.malongtech.cn/sku/images/84a815cd-7c4e-4cdd-b731-88368a19f2b2.jpg.fl',
          weight: 33452
        }
      ]
    }
  };
}
