<template lang="pug">
  .user-avator-dropdown
    Dropdown(@on-click='handleClick')
      <!--badge(:dot='!!messageUnreadCount')-->
        <!--avatar(:src='userAvator')-->
      i.fa.fa-user
      span(style='margin-left: 5px') {{user.nickname}}
      Icon(:size='18', type='md-arrow-dropdown')
      DropdownMenu(slot='list')
        DropdownItem
          span(@click="$router.push({name: 'logs'})") 操作日志
        DropdownItem(name='logout') 退出登录
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { Action, Getter, State } from 'vuex-class';

@Component({})
export default class User extends Vue {
  @Prop({ type: String, default: '' })
  userAvator!: string;
  @Prop({ type: Number, default: 0 })
  messageUnreadCount!: string;
  @Action('user/handleLogOut') handleLogOut!: any;
  @Action('getProfile') getProfile!: any;
  @State(state => state.profile.isFulfill)
  isFulfill!: boolean;
  @State(state => {
      const { profile } = state;
      if (profile.isFulfill) {
          return profile.payload.data;
      }
      return {};
  })
  user!: any;

  mounted() {
    this.getProfile();
  }

  logout() {
    this.handleLogOut().then(this.logoutSuccess, this.logoutFaild)
    //   .then(() => {
    //   this.$router.push({
    //     name: 'login'
    //   });
    // });
  }
  logoutSuccess(res: any) {
    window.location.replace(res.data);
  }

  logoutFaild(res: any) {
  }

  message() {
    this.$router.push({
      name: 'message_page'
    });
  }

  handleClick(name: any) {
    switch (name) {
      case 'logout':
        this.logout();
        break;
      case 'message':
        this.message();
        break;
    }
  }
}
</script>

<style lang="less" scoped>
.user {
  &-avator-dropdown {
    cursor: pointer;
    display: inline-block;
    // height: 64px;
    vertical-align: middle;
    // line-height: 64px;
    .ivu-badge-dot {
      top: 16px;
    }
  }
}
</style>
