<template lang="pug">
  Card(title="增加新的指令", :bordered="false", dis-hover)
    InstructionForm(:info="info", @submit-form="submitData")
</template>
<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import InstructionForm from '../instructions/InstructionForm.vue'
import {
  postOneInstruction$,
  PostOneInstructionParams } from '@/api/v2/skus'
import { State } from 'vuex-class';

@Component({
  components: {InstructionForm}
})
export default class EditInstruction extends Vue {
  @State('profile') user!: any;
  linkGuides: Array<any> = [];
  info: any = {
    name: '',
    hints: '',
    image_urls: [],
    layer_index: null
  }
  submitData(form: any) {
    const params: PostOneInstructionParams = {
      ...form,
      creator: this.user.payload.data.account,
    }
    postOneInstruction$(params).subscribe(state => {
      if(!state.isError) {
        this.$Message.success('增加新的指令成功！');
        const newInstructionId = state.payload.data.data.id
        this.$emit('onAdded', newInstructionId)
      }
    })
  }
}
</script>
