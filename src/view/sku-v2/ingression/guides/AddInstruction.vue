<template lang="pug">
  Card(title="添加关联指令", :bordered="false", dis-hover)
    Form.search(:inline="true")
      FormItem.form-item
        Input(v-model="searchSchema.keyword", placeholder="指令名称/指令内容/指令ID", style="width: 200px")
      Button(icon="ios-search" type="primary" html-type="submit" :loading="isFetching" @click.prevent="search")
        |  查询
    InstructionsTable(:state="state").instruction-list
      template(slot="operation" slot-scope="scope")
        template(v-if="currentData.indexOf(scope.info.id) < 0")
          Button(type="primary", icon="md-add-circle", @click="onClick(scope.info.id)")
            | 关联
        p(v-else)
          | 已经关联
    PaginationBox(:total='dataTotal', :isFetching='state.isFetching')
</template>
<script lang="ts">
import Vue from 'vue'
import Component, {mixins} from 'vue-class-component';
import LoadPageMixin, {LoadPageMixinInstance} from '@/mixins/loadPage';
import SearchMixin, {SearchMixinInstance} from '@/mixins/search';
import { DefaultApiType } from '@/interface';
import {
  getIngressionInstructions$,
  GetIngressionInstructionsParams
 } from '@/api/v2/skus';
import InstructionsTable from '../instructions/InstructionsTable.vue';
import PaginationBox from '@/components/shared/PaginationBox.vue';
import { Prop } from 'vue-property-decorator';

@Component({
  components: {InstructionsTable, PaginationBox}
})
export default class AddInstructions extends mixins(LoadPageMixin, SearchMixin)
  implements LoadPageMixinInstance, SearchMixinInstance {
    @Prop({required: false, type: Array, default: (() => [])})
    currentData!: Array<number>;
    dataTotal: number = 0;
    defaultApi: DefaultApiType = getIngressionInstructions$;
    defaultParams: GetIngressionInstructionsParams= {
      pageIndex: 1,
      pageSize: Number(process.env.PAGE_SIZE),
    };
    searchSchema:any = {
      ...this.defaultParams,
      keyword: ''
    }
    onClick(id: number) {
      this.$emit('onAdd', id)
    }
    transformParams(params: GetIngressionInstructionsParams) {
      return params;
    }
    search() {
      this.doSearch()
    }
  }
</script>
<style lang="less" scoped>
.instruction-list{
  max-height: 650px;
  overflow-y: auto;
  margin-bottom: 15px;
}
</style>
