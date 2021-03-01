import { Observable } from 'rxjs';

declare type Paging = {
  page_index: number;
  page_size: number;
  total: number;
};

export type DefaultApiType<P = any, R = any> = (params: P) => Observable<R>;

export interface DefaultDataResponse<T = any> {
  data: T;
  status: number;
}

export interface DataResponse<T = any> {
  data: {
    results: T;
  };
  status: number;
}

export interface DataListResponse<T = any, P extends Paging = Paging>
  extends DataResponse<T[]> {
  data: {
    paging?: P;
    results: T[];
  };
}

export interface MetaType<T = any> {
  payload: T | undefined | null;
  isFulfill: boolean;
  isError: boolean;
  isFetching: boolean;
  error: any;
}

export interface StateDefaultData<T> extends MetaType<T>{}

export interface StateData<T> extends MetaType<DataResponse<T>> {}

export interface StateListData<T> extends MetaType<DataListResponse<T>> {}

export interface SearchParamsSchema {
  pageIndex?: number;
  pageSize?: number;
  sortBy?: string;
  sortDirection?: string;
  keyword?: string;
}

export type PageType = {
  pageIndex?: number;
  pageSize?: number;
};

export type SortType = {
  order_by?: string;
};

export interface ConstDataType {
  [key: string]: {
    label: string;
    color?: any;
    tagType?: "info" | "danger" | "success" | "warning";
  };
}
