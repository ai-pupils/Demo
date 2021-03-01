<style type="text/less" lang="less" scoped>
  @import (less) '~@/css/vars.less';

  .img {
    width: 100%;
    &-wrapper {
      font-size: 12px;
      /*display: inline-block;*/
      vertical-align: middle;
      margin: 0;
      &__large {
        width: 100%;
      }
    }
    &-content {
      font-size: 0;
    }
  }

  .status-box {
    /*position: absolute;*/
    top: 0;
    z-index: 3;
    left: 0;
    width: 100%;
    height: 100%;
    .MX-flex-vertical;
    color: #ddd;
    text-align: center;
    .lg {
      font-size: 24px;
    }
  }

  p {
    margin: 0;
  }

  .spinning {
    animation: rotating .4s linear infinite both;
  }

  @keyframes rotating {
    0% {
      transform: rotate(0);
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style>

<template>
  <figure class="img-wrapper" :class="{'img-wrapper__large':long}">
    <div v-show="isOk" class="img-content">
      <slot>
        <a v-if="link" :href="target | escapeImg" target="_blank">
          <img :src="target | escapeImg" :alt="target | escapeImg" class="img">
        </a>
        <img v-else :src="target | escapeImg" :alt="target | escapeImg" class="img">
      </slot>
    </div>
    <div class="status-box" v-show="!isOk">
      <div v-show="this.status===allStatus.LOADING" class="lg">
        <i class="fa fa-spinner spinning"></i>
      </div>
      <div v-show="this.status===allStatus.ERROR">
        <p class="text-muted">
          <span class="text-danger"><i class="fa fa-remove"></i></span>
          <span>加载图片失败</span>
        </p>
      </div>
    </div>
  </figure>
</template>

<script type="text/ecmascript-6">
  const LOAD_STATUS = {INIT: 'init', LOADING: 'loading', LOADED: 'loaded', NULL: 'null', ERROR: 'error'};

  export default {
    data() {
      return {status: LOAD_STATUS.INIT, stamp: 0};
    },
    props: {
      src: {
        type: String,
        required: false
      },
      long: {type: Boolean, default: false, required: false},
      link: {type: Boolean, default: false}
    },
    computed: {
      target() {
        if (this.isOk) {
          return this.src;
        }
        return undefined;
      },
      isOk() {
        return this.status === LOAD_STATUS.LOADED;
      },
      allStatus() {
        return LOAD_STATUS;
      }
    },
    methods: {
      load() {
        const {src} = this;
        const stamp = this.stamp = Date.now();

        this.status = LOAD_STATUS.LOADING;
        const img = document.createElement('img');
        img.onload = () => {
          if (stamp === this.stamp) this.status = LOAD_STATUS.LOADED;
        };
        img.onerror = () => {
          if (stamp === this.stamp) this.status = LOAD_STATUS.ERROR;
        };
        img.src = src;
      }
    },
    mounted() {
      this.load(this.src);
    },
    watch: {
      src(val, oldVal) {
        if (val !== oldVal) {
          this.status = LOAD_STATUS.INIT;
          this.load(val);
        }
      }
    }
  };
</script>
