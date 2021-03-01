<template lang="pug">
  .error-store
    badge(dot='', :count='countComputed')
      button(type='text', @click='openErrorLoggerPage')
        icon(:size='20', type='ios-bug')
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

@Component({})
export default class ErrorStore extends Vue {
  @Prop({ type: Number, default: 0 })
  count!: number;
  @Prop({ type: Boolean, default: false })
  hasRead!: boolean;

  get countComputed() {
    return this.hasRead ? 0 : this.count;
  }

  openErrorLoggerPage() {
    this.$router.push({
      name: 'error_logger_page'
    });
  }
}
</script>

<style lang="less">
.error-store {
  margin-right: 12px;
  .ivu-badge-dot {
    top: 20px;
  }
  .ivu-btn.ivu-btn-text {
    padding: 5px 1px 6px;
  }
}
</style>
