<template lang="pug">
  div.page-content
    Card
      h6(slot="title") 上新任务统计列表
      Form.search(:inline="true")
        FormItem.form-item
          Input(v-model="searchSchema.keyword", placeholder="商品ID/商品名称/sku id", style="width: 200px")
        FormItem.form-item
          Select(v-model="searchSchema.status" placeholder="任务状态" style="width: 150px" filterable clearable)
            Option(v-for="item in taskStatus" :value="item.value" :key="item.value")
              | {{ item.label }}
        FormItem.form-item
          Select(v-model="searchSchema.visionId" placeholder="视觉ID" style="width: 150px" filterable clearable)
            Option(v-for="type in cabinetVisions" :value="type.id" :key="type.id")
              | {{ type.id }}（{{ type.name }}）
        Button(icon="ios-search" type="primary" html-type="submit" :loading="isFetching" @click.prevent="search")
          |  查询
      TasksTable(:state="state")
      PaginationBox(:total='dataTotal', :isFetching='state.isFetching')
</template>

<script lang="ts">
import _ from 'lodash';
import Component, {mixins} from 'vue-class-component';
import LoadPageMixin, {LoadPageMixinInstance} from '@/mixins/loadPage';
import SearchMixin, {SearchMixinInstance} from '@/mixins/search';
import { taskStatus } from '../../../const/data/skuIngression';
import {getCabinetTypes$} from '@/api/cabinet';
import {
  getSkuIngressionTasks$,
  GetSkuIngressionTasksParams
 } from '@/api/v2/skus';
import { DefaultApiType } from '@/interface';
import TasksTable from './TasksTable.vue';
import PaginationBox from '@/components/shared/PaginationBox.vue';

@Component({
  components: { TasksTable, PaginationBox },
})
export default class Statistics extends mixins(LoadPageMixin, SearchMixin)
  implements LoadPageMixinInstance, SearchMixinInstance {
  cabinetVisions: Array<any> = [];
  dataTotal: number = 0;
  taskStatus: any = taskStatus;
  defaultParams: GetSkuIngressionTasksParams = {
    pageIndex: 1,
    pageSize: Number(process.env.PAGE_SIZE),
  };
  searchSchema: any = {
    ...this.defaultParams,
    keyword: '',
    status: '',
    visionId: '',
  };
  defaultApi: DefaultApiType = getSkuIngressionTasks$;

  created() {
    this.getCabinetTypes();
  }

  getCabinetTypes() {
    getCabinetTypes$({}).subscribe(res => {
      const {payload: {data: { results }}} = res;
      if (results && !_.isEmpty(results)) {
        results.forEach((type: any) => {
          const _type = _.find(this.cabinetVisions, {id: type.vision_id});
          if (_type) {
            _type.name += `，${type.name}`;
          } else {
            this.cabinetVisions.push({
              id: type.vision_id,
              name: type.name
            });
          }
        });
      }
    });
  }

  search() {
    this.doSearch();
  }

  transformParams(params: GetSkuIngressionTasksParams) {
    return params;
  }
}

</script>
