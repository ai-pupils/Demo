<template lang="pug">
  i(:class="`iconfont icon-${type}`" :style="styles")
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

@Component({})
export default class Icons extends Vue {
  @Prop({ type: String, required: true })
  type!: string;
  @Prop({ type: String, default: '#5c6b77' })
  color!: string;
  @Prop({ type: Number, default: 16 })
  size!: number;

  get styles() {
    return {
      fontSize: `${this.size}px`,
      color: this.color
    };
  }
}
</script>

<style>
</style>
