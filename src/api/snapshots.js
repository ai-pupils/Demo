import rxios from '@/utils/rxios';
import buildRequest from '@/utils/buildRequest';

const SNAOSHOTS = '/snapshots.fl';
const SNAOSHOT = (id) => `/snapshots/cabinets/${id}.fl`;

// 获取货柜快照
export const getSnapshots$ = buildRequest(params => {
  const {
    sortBy,
    sortDirection,
    pageIndex,
    pageSize,
    searchText,
    from,
    to,
    snapshotId,
    cabinetId,
    modelId
  } = params;
  return rxios.request({
    url: SNAOSHOTS,
    method: 'GET',
    params: {
      sort_by: sortBy,
      sort_direction: sortDirection,
      page_index: pageIndex,
      page_size: pageSize,
      search_text: searchText,
      from,
      to,
      snapshot_id: snapshotId,
      cabinet_id: cabinetId,
      model_id: modelId
    }
  });
});

// 生成货柜快照
export const postSnapshot$ = buildRequest(id =>
  rxios.request({
    url: SNAOSHOT(id),
    method: 'POST'
  })
);
