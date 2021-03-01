<template lang="pug">
  .page
    card.content
      header.content-hd
        img.content-logo(src='~@/assets/img/logo.svg', alt='')
        h6.content-title RetailAI 智能零售的赋能者
      Form.login-form(:rules='rules', :model='form', ref='loginForm')
        FormItem(prop='user')
          Input(type='text', v-model='form.user', placeholder='登录账号')
          Icon(type='ios-person', slot='prepend')
        FormItem(prop='password')
          Input(type='password', v-model='form.password', placeholder='密码')
          Icon(type='ios-lock', slot='prepend')
        footer.login-form-ft
          Button(type='primary', :loading='isFetching', html-type='submit', :long='true', size='large', @click.prevent='submit') 登录
</template>

<script lang="ts">
import Vue from 'vue';
import { login } from '@/store/api';
import Component from 'vue-class-component';
import { namespace } from 'vuex-class';

const UserStore = namespace('user');

@Component({})
export default class Login extends Vue {
  @UserStore.Action('handleLogin') loginAction!:any;
  metaInfo: any = {
    title: '用户登录'
  };
  isFetching: boolean = false;
  form: any = {
    user: '',
    password: ''
  };

  get rules() {
    return {
      user: [{ required: true, message: '请填写用户名', trigger: 'blur' }],
      password: [{ required: true, message: '请填写密码', trigger: 'blur' }]
    };
  }

  login() {
    this.isFetching = true;
    const {
      form: { user, password }
    } = this;
    this.loginAction({ userName: user, password })
      .then(() => {
        this.isFetching = false;
        this.$Message.success('登录成功');
        const { query }: any = this.$route;
        const to: any = query.hasOwnProperty('q')
          ? query.q
          : { name: 'index' };
        this.$router.replace(to);
      })
      .catch(() => {
        this.isFetching = false;
      });
  }
  submit() {
    (this.$refs.loginForm as any).validate((isValid: any) => {
      if (isValid) {
        this.login();
      } else {
        this.$Message.error('请输入有效的账号密码');
      }
    });
  }
}
</script>

<style type="text/less" lang="less" scoped>
@import (less) '~@/css/vars.less';

.page {
  padding: 120px 12px 0;
  .login-form {
    &-ft {
      margin-top: 38px;
    }
  }
}

.content {
  width: 100%;
  max-width: 540px;
  margin: 24px auto;
  &-hd {
    text-align: center;
    padding: 8px 12px 48px;
  }
  &-logo {
    width: 180px;
  }
  &-title {
    font-size: 16px;
    font-weight: bold;
    line-height: 1.8;
    color: #464c5b;
  }
}
</style>
