<template lang="pug">
  Submenu(:name='`${parentName}`')
    template(slot='title')
      common-icon(:type="parentItem.icon || ''")
      span {{ showTitle(parentItem) }}
    template(v-for='item in children')
      template(v-if='item.children && item.children.length === 1')
        side-menu-item(v-if='showChildren(item)', :key='`menu-${item.name}`', :parent-item='item')
        menu-item(v-else='', :name='getNameOrHref(item, true)', :key='`menu-${item.children[0].name}`')
          common-icon(:type="item.children[0].icon || ''")
          span {{ showTitle(item.children[0]) }}
      template(v-else='')
        side-menu-item(v-if='showChildren(item)', :key='`menu-${item.name}`', :parent-item='item')
        menu-item(v-else='', :name='getNameOrHref(item)', :key='`menu-${item.name}`')
          common-icon(:type="item.icon || ''")
          span {{ showTitle(item) }}
</template>

<script lang="ts">
import Component, { mixins } from 'vue-class-component';
import SideMenuMixin from './mixin';
import SideMenuItemMixin from './item-mixin';

@Component({})
export default class SideMenuItem extends mixins(
  SideMenuMixin,
  SideMenuItemMixin
) {}
</script>
