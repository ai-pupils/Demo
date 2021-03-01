<template lang="pug">
  #app
    router-view
</template>


<script lang="ts">
import Vue from 'vue';
import _ from 'lodash';
import Component from 'vue-class-component';

const DEFAULT_TITLE = 'RetailAI 自助管理平台';

@Component({})
export default class App extends Vue {
  metaInfo() {
    const {
      $route: { meta }
    } = this;
    const title =
      _.isNil(meta) || !_.isString(meta.title) ? DEFAULT_TITLE : meta.title;

    return {
      title,
      titleTemplate: '码隆智能柜 - 运营系统 - %s'
    };
  }
}
</script>

<style lang="less">
#app {
  width: 100%;
  height: 100%;
}
</style>
