<template>
  <div class="ivu-input-wrapper ivu-input-type ivu-input-group"
    :class="{
      'ivu-input-group-with-prepend': !!prefix,
      'ivu-input-group-with-append': !!suffix
    }">
    <div class="ivu-input-group-prepend" v-if="prefix"><span>{{ prefix }}</span></div>
    <i class="ivu-icon ivu-icon-load-c ivu-load-loop ivu-input-icon ivu-input-icon-validate"></i>
    <NumberInput
      @input="updateModel"
      class="ivu-input"
      :value="value"
      :step="step"
      :placeholder="placeholder"
      :factor="factor"
      :min="min"
      :max="max"
    ></NumberInput>
    <div class="ivu-input-group-append" v-if="suffix"><span>{{suffix}}</span></div>
 </div>
</template>
<script type="text/ecmascript-6">
  import NumberInput from './NumberInput';

  export default {
    props: {
      prefix: {type: String},
      suffix: {type: String},
      value: {},
      step: {type: [Number, String]},
      placeholder: {type: String},
      factor: {type: Number},
      min: {type: Number},
      max: {type: Number}
    },
    components: {NumberInput},
    methods: {
      updateModel(newVal) {
        this.$emit('input', newVal);
        this.$emit('change');
      }
    }
  };
</script>
