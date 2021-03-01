<template lang="pug">
  section
    Modal(v-model="visible", :width="800", :footer-hide='true')
      p(slot="header" style="color: #f79903;")
        Icon(type="ios-alert")
        span 请注意
      .msg(v-html="info.contents")
</template>

<script lang="ts">
import Vue from 'vue';
import Component from "vue-class-component";

@Component({})
export default class ShowMessageModal extends Vue {

  visible = false;
  info: string = '';

  open(info: string){
    this.info = info;
    this.visible = true;
  }

}
</script>

<style scoped></style>
