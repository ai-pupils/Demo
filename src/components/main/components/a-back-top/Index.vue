<template lang="pug">
  div(:class='classes', :style='styles', @click='back')
    slot
      div(:class='innerClasses')
        i.ivu-icon.ivu-icon-ios-arrow-up
</template>

<script lang="ts">
import Vue from 'vue';
import { scrollTop } from '@/libs/util';
import { on, off } from '@/libs/tools';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

const prefixCls = 'ivu-back-top';

@Component({})
export default class ABackTop extends Vue {
  @Prop({ type: Number, default: 400 })
  height!: number;
  @Prop({ type: Number, default: 30 })
  bottom!: number;
  @Prop({ type: Number, default: 30 })
  right!: number;
  @Prop({ type: Number, default: 1000 })
  duration!: number;
  @Prop({ type: [Number, String, Object], default: window })
  container!: any;

  backTop: boolean = false;

  mounted() {
    // window.addEventListener('scroll', this.handleScroll, false)
    // window.addEventListener('resize', this.handleScroll, false)
    on(this.containerEle, 'scroll', this.handleScroll);
    on(this.containerEle, 'resize', this.handleScroll);
  }

  beforeDestroy() {
    // window.removeEventListener('scroll', this.handleScroll, false)
    // window.removeEventListener('resize', this.handleScroll, false)
    off(this.containerEle, 'scroll', this.handleScroll);
    off(this.containerEle, 'resize', this.handleScroll);
  }
  get classes() {
    return [
      `${prefixCls}`,
      {
        [`${prefixCls}-show`]: this.backTop
      }
    ];
  }

  get styles() {
    return {
      bottom: `${this.bottom}px`,
      right: `${this.right}px`
    };
  }

  get innerClasses() {
    return `${prefixCls}-inner`;
  }

  get containerEle(): any {
    const win: Window = window;
    const doc: Document = document;

    return (this as any).container === win
      ? win
      : doc.querySelector(this.container as any);
  }

  handleScroll() {
    this.backTop = this.containerEle.scrollTop >= this.height;
  }

  back() {
    let target: any =
      typeof this.container === 'string'
        ? this.containerEle
        : document.documentElement || document.body;
    const sTop = target.scrollTop;
    scrollTop(this.containerEle, sTop, 0, this.duration);
    this.$emit('on-click');
  }
}
</script>
