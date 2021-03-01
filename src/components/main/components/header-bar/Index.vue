<template lang="pug">
  .header-bar
    sider-trigger(:collapsed='collapsed', icon='md-menu', @on-change='handleCollpasedChange')
    custom-bread-crumb(show-icon='', style='margin-left: 30px;', :list='breadCrumbList')
    .custom-content-con
      slot
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import siderTrigger from './sider-trigger/Index.vue';
import customBreadCrumb from './custom-bread-crumb/Index.vue';

@Component({
  components: {
    siderTrigger,
    customBreadCrumb
  }
})
export default class HeaderBar extends Vue {
  @Prop({ type: Boolean })
  collapsed!: boolean;

  get breadCrumbList() {
    return this.$store.state.app.breadCrumbList;
  }

  handleCollpasedChange(state: any) {
    this.$emit('on-coll-change', state);
  }
}
</script>

<style lang="less">
.header-bar {
  width: 100%;
  height: 100%;
  position: relative;
  .custom-content-con {
    float: right;
    height: auto;
    padding-right: 20px;
    line-height: 50px;
    & > * {
      float: right;
    }
  }
}
</style>
