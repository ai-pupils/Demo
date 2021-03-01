<template lang="pug">
  Card(title="实验活动指南列表")
    Button(slot="extra", icon="md-add-circle", type="primary", @click="toggleAdding(true)")
      | 激活新指南
    TableBox(:state="state")
      Column(label='上新类型', align='center', prop='ingression_type_id', width="300")
      Column(label='视觉 ID', align='center', prop='vision_id', width="300")
      Column(prop='guide_id', align='left', label='活动指南')
        template(slot-scope="{row}")
          router-link(:to="{name: 'v2-guide-detail', params: {id: row.guide_id}}")
            | [{{row.guide_id }}]
          | {{row.guide_info ? row.guide_info.name : '无指南信息' }}
    Modal(:value="isAdding" :width="1000", footer-hide, @on-cancel="toggleAdding(false)")
      NewDispatch(v-if="isAdding", @cancel="toggleAdding(false)", @submit="addNewDispatch")
</template>
<script lang="ts">
import Component, {mixins} from 'vue-class-component';
import LoadPageMixin, {LoadPageMixinInstance} from '@/mixins/loadPage';
import { getExperimentalGuideDispatch$,
  newExperimentalGuideDispatch$,
  NewExperimentalGuideDispatchParams,
  getOneGuide$,
  GetOneIngressionGuideParams
 } from '@/api/v2/skus';
import { DefaultApiType } from '@/interface';
import TableBox from '@/components/shared/TableBox.vue';
import NewDispatch from '../dispatch/NewDispatch.vue';
import {GUIDE_STATUS_CONFIRMED} from '@/const/data/v2/ingression'

@Component({
  components: { TableBox, NewDispatch },
})
export default class Dispatch extends mixins(LoadPageMixin)
  implements LoadPageMixinInstance {
  isAdding: boolean = false
  defaultParams = {}
  defaultApi: DefaultApiType = getExperimentalGuideDispatch$;
  transformParams(params: any) {
    return params;
  }
  toggleAdding(flag: boolean) {
    this.isAdding = flag;
  }
  addNewDispatch(formData: NewExperimentalGuideDispatchParams) {
    const {guideId} = formData
    getOneGuide$({guideId}).subscribe(state => {
      if(!state.isError) {
        const info = (state.payload as any).data.data;
        if(info.status === GUIDE_STATUS_CONFIRMED) {
          newExperimentalGuideDispatch$(formData).subscribe(state => {
            if(!state.isError) {
              this.$Message.success('激活成功！');
              this.toggleAdding(false);
              this.loadDefaultApi()
            }
          })
        } else {
          this.$Message.error('该指南未确认，请确认指南后再激活！');
        }
      }
    })
  }
}

</script>
<style lang="less" scoped>
</style>
