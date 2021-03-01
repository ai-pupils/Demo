<template lang="pug">
.gallery-wrapper.patrol-image-box
  template(v-for='item in items')
    ul.gallery
      template(v-for='image in [item.end_image]')
        li.gallery-item
          figure.gallery-item-inner()
            div(v-if='image')
              LazyloadImg.gallery-img(:src='image | ossResize(280)')
            .empty-warning(v-else='')
              i.fa.fa-exclamation-triangle(aria-hidden='true', fa-3x='')
              span URL为None
            p.txt-attribute
              span Layer index: {{item.layer_index}}
          a.btn.btn-share(:href='image', target='_blank')
            i.fa.fa-external-link
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { PatrolItemInfo } from '@/api/patrol';
import LazyloadImg from '@/components/shared/LazyloadImg.vue';

@Component({
  components: { LazyloadImg }
})
export default class PatrolImageBox extends Vue {
  @Prop() items!: PatrolItemInfo[];
}
</script>

<style type="text/less" lang="less" scoped>
@import (less) '../../../css/vars.less';

.toolbar {
  padding: 14px 24px;
}

.ivu-poptip {
  height: 80px;
}

.gallery {
  width: 50%;
  margin-top: 5px;
  display: inline-flex;
  justify-content: space-between;
  vertical-align: top;
  list-style: none;
  &-item {
    position: relative;
    width: 100%;
    opacity: 0.8;
    cursor: pointer;
    padding: 2px 0;
    margin-left: 5px;
    box-sizing: border-box;
    transition: transform 0.2s linear;
    .btn-share {
      z-index: 9;
      opacity: 0;
    }
    &-inner {
      min-height: 80px;
      background: #fff;
      border: 1px solid #ddd;
      overflow: hidden;
      .MX-flex-vertical;
      height: 100%;
    }
    &:hover {
      opacity: 1;
      .btn-share {
        opacity: 1;
      }
    }
  }
  &-img {
    display: flex;
    width: 100%;
  }
  & .empty-warning {
    font-size: 13px;
  }
}

.btn {
  &-share {
    @r: 18px;
    position: absolute;
    top: 8px;
    right: 6px;
    font-size: 12px;
    color: @color-content;
    background: rgba(255, 255, 255, 0.6);
    width: @r;
    line-height: @r;
    height: @r;
    border-radius: 100%;
    text-align: center;
  }
}

.txt-attribute {
  text-align: center;
  color: #fff;
  position: absolute;
  bottom: 1%;
  left: 1%;
  width: 98%;
  height: 18px;
  z-index: 10;
  background: #000000;
  font: italic bold 14px/18px arial, sans-serif;
}
</style>
<style lang="scss">
.patrol-image-box {
  .gallery-item-inner {
    img {
      height: 100%;
    }
  }
}
</style>
