<template>
  <section class="page-error">
    <header class="page-error-hd">
      <figure class="page-error-icon">
        <i class="fa fa-frown-o"></i>
      </figure>
      <slot name="status">
        <h4 class="page-error-title">{{status}}</h4>
      </slot>
      <slot name="title">
        <h6 class="page-error-subtitle">{{title}}</h6>
      </slot>
    </header>

    <div class="page-error-bd">
      <slot></slot>
    </div>
  </section>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      status: {type: String, required: false, default: '404'},
      title: {type: String, required: false, default: 'Not Found'}
    }
  };
</script>

<style type="text/less" lang="less" scoped>
  @import (less) "~@/css/vars.less";

  .page-error {
    text-align: center;
    padding: 40px 28px;
    color: @color-content;
    &-hd {
      margin-bottom: 28px;
    }
    &-icon {
      font-size: 80px;
      color: @color-disabled;
    }
    &-title {
      font-size: 32px;
      color: @color-title;
    }
    &-subtitle {
      font-size: 18px;
      color: @color-disabled;
    }
    &-bd {
      font-size: 14px;
      a {
        color: @color-light-primary;
      }
    }
  }
</style>
