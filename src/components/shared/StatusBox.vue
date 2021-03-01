<template>
  <div :style="boxStyle" class="status-box-wrapper">
    <template v-if="isError">
      <div>
        <slot name="error">
          <Alert type="error" show-icon>
            <p slot="desc">{{errorMsg}}</p>
          </Alert>
        </slot>
      </div>
    </template>
    <template v-else-if="isEmpty">
      <div>
        <slot name="empty">
          <Alert type="warning" show-icon>
            <p slot="desc">该查询没有数据</p>
          </Alert>
        </slot>
      </div>
    </template>
    <template v-else>
      <slot></slot>
    </template>
  </div>
</template>

<script type="text/ecmascript-6">
  import _ from 'lodash';
  import StandardError from 'standard-error';

  export default {
    props: {
      isFetching: {type: Boolean, default: false, required: false},
      isEmpty: {type: Boolean, default: false, required: false},
      error: {type: [Object, String, Error], default: null, required: false},
      minHeight: {type: String, default: '', required: false}
    },
    computed: {
      isError() {
        return !_.isNil(this.error);
      },
      boxStyle() {
        const {minHeight} = this;

        if (_.isString(minHeight) && minHeight.length > 0) {
          return {minHeight};
        }

        return null;
      },
      errorMsg() {
        const {error} = this;
        if (_.isString(error)) {
          return error;
        } else if (_.isString(error.message)) {
          return error.message;
        } else if (process.env.NODE_ENV !== 'production') {
          throw new StandardError({status: 500, message: 'error 不符合代码规范'});
        } else {
          return error;
        }
      }
    }
  };
</script>

<style type="text/less" lang="less" scoped>
  .status-box {
    position: absolute;
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 3;

    &-wrapper {
      position: relative;
    }
  }
</style>
