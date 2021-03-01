<template>
  <Button
  :type="type"
  :size="size"
  :shape="shape"
  :long="long"
  :disabled="disabled"
  :loading="loading"
  :icon="icon"
  @click="goto">
    <slot></slot>
  </Button>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      type: {type: String},
      size: {type: String},
      shape: {type: String},
      long: {type: Boolean},
      disabled: {type: Boolean},
      loading: {type: Boolean},
      icon: {type: String},
      to: {required: true, type: Object}
    },
    methods: {
      goto() {
        this.$router.push(this.to);
      }
    }
  };
</script>
