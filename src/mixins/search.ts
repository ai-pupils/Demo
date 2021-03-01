import Vue from 'vue';
import _ from 'lodash';
import Component from 'vue-class-component';
import {
  getRouteQuery,
  routerPushWithQuery,
  queryChange$
} from '@/utils/observables';
import { Watch } from 'vue-property-decorator';
import moment from 'moment';

export interface SearchMixinInstance extends Vue {
  searchSchema: { [key: string]: any; from?: string; to?: string };
  defaultParams?: any;
  queryDateRange?: Date[];
  routeAction?: 'push' | 'replace';
  internalSearch?: boolean;
  transformSearchParams?: (params: any) => any;
}

@Component
export default class SearchMixin extends Vue {
  cached: any = {
    from: undefined,
    to: undefined
  };
  routeAction: any = 'push';
  created(this: any) {
    queryChange$(this).subscribe((query: any) => {
      this.initSearchSchema(query);
    });
  }

  mounted(this: any) {
    const query: any = getRouteQuery(this);
    this.initSearchSchema(query);
  }

  @Watch('queryDateRange')
  queryDateRangeChange(this: SearchMixinInstance, [from, to]: any) {
    if (from && to) {
      this.searchSchema.from = moment(from).format('YYYY-MM-DD');
      this.searchSchema.to = moment(to).format('YYYY-MM-DD');
    }
  }

  @Watch('queryDateTimeRange')
  queryDateTimeRangeChange(this: SearchMixinInstance, [from, to]: any) {
    if (from && to) {
      this.searchSchema.from = moment(from).format('YYYY-MM-DD HH:mm:ss');
      this.searchSchema.to = moment(to).format('YYYY-MM-DD HH:mm:ss');
    }
  }

  private initSearchSchema(this: SearchMixinInstance, query: any) {
    Object.keys(this.searchSchema).forEach((key: string | any[]) => {
      if (typeof key === 'string') {
        if (!_.isNil(query[key]) && query[key] !== '') {
          if (query[key] === 'true' || query[key] === 'false') {
            this.$set(this.searchSchema, key, query[key] === 'true');
          } else {
            this.$set(this.searchSchema, key, query[key]);
          }
        }
      } else if (key instanceof Array) {
        key.forEach(k => {
          this.$set(this.searchSchema, k, query[k]);
        });
      }
    });
  }

  public resetSearchSchema(this: SearchMixinInstance) {
    const query = getRouteQuery(this);

    if (Object.keys(query).length === 0) {
      return;
    }
    this.$router.push({
      query: {
        ...this.defaultParams
      }
    });
  }

  public doSearch(this: SearchMixinInstance | any) {
    let defaultParams: any = { ...this.searchSchema, pageIndex: 1 };
    let queryParams: any;
    const timestamp = Date.now();

    if (typeof this.transformSearchParams === 'function') {
      queryParams = { ...this.transformSearchParams(defaultParams) };
    } else {
      queryParams = { ...defaultParams };
    }

    if (this.internalSearch) {
      this.cached.from = this.searchSchema.from;
      this.cached.to = this.searchSchema.to;

      if ((this as any).loadDefaultApi) {
        (this as any).loadDefaultApi({ ...queryParams });
      } else {
        throw new Error('loadDefaultApi is defined');
      }
      return;
    }
    routerPushWithQuery(
      this,
      { ...queryParams, _t: timestamp },
      this.routeAction === 'push'
    );
  }

  public sortChange(this: any, params: any) {
    const p: any = { pageIndex: 1, ...params };
    if (_.isNil(params.sortBy)) {
      p.sortBy = this.defaultParams.sortBy;
      p.sortDirection = this.defaultParams.sortDirection;
    }
    if (this.internalSearch) {
      if (this.cached.from && this.cached.to) {
        p.from = this.cached.from;
        p.to = this.cached.to;
      }
      if (this.loadDefaultApi) {
        this.loadDefaultApi({ ...p });
      }
      return;
    }
    routerPushWithQuery(
      this,
      {
        pageIndex: 1,
        ...params
      },
      this.routeAction === 'push'
    );
  }
}
