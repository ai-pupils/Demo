<template lang="pug">
  Dropdown(ref='dropdown', @on-click='handleClick', :class="hideTitle ? '' : 'collased-menu-dropdown'", :transfer='hideTitle', :placement='placement')
    a.drop-menu-a(type='text', @mouseover='handleMousemove($event, children)', :style="{textAlign: !hideTitle ? 'left' : ''}")
      common-icon(:size='rootIconSize', :color='textColor', :type='parentItem.icon')
      span.menu-title(v-if='!hideTitle') {{ showTitle(parentItem) }}
      Icon(style='float: right;', v-if='!hideTitle', type='ios-arrow-forward', :size='16')
    DropdownMenu(ref='dropdown', slot='list')
      template(v-for='child in children')
        collapsed-menu(v-if='showChildren(child)', :icon-size='iconSize', :parent-item='child', :key='`drop-${child.name}`')
        DropdownItem(v-else='', :key='`drop-${child.name}`', :name='child.name')
          common-icon(:size='iconSize', :type='child.icon')
          span.menu-title {{ showTitle(child) }}
</template>

<script lang="ts">
import Component, { mixins } from 'vue-class-component';
import { findNodeUpperByClasses } from '@/libs/util';
import SideMenuItemMixin from './item-mixin';
import SideMenuMixin from './mixin';
import { Prop } from 'vue-property-decorator';

@Component({})
export default class CollapsedMenu extends mixins(
  SideMenuMixin,
  SideMenuItemMixin
) {
  name: string = 'CollapsedMenu';
  @Prop({ type: Boolean, default: false })
  hideTitle!: boolean;
  @Prop({ type: Number, default: 16 })
  rootIconSize!: number;

  placement: string = 'right-end';

  handleClick(name: any) {
    this.$emit('on-click', name);
  }

  handleMousemove(event: any, children: any) {
    const { pageY } = event;
    const height = children.length * 38;
    const isOverflow = pageY + height < window.innerHeight;
    this.placement = isOverflow ? 'right-start' : 'right-end';
  }

  mounted() {
    let dropdown = findNodeUpperByClasses((this.$refs.dropdown as any).$el, [
      'ivu-select-dropdown',
      'ivu-dropdown-transfer'
    ]);
    if (dropdown) dropdown.style.overflow = 'visible';
  }
}
</script>
