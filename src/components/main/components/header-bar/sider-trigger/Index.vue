<template lang="pug">
  a(@click="handleChange" type="text" :class="['sider-trigger-a', collapsed ? 'collapsed' : '']")
    Icon(:type="icon" :size="size")
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

@Component({})
export default class siderTrigger extends Vue {
  @Prop({})
  collapsed!: boolean;
  @Prop({ type: String, default: 'navicon-round' })
  icon!: string;
  @Prop({ type: Number, default: 26 })
  size!: number;

  handleChange() {
    this.$emit('on-change', !this.collapsed);
  }
}
</script>

<style lang="less">
.trans {
  transition: transform 0.2s ease;
}
@size: 40px;
.sider-trigger-a {
  padding: 6px;
  width: @size;
  height: @size;
  display: inline-block;
  text-align: center;
  color: #5c6b77;
  margin-top: 7px;
  i {
    .trans;
    vertical-align: top;
  }
  &.collapsed i {
    transform: rotateZ(90deg);
    .trans;
  }
}
</style>
