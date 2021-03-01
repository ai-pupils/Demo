<template lang="pug">
  .tags-nav
    .close-con
      Dropdown(transfer='', @on-click='handleTagsOption', style='margin-top:7px;')
        Button(size='small', type='text')
          Icon(:size='18', type='ios-close-circle-outline')
        DropdownMenu(slot='list')
          DropdownItem(name='close-all') 关闭所有
          DropdownItem(name='close-others') 关闭其他
    ul.contextmenu(v-show='visible', :style="{left: contextMenuLeft + 'px', top: contextMenuTop + 'px'}")
      li(v-for='(item, key) of menuList', @click='handleTagsOption(key)', :key='key') {{item}}
    .btn-con.left-btn
      Button(type='text', @click='handleScroll(240)')
        icon(:size='18', type='ios-arrow-back')
    .btn-con.right-btn
      Button(type='text', @click='handleScroll(-240)')
        Icon(:size='18', type='ios-arrow-forward')
    .scroll-outer(ref='scrollOuter', @dommousescroll='handlescroll', @mousewheel='handlescroll')
      .scroll-body(ref='scrollBody', :style="{left: tagBodyLeft + 'px'}")
        transition-group(name='taglist-moving-animation')
          Tag(type='dot', v-for='(item, index) in list', ref='tagsPageOpened', :key='`tag-nav-${index}`', :name='item.name', :data-route-item='item', @on-close='handleClose(item)', @click.native='handleClick(item)', :closable='item.name !== $config.homeName', :color="isCurrentTag(item) ? 'primary' : 'default'", @contextmenu.prevent.native='contextMenu(item, $event)') {{ showTitleInside(item) }}
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import { showTitle, routeEqual } from '@/libs/util';
import beforeClose from '@/router/before-close';
import { Route } from 'vue-router';

@Component({})
export default class TagsNav extends Vue {
  @Prop({ type: Object })
  value!: any;
  @Prop({ type: Array, default: () => [] })
  list!: any[];
  tagBodyLeft: number = 0;
  rightOffset: number = 40;
  outerPadding: number = 4;
  contextMenuLeft: number = 0;
  contextMenuTop: number = 0;
  visible: boolean = false;
  menuList: any = {
    others: '关闭其他',
    all: '关闭所有'
  };
  refsTag: any = {};

  @Watch('$route')
  routeChange(to: Route) {
    this.getTagElementByRoute(to);
  }
  @Watch('visible')
  visibleChange(value: any) {
    if (value) {
      document.body.addEventListener('click', this.closeMenu);
    } else {
      document.body.removeEventListener('click', this.closeMenu);
    }
  }

  get currentRouteObj() {
    const { name, params, query } = this.value;
    return { name, params, query };
  }

  handlescroll(e: any) {
    var type = e.type;
    let delta = 0;
    if (type === 'DOMMouseScroll' || type === 'mousewheel') {
      delta = e.wheelDelta ? e.wheelDelta : -(e.detail || 0) * 40;
    }
    this.handleScroll(delta);
  }

  handleScroll(offset: any) {
    const outerWidth = (this.$refs.scrollOuter as any).offsetWidth;
    const bodyWidth = (this.$refs.scrollBody as any).offsetWidth;
    if (offset > 0) {
      this.tagBodyLeft = Math.min(0, this.tagBodyLeft + offset);
    } else {
      if (outerWidth < bodyWidth) {
        if (this.tagBodyLeft < -(bodyWidth - outerWidth)) {
          this.tagBodyLeft = this.tagBodyLeft;
        } else {
          this.tagBodyLeft = Math.max(
            this.tagBodyLeft + offset,
            outerWidth - bodyWidth
          );
        }
      } else {
        this.tagBodyLeft = 0;
      }
    }
  }

  handleTagsOption(type: any) {
    if (type.includes('all')) {
      // 关闭所有，除了home
      let res = this.list.filter(item => item.name === this.$config.homeName);
      this.$emit('on-close', res, 'all');
    } else if (type.includes('others')) {
      // 关闭除当前页和home页的其他页
      let res = this.list.filter(
        item =>
          routeEqual(this.currentRouteObj, item) ||
          item.name === this.$config.homeName
      );
      this.$emit('on-close', res, 'others', this.currentRouteObj);
      setTimeout(() => {
        this.getTagElementByRoute(this.currentRouteObj);
      }, 100);
    }
  }

