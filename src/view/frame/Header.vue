<template>
  <header class="page-hd">
    <router-link :to="{name:'root'}" class="btn-nav page-logo">
      <img src="~@/assets/img/f_logo.svg" alt="">
    </router-link>
    <div class="pull-right">
      <Menu mode="horizontal" theme="light" @on-select="menuSelected" class="page-hd-menu">
        <Submenu name="user">
          <template slot="title">
            <template v-if="isFulfill">
              <i class="fa fa-user"></i> {{user.nickname}}
            </template>
            <template v-else>
              <i class="fa fa-spin fa-spinner"></i>
            </template>
          </template>
          <router-link :to="'/logs'"><i class="fa fa-calendar-plus-o menu-icon"></i> 操作日志</router-link>
          <MenuItem name="logout"><i class="fa fa-power-off"></i> 退出登录</MenuItem>
        </Submenu>
      </Menu>
    </div>
  </header>
</template>

<script type="text/ecmascript-6">
import { mapState, mapActions } from 'vuex';

export default {
  data() {
    return {
      showMenu: false
    };
  },
  computed: {
    ...mapState({
      isFulfill: state => state.profile.isFulfill,
      user: state => {
        const { profile } = state;
        if (profile.isFulfill) {
          return profile.payload.data;
        }
        return null;
      }
    })
  },
  methods: {
    ...mapActions({
      load: 'getProfile',
      signout: 'signout'
    }),
    toggleMenu() {
      this.showMenu = !this.showMenu;
    },
    menuSelected(name) {
      if (name === 'logout') {
        this.signout();
        this.$router.push({ name: 'login' });
      }
    }
  },
  mounted() {
    this.load();
  }
};
</script>

<style type="text/less" lang="less" scoped>
@import (less) '~@/css/vars.less';

.nav {
  border: none;
  height: 100%;
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  border-left: 1px solid #eee;
  .MX-flex-vertical;
  cursor: pointer;
  &.open {
    .nav-submenu {
      display: block;
    }
  }
  &-submenu {
    position: absolute;
    border: 1px solid #eee;
    display: none;
    top: 100%;
    z-index: 2;
    right: 0;
    &-item {
      background: #fff;
      border-bottom: 1px solid #eee;
      width: auto;
    }
  }
}

.page-hd-menu {
  display: inline-block;
  vertical-align: middle;
}

.page-logo {
  span {
    display: inline-block;
    vertical-align: bottom;
  }
  small {
    display: inline-block;
    vertical-align: bottom;
    font-size: 12px;
    transform: scale(10 / 12);
    margin-bottom: -2px;
  }
}

.menu-icon {
  margin-right: 6px;
}
</style>
