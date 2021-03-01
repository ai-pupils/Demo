<template lang="pug">
  div.page-content
    Card
      h6(slot="title") 上新指南管理
      div.text-right
        Button(type="primary", @click="toggleIsShowCreateModal(true)")
          | 创建新指南
      TableBox(:state='state', dataKey="data")
        Column(prop="id", label='指南 ID', :width="100")
        Column(prop="name", label='指南名称')
        Column(label="当前状态", prop="status", align="center", :width="120")
          template(slot-scope="{row}")
            DataTag(:value="row.status" :dataMap="GUIDE_STATUS")
        Column(label="最后更新时间", align="center", :width="200")
          template(slot-scope="{row}")
                | {{row.updated_at | fmtLocalTime}}
        Column(label="操作", align="center", :width="120")
          template(slot-scope="{row}")
            Button(type="primary",
              :to="{name: 'v2-guide-detail', params: {id: row.id}}")
              | 查看指南
      PaginationBox(:total='dataTotal', :isFetching='state.isFetching')
    Modal(v-model='isShowCreateModal', @on-ok='create', @on-cancel="toggleIsShowCreateModal(false)")
      div(slot='header') 创建新指南
      Form(:label-width='100', ref='nameForm', :model='form').create-form
        FormItem(label='指南名称', prop="name", required)
          Input(v-model="form.name")
</template>

<script lang="ts">
import Component, {mixins} from 'vue-class-component';
import LoadPageMixin, {LoadPageMixinInstance} from '@/mixins/loadPage';
import { getIngressionGuides$, GetIngressionGuidesParams, postNewIngressionGuide$, PostNewIngressionGuideParams } from '@/api/v2/skus';
import { DefaultApiType } from '@/interface';
import PaginationBox from '@/components/shared/PaginationBox.vue';
import TableBox from '@/components/shared/TableBox.vue';
import { State } from 'vuex-class';
import {GUIDE_STATUS} from '@/const/data/v2/ingression.ts';
import DataTag from '@/components/shared/DataTag.vue'

@Component({
  components: { PaginationBox, TableBox, DataTag },
})
export default class Statistics extends mixins(LoadPageMixin)
  implements LoadPageMixinInstance {
  @State('profile') user!: any;
  dataTotal: number = 0;
  isShowCreateModal: boolean = false;
  get GUIDE_STATUS() {
    return GUIDE_STATUS
  }
  form: any = {
    name: '',
  };
  defaultParams: GetIngressionGuidesParams = {
    pageIndex: 1,
    pageSize: Number(process.env.PAGE_SIZE),
  };
  defaultApi: DefaultApiType = getIngressionGuides$;

  transformParams(params: GetIngressionGuidesParams) {
    return params;
  }
  create() {
    (this.$refs.nameForm as any).validate((valid: boolean) => {
      if (valid) {
        const params : PostNewIngressionGuideParams = {
          ...this.form,
          creator: this.user.payload.data.account
        }
        postNewIngressionGuide$(params).subscribe(state => {
          if(!state.isError) {
            this.$Message.success('创建新指南成功！');
            this.$router.push({name: 'v2-guide-detail', params: {id: state.payload.data.data.id}})
          }
        })
      } else {
        this.$Message.error('Fail!');
      }
    })
  }
  toggleIsShowCreateModal(flag: boolean) {
    this.isShowCreateModal = flag
  }
}

</script>
<style lang="less" scoped>
.create-form {
  width: 400px;
}
</style>