  handleClose(current: any) {
    if (
      current.meta &&
      current.meta.beforeCloseName &&
      current.meta.beforeCloseName in beforeClose
    ) {
      new Promise(beforeClose[current.meta.beforeCloseName]).then(close => {
        if (close) {
          this.close(current);
        }
      });
    } else {
      this.close(current);
    }
  }

  close(route: any) {
    let res = this.list.filter(item => !routeEqual(route, item));
    this.$emit('on-close', res, undefined, route);
  }

  handleClick(item: any) {
    this.$emit('input', item);
  }

  showTitleInside(item: any): any {
    return showTitle(item, this);
  }

  isCurrentTag(item: any): any {
    return routeEqual(this.currentRouteObj, item);
  }

  moveToView(tag: any) {
    const outerWidth = (this.$refs.scrollOuter as any).offsetWidth;
    const bodyWidth = (this.$refs.scrollBody as any).offsetWidth;
    if (bodyWidth < outerWidth) {
      this.tagBodyLeft = 0;
    } else if (tag.offsetLeft < -this.tagBodyLeft) {
      // 标签在可视区域左侧
      this.tagBodyLeft = -tag.offsetLeft + this.outerPadding;
    } else if (
      tag.offsetLeft > -this.tagBodyLeft &&
      tag.offsetLeft + tag.offsetWidth < -this.tagBodyLeft + outerWidth
    ) {
      // 标签在可视区域
      this.tagBodyLeft = Math.min(
        0,
        outerWidth - tag.offsetWidth - tag.offsetLeft - this.outerPadding
      );
    } else {
      // 标签在可视区域右侧
      this.tagBodyLeft = -(
        tag.offsetLeft -
        (outerWidth - this.outerPadding - tag.offsetWidth)
      );
    }
  }

  getTagElementByRoute(route: any) {
    this.$nextTick(() => {
      this.refsTag = this.$refs.tagsPageOpened;
      this.refsTag.forEach((item: any, index: number) => {
        if (routeEqual(route, item.$attrs['data-route-item'])) {
          let tag = this.refsTag[index].$el;
          this.moveToView(tag);
        }
      });
    });
  }

  contextMenu(item: any, e: any) {
    if (item.name === this.$config.homeName) {
      return;
    }
    this.visible = true;
    const offsetLeft = this.$el.getBoundingClientRect().left;
    this.contextMenuLeft = e.clientX - offsetLeft + 10;
    this.contextMenuTop = e.clientY - 64;
  }

  closeMenu() {
    this.visible = false;
  }

  mounted() {
    setTimeout(() => {
      this.getTagElementByRoute(this.$route);
    }, 200);
  }
}
</script>

<style lang="less" scoped>
.no-select {
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.size {
  width: 100%;
  height: 100%;
}
.tags-nav {
  position: relative;
  border-top: 1px solid #f0f0f0;
  border-bottom: 1px solid #f0f0f0;
  .no-select;
  .size;
  .close-con {
    position: absolute;
    right: 0;
    top: 0;
    height: 100%;
    width: 32px;
    background: #fff;
    text-align: center;
    z-index: 10;
  }
  .btn-con {
    position: absolute;
    top: 0px;
    height: 100%;
    background: #fff;
    padding-top: 3px;
    z-index: 10;
    button {
      padding: 6px 4px;
      line-height: 14px;
      text-align: center;
    }
    &.left-btn {
      left: 0px;
    }
    &.right-btn {
      right: 32px;
      border-right: 1px solid #f0f0f0;
    }
  }
  .scroll-outer {
    position: absolute;
    left: 28px;
    right: 61px;
    top: 0;
    bottom: 0;
    box-shadow: 0px 0 3px 2px rgba(100, 100, 100, 0.1) inset;
    .scroll-body {
      height: ~'calc(100% - 1px)';
      display: inline-block;
      padding: 1px 4px 0;
      position: absolute;
      overflow: visible;
      white-space: nowrap;
      transition: left 0.3s ease;
      .ivu-tag-dot-inner {
        transition: background 0.2s ease;
      }
    }
  }
  .contextmenu {
    position: absolute;
    margin: 0;
    padding: 5px 0;
    background: #fff;
    z-index: 1000;
    list-style-type: none;
    border-radius: 4px;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.1);
    li {
      margin: 0;
      padding: 5px 15px;
      cursor: pointer;
      &:hover {
        background: #eee;
      }
    }
  }
}
</style>
