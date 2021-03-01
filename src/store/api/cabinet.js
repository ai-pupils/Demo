import axios from '@/utils/axios';

const CABINETS = '/cabinets.fl';
export const getCabinets = ({start, limit, sortBy = ['id', 'desc'], keyword = ''}) => {
  const params = {
    page_index: start,
    page_size: limit,
    search_text: keyword ? String(keyword).trim() : keyword,
    sort_by: sortBy[0],
    sort_direction: sortBy[1]
  };
  return axios.get(CABINETS, {params});
};
