<template lang="pug">
  section
    .header
      h3 已添加货柜数：{{selectCabinets.length}}
      .btn-group
        Button.ml10(@click="preStepHandle", v-if="!isExist") 上一步
        Button.ml10(v-else v-show="canEdit", @click="cancelEdit") 取消
        Button.ml10(:disabled="selectCabinets.length === 0", v-if="canEdit", type="primary",
            @click="confirm", :loading="isFetching") 预览
        Button.ml10(v-if="!canEdit", type="primary", @click="canEdit=true", :loading="isLoading") 编辑
    Divider
    Form.search
      FormItem
        Input(v-model='searchSchema.keyword', placeholder='货柜ID/货柜名称/箱体编号/商品组ID/商户ID', style='width: 400px; margin-right: 5px;')
        Select(v-model='searchSchema.status', placeholder='货柜运营状态', style='width:250px; margin-right: 5px;', clearable)
          Option(v-for='item in CabinetStatusTypes', :value='item.id', :key='item.id') {{ item.label }}
        Select(v-model='searchSchema.runtimeStatus', placeholder='货柜运行状态', style='width:250px; margin-right: 5px;', clearable)
          Option(v-for='item in CabinetRuntimeStatusTypes', :value='item.id', :key='item.id') {{ item.label }}
        Button(icon='ios-search', type='primary', html-type='submit', :loading='state.isFetching || isLoading', @click.prevent='search') 查询
    cabinet-table(:cabinets="cabinets", :canEdit="canEdit")
    confirm-modal(ref="confirmModal", @next="CreateCabinetGroup")
    PaginationInnerBox(ref="PaginationInnerBox", :total='canEdit ? dataTotal: (cabinetsTotal || 0)', :isFetching="isFetching",
      @pageChange="pageChange", @sizeChange="pageChange")
</template>

<script lang="ts">
import Component, { mixins } from 'vue-class-component';
import LoadPageMixin, { LoadPageMixinInstance } from '@/mixins/loadPage';
import SearchMixin, { SearchMixinInstance } from '@/mixins/search';
import { getCabinets$, GetCabinetParams } from '@/api/cabinet';
import PaginationBox from '@/components/shared/PaginationBox.vue';
import TableBox from '@/components/shared/TableBox.vue';
import CabinetTable from '@/view/cabinet-group/components/CabinetTable.vue';
import { Getter, Mutation } from 'vuex-class';
import ConfirmModal from '@/view/cabinet-group/components/ConfirmModal.vue';
import _ from 'lodash';
import {
  CabinetStatusTypes,
  CabinetRuntimeStatusTypes
} from '@/const/data/cabinet';
import { Prop, Watch } from 'vue-property-decorator';
import { DefaultApiType, MetaType } from '@/interface';
import { map, observeOn, take } from 'rxjs/operators';
import { routerPushWithQuery } from '@/utils/observables';
import { asyncScheduler, of } from 'rxjs';
import { createEmptyTrackMeta } from '@/utils/misc';
import PaginationInnerBox from '@/components/shared/PaginationInnerBox.vue';

