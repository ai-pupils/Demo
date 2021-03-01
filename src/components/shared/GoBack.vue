<template>
  <Button class="btn" type="text" @click="back"><i class="fa fa-arrow-left"></i> 后退</Button>
</template>

<script type="text/ecmascript-6">
  export default {
    props: ['to'],
    methods: {
      back() {
        if (this.to) {
           this.$router.push(this.to);
        } else {
          this.$router.go(-1);
        }
      }
    }
  };
</script>

<style type="text/less" lang="less" scoped>
  .btn {
    margin-bottom: 4px;
    padding-left: 0;
  }
</style>
