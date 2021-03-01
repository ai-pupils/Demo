<template lang="pug">
  Card(title="指令列表")
    Form.search(:inline="true")
      FormItem.form-item
        Input(v-model="searchSchema.keyword", placeholder="指令名称/指令内容/指令ID", style="width: 200px")
      Button(icon="ios-search" type="primary" html-type="submit" :loading="isFetching" @click.prevent="search")
        |  查询
    InstructionsTable(:state="state", @start-edit="startEdit")
    PaginationBox(:total='dataTotal', :isFetching='state.isFetching')
    Modal(:value="!!activeInstruction" :width="1300", @on-cancel="close", footer-hide)
      EditInstruction(v-if="activeInstruction", :info="activeInstruction", @cancel="close", @onChanged="onChanged")
</template>
<script lang="ts">
import Vue from 'vue'
import Component, {mixins} from 'vue-class-component';
import LoadPageMixin, {LoadPageMixinInstance} from '@/mixins/loadPage';
import SearchMixin, { SearchMixinInstance } from '@/mixins/search';
import { DefaultApiType } from '@/interface';
import {
  getIngressionInstructions$,
  GetIngressionInstructionsParams
 } from '@/api/v2/skus';
import InstructionsTable from './InstructionsTable.vue';
import EditInstruction from './EditInstruction.vue';
import PaginationBox from '@/components/shared/PaginationBox.vue';

@Component({
  components: {InstructionsTable, PaginationBox, EditInstruction}
})
export default class AllInstructions extends mixins(LoadPageMixin, SearchMixin)
  implements LoadPageMixinInstance, SearchMixinInstance {
    dataTotal: number = 0;
    defaultApi: DefaultApiType = getIngressionInstructions$;
    activeInstruction: null|object = null;
    defaultParams: GetIngressionInstructionsParams= {
      pageIndex: 1,
      pageSize: Number(process.env.PAGE_SIZE),
    };
    searchSchema: any = {
    ...this.defaultParams,
      keyword: ''
    }
    transformParams(params: GetIngressionInstructionsParams) {
      return params;
    }
    startEdit(instruction: object) {
      this.activeInstruction = instruction;
    }
    onChanged() {
      this.search();
    }
    close(){
      this.activeInstruction = null;
    }
    search() {
      this.doSearch();
    }
  }
</script>
