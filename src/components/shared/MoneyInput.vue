<template>
 <NumberInputGroup
    @input="updateModel"
    :prefix="prefix"
    :suffix="suffix"
    :value="value"
    :step="step"
    :placeholder="placeholder"
    :factor="factor"
    :min="min"
    :max="max"
    :disabled="disabled"
  ></NumberInputGroup>
</template>
<script type="text/ecmascript-6">
  import NumberInputGroup from './NumberInputGroup';

  export default {
    props: {
      prefix: {type: String, default: '￥'},
      suffix: {type: String},
      value: {},
      step: {type: [Number, String], default: 0.01},
      placeholder: {type: String},
      factor: {type: Number, default: 100},
      min: {type: Number},
      max: {type: Number},
      disabled: {type: Boolean, default: false}
    },
    components: {NumberInputGroup},
    methods: {
      updateModel(newVal) {
        this.$emit('input', newVal);
        this.$emit('change');
      }
    }
  };
</script>
