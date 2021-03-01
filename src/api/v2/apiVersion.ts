export const apiPrefix = '/v2';

interface searchParams {
  pageIndex?: number;
  pageSize?: number;
  sortBy?: string;
  sortDirection?: string;
  keyword?: string;
}

export interface searchParamsV2 {
  page_index?: number;
  page_size?: number;
  order_by?: string;
  query?: string;
}

export const fixParams = (params: searchParams) => {
  let p: searchParamsV2 = {};

  const { pageIndex, pageSize, sortBy, sortDirection, keyword } = params;
  if (pageIndex) {
    p.page_index = Number(pageIndex - 1);
  }
  if (pageSize) {
    p.page_size = Number(pageSize);
  }
  if (sortBy && sortDirection) {
    p.order_by = `${sortBy} ${sortDirection === 'down' ? 'desc' : 'asc'}`;
  }
  if (keyword) {
    p.query = String(keyword).trim();
  }
  return p;
};
