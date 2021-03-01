<template>
  <Tooltip class="no-overflow" :disabled="!hasContent">
    <div slot="content">{{content}}</div>
    <span class="content">
      <slot></slot>
    </span>
  </Tooltip>
</template>

<script type="text/ecmascript-6">
  import _ from 'lodash';

  export default {
    computed: {
      content() {
        return this.$slots.default[0].text;
      },
      hasContent() {
        const {content} = this;
        return _.isString(content) && content.length > 0;
      }
    }
  };
</script>

<style type="text/less" lang="less" scoped>
  .content {
    display: inline-block;
    width: 100%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
</style>