@Component({
  components: {
    CabinetTable,
    PaginationBox,
    TableBox,
    ConfirmModal,
    PaginationInnerBox
  }
})
export default class AddCabinet extends mixins(LoadPageMixin, SearchMixin)
  implements LoadPageMixinInstance, SearchMixinInstance {
  @Prop() isExist!: boolean; // 是否是已经存在的货柜组
  @Prop() existCabinets!: any; // 已经存在的货柜组中的柜子
  @Prop() cabinetsTotal!: number; // 已存在的货柜组柜子条数
  @Prop() isLoading!: boolean; // 当批量操作货柜组时，编辑按钮显示loading
  canEdit = false;
  @Getter('cabinetGroup/cabinets') selectCabinets!: any[];
  @Mutation('cabinetGroup/clearCabinets') clearCabinets!: any;
  @Mutation('cabinetGroup/setCabinets') setCabinets!: any;
  CabinetStatusTypes: any = CabinetStatusTypes;
  CabinetRuntimeStatusTypes: any = CabinetRuntimeStatusTypes;
  defaultApi() {
    if (this.canEdit) {
      return getCabinets$({ ...this.defaultParams, ...this.searchSchema });
    }
    return this.emptyState;
  }
  defaultParams: GetCabinetParams = {
    pageIndex: 1,
    pageSize: Number(process.env.PAGE_SIZE)
  };
  searchSchema: any = {
    ...this.defaultParams,
    keyword: undefined,
    status: undefined,
    runtimeStatus: undefined
  };
  internalSearch = true;
  transformParams(params: GetCabinetParams) {
    return params;
  }

  get emptyState() {
    return of<MetaType>(createEmptyTrackMeta()).pipe(
      observeOn(asyncScheduler),
      map((state: any) => {
        state.isFulfill = true;
        state.isFetching = false;
        state.payload = { data: { count: 0 } };
        return state;
      })
    );
  }

  created() {
    if (this.existCabinets) {
      this.existCabinets.forEach((e: any) => {
        e.is_selected = true;
        this.setCabinets({ name: 'single', row: { ...e } });
      });
    }
  }

  @Watch('isExist', { immediate: true })
  isExistChanged(val: boolean) {
    // 如果已经存在货柜组，则是查看，默认不可编辑
    this.canEdit = !val;
  }

  @Watch('canEdit')
  canEditChanged(val: boolean) {
    this.searchSchema = {
      pageIndex: 1,
      pageSize: Number(process.env.PAGE_SIZE)
    };
    (this.$refs.PaginationInnerBox as any).init();
    this.search();
  }

  // 获取本页所有货柜
  get cabinets() {
    if (this.canEdit) {
      if (this.isFulfill) {
        return this.state.payload!.data.results.map((e: any) => {
          const cabinet = _.find(this.selectCabinets, ['id', e.id]);
          if (cabinet) {
            e.is_selected = true;
          } else {
            e.is_selected = false;
          }
          return e;
        });
      }
      return [];
    } else {
      const start =
        (this.searchSchema.pageIndex - 1) * this.searchSchema.pageSize;
      const end = this.searchSchema.pageIndex * this.searchSchema.pageSize;
      return this.existCabinets.slice(start, end);
    }
  }

  get cabinetIds() {
    return this.selectCabinets.map((c: any) => c.id);
  }

  CreateCabinetGroup() {
    this.showLoading(true);
    this.$emit('next', {
      cabinet_ids: this.cabinetIds
    });
  }

  showLoading(loading: boolean) {
    (this.$refs.confirmModal as any).showLoading(loading);
  }

  preStepHandle() {
    this.$router.replace({
      name: 'cabinet-group-create',
      query: { ...this.$route.query, step: '0' }
    });
  }

  colseModal() {
    this.showLoading(false);
    (this.$refs.confirmModal as any).cancel();
  }

  confirm() {
    (this.$refs.confirmModal as ConfirmModal).open();
  }

  cancelEdit() {
    this.canEdit = false;
    this.clearCabinets();
    this.setCabinets({
      name: 'all',
      rows: this.existCabinets
    });
  }

  search() {
    (this.$refs.PaginationInnerBox as any).init();
    this.searchSchema.pageIndex = 1;
    if (!this.canEdit) {
      this.$emit('search', this.searchSchema);
    } else {
      this.loadDefaultApi({ ...this.searchSchema });
    }
  }

  pageChange(page: any) {
    this.searchSchema.pageIndex = page.pageIndex;
    this.searchSchema.pageSize = page.pageSize;
    if (this.canEdit) {
      this.loadDefaultApi({ ...this.searchSchema });
    }
  }

  beforeDestroy() {
    this.clearCabinets();
  }
}
</script>

<style scoped>
.header {
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
}
</style>
