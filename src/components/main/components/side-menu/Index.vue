<template lang="pug">
  .side-menu-wrapper
    slot
    Menu(ref='menu', v-show='!collapsed', :active-name='activeName', :open-names='openedNames', :accordion='accordion', :theme='theme', width='auto', @on-select='handleSelect')
      template(v-for='item in menuList')
        template(v-if='item.children && item.children.length === 1')
          SideMenuItem(v-if='showChildren(item)', :key='`menu-${item.name}`', :parent-item='item')
          menu-item(v-else='', :name='getNameOrHref(item, true)', :key='`menu-${item.children[0].name}`')
            common-icon(:type="item.children[0].icon || ''")
            span {{ showTitle(item.children[0]) }}
        template(v-else)
          SideMenuItem(v-if='showChildren(item)', :key='`menu-${item.name}`', :parent-item='item')
          menu-item(v-else='', :name='getNameOrHref(item)', :key='`menu-${item.name}`')
            common-icon(:type="item.icon || ''")
            span {{ showTitle(item) }}
    .menu-collapsed(v-show='collapsed', :list='menuList')
      template(v-for='item in menuList')
        CollapsedMenu(v-if='item.children && item.children.length > 1', @on-click='handleSelect', hide-title='', :root-icon-size='rootIconSize', :icon-size='iconSize', :theme='theme', :parent-item='item', :key='`drop-menu-${item.name}`')
        Tooltip(transfer='', v-else='', :content='showTitle(item.children && item.children[0] ? item.children[0] : item)', placement='right', :key='`drop-menu-${item.name}`')
          a.drop-menu-a(@click='handleSelect(getNameOrHref(item, true))', style="text-align:center;")
            common-icon(:size='rootIconSize', :color='textColor', :type='item.icon || (item.children && item.children[0].icon)')

</template>

<script lang="ts">
import Component, { mixins } from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import SideMenuItem from './SideMenuItem.vue';
import CollapsedMenu from './CollapsedMenu.vue';
import { getUnion } from '@/libs/tools';
import SideMenuMixin from './mixin';

@Component({
  components: {
    SideMenuItem,
    CollapsedMenu
  }
})
export default class SideMenu extends mixins(SideMenuMixin) {
  @Prop({ type: Array, default: () => [] })
  menuList!: any[];
  @Prop({ type: Boolean })
  collapsed!: boolean;
  @Prop({ type: String, default: 'dark' })
  theme!: string;
  @Prop({ type: Number, default: 20 })
  rootIconSize!: number;
  @Prop({ type: Number, default: 16 })
  iconSize!: number;
  @Prop({ type: Boolean })
  accordion!: boolean;
  @Prop({ type: String, default: '' })
  activeName!: string;
  @Prop({ type: Array, default: () => [] })
  openNames!: any[];

  openedNames: any[] = [];

  @Watch('activeName')
  activeNameChange(name: any) {
    if (this.accordion)
      this.openedNames = this.getOpenedNamesByActiveName(name);
    else {
      this.openedNames = getUnion(
        this.openedNames,
        this.getOpenedNamesByActiveName(name)
      );
    }
  }
  @Watch('openNames')
  openNamesChange(newNames: any) {
    this.openedNames = newNames;
  }
  @Watch('openedNames')
  openedNamesChange() {
    this.$nextTick(() => {
      (this.$refs as any).menu.updateOpened();
    });
  }

  get textColor(): string {
    return this.theme === 'dark' ? '#fff' : '#495060';
  }

  handleSelect(name: any) {
    this.$emit('on-select', name);
  }

  getOpenedNamesByActiveName(name: any): any {
    return this.$route.matched
      .map(item => item.name)
      .filter(item => item !== name);
  }

  updateOpenName(name: any) {
    if (name === this.$config.homeName) this.openedNames = [];
    else this.openedNames = this.getOpenedNamesByActiveName(name);
  }

  mounted() {
    this.openedNames = getUnion(
      this.openedNames,
      this.getOpenedNamesByActiveName(name)
    );
  }
}
</script>

<style lang="less">
.side-menu-wrapper {
  user-select: none;
  .menu-collapsed {
    padding-top: 10px;

    .ivu-dropdown {
      width: 100%;
      .ivu-dropdown-rel a {
        width: 100%;
      }
    }
    .ivu-tooltip {
      width: 100%;
      .ivu-tooltip-rel {
        width: 100%;
      }
      .ivu-tooltip-popper .ivu-tooltip-content {
        .ivu-tooltip-arrow {
          border-right-color: #fff;
        }
        .ivu-tooltip-inner {
          background: #fff;
          color: #495060;
        }
      }
    }
  }
  a.drop-menu-a {
    display: inline-block;
    padding: 6px 15px;
    width: 100%;
    text-align: center;
    color: #495060;
  }
}
.menu-title {
  padding-left: 6px;
}
</style>
