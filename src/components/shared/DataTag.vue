<template lang="pug">
  Tag(v-if="currentData" :color="currentData.color")
    | {{currentData.label}}
</template>
<script lang="ts">
import Vue from 'vue'
import {Prop} from "vue-property-decorator";
import Component from 'vue-class-component';

@Component({})
export default class DataTag extends Vue{
  @Prop() dataMap!: any;
  @Prop() value!: string|number;
  get currentData() {
    const {dataMap, value} = this;
    return dataMap[value] || value;
  }
}
</script>
