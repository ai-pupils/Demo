<template lang="pug">
  section
    GoBack
    Card
      Spin(size='large' fix v-if='isFetching')
      h6.clearfix(slot='title', style='line-height: 30px')
        span 商品包装详情
        .fr(v-if="tabName === 'appearancesInfo'")
          Button.ml5(type="primary", @click="appearancesInfoSubmitHandle", :loading="submitLoading") 提交
      TabsBox(v-model="tabName", :tabs="tabs")
        template(slot="appearancesInfo")
          AppearancesInfo(ref="AppearancesInfoRef", v-show="tabName === 'appearancesInfo'", :data="stateData", @reload="reload")
        template(slot="supportCabinet")
          SupportCabinetInfo(v-show="tabName === 'supportCabinet'", :state="state")
</template>

<script lang="ts">
import Component, { mixins } from 'vue-class-component';
import { TabPaneType } from '@/components/shared/TabsBox.vue';
import { Prop } from 'vue-property-decorator';
import SupportCabinetInfo from './components/SupportCabinetInfo.vue';
import AppearancesInfo from './components/AppearancesInfo.vue';
import TabsBox from '@/components/shared/TabsBox.vue';
import GoBack from '@/components/shared/GoBack.vue';
import LoadPageMixin, { LoadPageMixinInstance } from '@/mixins/loadPage';
import { DefaultApiType } from '@/interface';
import { getSkuAppearances$, GetSkuAppearancesParams } from '@/api/sku';
import { finalize, mergeMap } from 'rxjs/operators';

@Component({
  components: { GoBack, TabsBox, SupportCabinetInfo, AppearancesInfo }
})
export default class SkuDetail extends mixins(LoadPageMixin)
  implements LoadPageMixinInstance {
  @Prop() id!: string;
  defaultApi: DefaultApiType = getSkuAppearances$;
  defaultParams: GetSkuAppearancesParams = {
    id: this.id
  };
  fetchOnce: boolean = true;
  tabName: string = 'appearancesInfo';
  tabs: TabPaneType[] = [
    { label: '商品包装', name: 'appearancesInfo' },
    { label: '支持柜体', name: 'supportCabinet' }
  ];
  submitLoading: boolean = false;

  transformParams(params: any) {
    return params;
  }

  appearancesInfoSubmitHandle() {
    const AppearancesInfoRef = this.$refs[
      'AppearancesInfoRef'
    ] as AppearancesInfo;
    this.submitLoading = true;
    AppearancesInfoRef.submit()
      .pipe(
        finalize(() => {
          this.submitLoading = false;
        })
      )
      .subscribe({
        next: ({ isFulfill }) => {
          if (isFulfill) {
            this.$Message.success('保存成功');
          }
        }
      });
  }

  reload(params: any) {
    this.loadDefaultApi({ ...params });
  }
}
</script>
