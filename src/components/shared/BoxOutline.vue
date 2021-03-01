<template>
  <ul class="box-list">
    <template v-for="(box,index) in boxes">
      <li class="box-item" :key="index" :style="boxStyles[index]"></li>
    </template>
  </ul>
</template>

<script type="text/ecmascript-6">
  import _ from 'lodash';
  import {mapActions, mapState} from 'vuex';

  export default {
    props: {
      boxes: {type: Array, required: true},
      borderWidth: {type: String, required: false, default: '1px'}
    },
    computed: {
      ...mapState('page', ['tmpState']),
      boxStyles() {
        const {boxes, borderWidth} = this;
        return _.map(boxes, ({width, height, left, top}) => ({
          width: `${width * 100}%`,
          height: `${height * 100}%`,
          left: `${left * 100}%`,
          top: `${top * 100}%`,
          'border-width': borderWidth
        }));
      }
    },
  };
</script>

<style type="text/less" lang="less" scoped>
  @import (less) "~@/css/vars.less";

  .box {
    &-list {
      position: absolute;
      z-index: 9;
      left: 0;
      right: 0;
      bottom: 0;
      top: 0;
    }
    &-item {
      position: absolute;
      z-index: 3;
      transition: background-color .4s linear, opacity .4s linear;
      cursor: pointer;
      box-sizing: border-box;
      background-color: transparent;
      border-style: solid;
      border-color: @color-error;
    }
  }
</style>
