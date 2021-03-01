// import Mock from 'mockjs';

export function getAnomalies() {
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
          cabinet_id: 41,
          id: '41_1541731453',
          manager_cabinet_id: '00455fc0594846e69b0bd770a7c81b8a',
          start_reason_code: '10001',
          status: 'waiting',
          status_start_time: '2018-11-09T10:44:13',
          trx_id: 55879
        },
        {
          cabinet_id: 41,
          id: '41_1542866290',
          manager_cabinet_id: '00455fc0594846e69b0bd770a7c81b8a',
          start_reason_code: '20000',
          status: 'waiting',
          status_start_time: '2018-11-22T13:58:10',
          trx_id: 55888
        }
      ]
    }
  };
}
