<template>
  <Exception status="403" title="Permission Denied">
    <p>您没有权限访问该资源</p>
    <p>
      您可返回 <a href="javascript:;" @click="goBack">上一页</a>，或回到
      <router-link :to="{name:'index'}">首页</router-link>
    </p>
  </Exception>
</template>

<script type="text/ecmascript-6">
import Exception from '@/components/shared/Exception';

export default {
  components: { Exception },
  methods: {
    goBack() {
      this.$router.go(-1);
    }
  }
};
</script>
