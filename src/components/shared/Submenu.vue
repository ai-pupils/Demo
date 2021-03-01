<template>
  <nav class="subpage-menu ">
    <slot name="header"></slot>

    <Menu theme="light" :active-name="activeName" width="180" class="menu">
      <template v-for="menu in normalizedMenu">
        <MenuGroup :title="menu.title">
          <template v-for="menuItem in menu.children">
            <MenuItem :name="menuItem.target.name" class="menu-item">
              <router-link class="menu-link" :to="menuItem.target" replace>
                {{menuItem.title}}
              </router-link>
            </MenuItem>
          </template>
        </MenuGroup>
      </template>
    </Menu>

    <div class="subpage-toggle">
      <button class="btn btn-toggle" type="button" @click="toggle"><i class="fa fa-outdent"></i></button>
    </div>
  </nav>
</template>

<script type="text/ecmascript-6">
  import _ from 'lodash';

  export default {
    props: {
      navData: {type: Array, required: true, default: null}
    },
    computed: {
      normalizedMenu() {
        const {navData} = this;

        return _.map(navData, menu => ({
          ...menu,
          children: _.map(menu.children, item => ({
            ...item,
            target: _.isString(item.target) ? {name: item.target} : item.target
          }))
        }));
      },
      activeName() {
        const menu = _(this.normalizedMenu)
          .map(nav => _.map(nav.children, ({target: {name}}) => name))
          .flatten()
          .value();

        const {$route: {matched}} = this;

        const firstMatch = _.findLast(matched,
          route => _.findIndex(menu, menuItem => menuItem === route.name) >= 0
        );
        if (_.isNil(firstMatch)) {
          return menu[0];
        }

        return firstMatch.name;
      }
    },
    methods: {
      toggle() {
        document.body.classList.toggle('subpage__toggle');
      }
    },
    destroyed() {
      document.body.classList.remove('subpage__toggle');
    }
  };
</script>
