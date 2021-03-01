<template lang="pug">
  Card(title="修改指令内容", :bordered="false", dis-hover)
    Alert
      | 该指令被应用于这些指南：
      router-link(v-for="guide in linkGuides" :key="guide.id" :to="{name: 'v2-guide-detail', params: {id: guide.id}}")
        | {{guide.name}}
    InstructionForm(:info="info", @submit-form="submitData")
      div(slot="layer")
</template>
<script lang="ts">
import Vue from 'vue';
import { Prop } from 'vue-property-decorator';
import Component from 'vue-class-component';
import InstructionForm from './InstructionForm.vue'
import {
  getIngressionGuides$,
  GetIngressionGuidesParams,
  updateOneInstruction$,
  UpdateOneInstructionParams } from '@/api/v2/skus'
import { UpdateOneInstructionParams } from '../../../../api/v2/skus';
import { State } from 'vuex-class';

@Component({
  components: {InstructionForm}
})
export default class EditInstruction extends Vue {
  @State('profile') user!: any;
  @Prop({ type: Object, required: true })
  info!: object;
  linkGuides: Array<any> = [];
  submitData(form: any) {
    const {imgs, name, hints} = form
    const params: UpdateOneInstructionParams = {
      name,
      hints,
      imgs,
      updater: this.user.payload.data.account,
      instructionId: this.info.id,
    }
    updateOneInstruction$(params).subscribe(state => {
      if(!state.isError) {
        this.$Message.success('修改指令内容成功！');
        this.$emit('onChanged')
      }
    })
  }
  created() {
    const params: GetIngressionGuidesParams = {instructionId: this.info.id};
    getIngressionGuides$(params).subscribe(state => {
      this.linkGuides = state.payload.data.data
    })
  }
}
</script>
