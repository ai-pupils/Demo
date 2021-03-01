import rxios from '@/utils/rxios';
import buildRequest from '@/utils/buildRequest';

const TRAIN_TASKS = '/train-tasks.fl';
const TRAIN_TASK = (id: any) => `/train-tasks/${id}.fl`;

// 获取所有训练任务
export const getTrainTasks$ = buildRequest(params => {
  const { pageIndex, pageSize, keyword, bundleId, footprint } = params;

  return rxios.request({
    url: TRAIN_TASKS,
    method: 'GET',
    params: {
      page_index: Number(pageIndex - 1),
      page_size: Number(pageSize),
      search_text: keyword,
      bundle_id: bundleId,
      footprint
    }
  });
});

// 创建训练任务
export const postTrainTasks$ = buildRequest(params => {
  const { name, desc, dealerId, bundleId, modelId } = params;

  return rxios.request({
    url: TRAIN_TASKS,
    method: 'POST',
    data: {
      name,
      desc,
      dealer_id: dealerId,
      bundle_id: bundleId,
      model_id: modelId
    }
  });
});

// 获取某个训练任务
export const getTrainTask$ = buildRequest(id =>
  rxios.request({
    url: TRAIN_TASK(id),
    method: 'GET'
  })
);
