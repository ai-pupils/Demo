<template lang="pug">
  .page-content
    GoBack
    Card
      h6(slot='title') License详情
      Row.info-title 基本信息
      Row.info-box
        Form(inline, :label-width='120', label-position='left')
          Col(span='8')
            FormItem(label='License ID：') {{license.id}}
          Col(span='8')
            FormItem(label='License有效时长：') {{`${license.cabinet_key_duration || '--'} 个月`}}
      Row.info-box
        Form(inline, :label-width='120', label-position='left')
          Col(span='8')
            FormItem(label='商户ID：') {{license.user_id | emptyText}}
          Col(span='8')
            FormItem(label='已激活Key数量：') {{license.used_count | emptyText}}
      Row.info-box
        Form(inline, :label-width='120', label-position='left')
          Col(span='8')
            FormItem(label='商户名称：') {{license.user_name | emptyText}}
          Col(span='8')
            FormItem(label='Key总数：') {{license.total_count | emptyText}}
      Row.info-title Cabinet Key明细
      CabinetKeyDetail(:lkey="lkey")
</template>
<script lang="ts">
import _ from 'lodash';
import GoBack from '@/components/shared/GoBack.vue';
import Component, { mixins } from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import LoadPageMixin, { LoadPageMixinInstance } from '@/mixins/loadPage';
import { DefaultApiType, MetaType } from '@/interface';
import SearchMixin, { SearchMixinInstance } from '@/mixins/search';
import { getLicense$ } from '@/api/v3/license';
import CabinetKeyDetail from './CabinetKeyDetail.vue';

@Component({
  components: {
    GoBack,
    CabinetKeyDetail
  }
})
export default class Deatail extends LoadPageMixin
  implements LoadPageMixinInstance {
  @Prop() lkey!: any;
  defaultApi: DefaultApiType = getLicense$;
  defaultParams: any = {
    pageIndex: 1,
    pageSize: Number(process.env.PAGE_SIZE),
    license_key: this.lkey
  };
  license: any = {};

  @Watch('state', { immediate: true })
  stateChanged(state: MetaType) {
    if (state.isFulfill) {
      const licenses = _.get(state, 'payload.data.results');
      this.license = licenses[0];
    }
  }

  transformParams(params: any) {
    return params;
  }
}
</script>

<style scoped>
</style>
