<template lang="pug">
  .lazy-load-image(:style="imgContainer")
    img(ref="img", class="source-img", v-lazy="src", @loaded="loaded", @loading="loading", @error="error",
      )
    img(v-if="isLoading", class="loading-img", src="~@/assets/img/loading.gif")
    a.btn.btn-share(v-if="link", :href="src", target="_blank")
      Icon(type="ios-share-alt")
    slot
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

@Component({})
export default class LazyLoadImage extends Vue {
  @Prop({ type: String }) src!: string;
  @Prop({ type: Boolean, default: true }) link!: boolean;
  @Prop({ type: String }) width!: string;
  @Prop({ type: String }) height!: string;

  isLoading: boolean = true;
  isError: boolean = false;
  imgContainer: any = {
    width: this.width,
    height: this.height
  };

  get imgRef() {
    return this.$refs['img'] as HTMLImageElement;
  }

  enterImg() {
    this.$emit('enterImg');
  }

  outImg() {
    this.$emit('outImg');
  }

  loaded() {
    this.isLoading = false;
    this.isError = false;
    this.$emit('on-loaded', true);
  }

  loading() {
    this.$emit('on-loading', true);
  }

  error() {
    this.isLoading = false;
    this.isError = true;
    this.$emit('on-error', true);
  }
}
</script>

<style lang="scss" scoped>
.lazy-load-image {
  position: relative;
}

img[lazy='loading'] {
  width: 0 !important;
  opacity: 0;
}
img[lazy='error'] {
  width: 50%;
  transition: opacity 1s;
}
img[lazy='loaded'] {
  display: block;
  width: 100%;
  transition: opacity 1s;
  height: 100%;
  object-fit: contain;
}
.loading-img {
  width: 22px;
  height: 22px;
}
</style>

<style>
.error-image .btn-share {
  display: none;
}
</style>

<style lang="less">
.lazy-load-image {
  width: 100%;
  height: 100%;
  img {
    width: 100%;
    height: 100%;
  }
  .btn-share {
    z-index: 9;
    opacity: 0;
  }
  &:hover {
    opacity: 1;
    .btn-share {
      opacity: 1;
    }
  }
}

.btn {
  &-share {
    @r: 18px;
    position: absolute;
    top: 2%;
    right: 6px;
    font-size: 12px;
    color: #495060;
    background: rgba(255, 255, 255, 0.6);
    width: @r;
    line-height: @r;
    height: @r;
    border-radius: 100%;
    text-align: center;
    cursor: pointer;
  }
}
</style>
