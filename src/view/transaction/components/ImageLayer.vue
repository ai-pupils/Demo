<template lang="pug">
  .gallery-wrapper
    template(v-for='item in layerInfo')
      ul.gallery
        template(v-for='image in [item.start_image, item.end_image]')
          li.gallery-item
            figure.gallery-item-inner(@click='switchLayer(item.layer_index)')
              div(v-if='image')
                LazyloadImg.gallery-img(:src='image | ossResize(280)')
              .empty-warning(v-else='')
                i.fa.fa-exclamation-triangle(aria-hidden='true', fa-3x='')
                span URL为None
              p.txt-attribute
                span Layer index: {{item.layer_index}}
            a.btn.btn-share(:href='image', target='_blank')
              i.fa.fa-external-link
    template(v-if='layerInfo.length === 0')
      alert(type='warning', show-icon='', slot='empty')
        p 该交易暂无快照

</template>

<script lang="ts">
import LazyloadImg from '@/components/shared/LazyloadImg.vue';
import Component, { mixins } from 'vue-class-component';
import ComponentOptionsMixin from '@/mixins/componentOptions';
import { Prop } from 'vue-property-decorator';

@Component({
  components: { LazyloadImg }
})
export default class ImageLayer extends mixins(ComponentOptionsMixin) {
  @Prop({ default: () => [] })
  layerInfo!: any[];

  switchLayer(layerIndex: any = '') {
    const {
      $route: { query }
    }: any = this;
    this.$router.replace({
      query: { ...query, layerIndex, currentTab: 'confirm' }
    });
  }
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
  width: 100%;
  margin-top: 5px;
  display: flex;
  justify-content: space-between;
  vertical-align: top;
  list-style: none;
  &-item {
    position: relative;
    width: 50%;
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
    }
    &:hover {
      opacity: 1;
      .btn-share {
        opacity: 1;
      }
    }
  }
  &-img {
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
  bottom: 3%;
  left: 1%;
  width: 98%;
  height: 18px;
  z-index: 10;
  background: #000000;
  font: italic bold 14px/18px arial, sans-serif;
}
</style>
