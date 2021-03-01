<template>
  <input autocomplete="off" type="text" :placeholder="placeholder" :value="display" @change="updateModel" class="ivu-input">
</template>
<script type="text/ecmascript-6">
  import _ from 'lodash';

  export default {
    props: {
      value: {},
      step: {type: [Number, String], default: 1},
      placeholder: {type: String},
      factor: {type: Number, default: 1},
      min: {},
      max: {}
    },
    computed: {
      display() {
        return this.factorize(this.value);
      },
      minVal() {
        return this.factorize(this.min);
      },
      maxVal() {
        return this.factorize(this.max);
      }
    },
    watch: {
      step() {
        this.updateFraction();
      }
    },
    data() {
      return {fraction: null};
    },
    mounted() {
      this.updateFraction();

      const v = this.value;
      if (isNaN(v) || _.isString(v)) {
        return;
      }
      this.$emit('input', this.fix(v));
    },
    methods: {
      updateFraction() {
        this.fraction = this.getFractionLength();
      },
      getFractionLength() {
        const step = this.step.toString();
        const eidx = step.indexOf('e-'); // 1e-8
        if (~eidx) {
          return step.substring(eidx + 2) * 1;
        }

        const didx = step.indexOf('.'); // 0.08
        if (~didx) {
          return step.length - didx - 1;
        }
        return 0; // has no fraction part
      },
      factorize(v) {
        return this.fix(v / this.factor);
      },
      unfactorize(v) {
        return this.fix(v * this.factor);
      },
      fix(v) {
        if (isNaN(v)) {
          return undefined;
        }
        let t = v.toFixed(this.fraction);
        if (~t.indexOf('.')) {
          t = _.trimEnd(_.trimEnd(t, '0'), '.');
        }
        return t;
      },
      updateModel(e) {
        let val = this.unfactorize(e.target.value);
        if (!isNaN(this.min) && val * 1 <= this.min) {
          val = (this.min * 1) + (this.step * this.factor);
        }
        if (!isNaN(this.max) && val * 1 >= this.max) {
          val = this.max - (this.step * this.factor);
        }
        e.target.value = this.factorize(val);
        this.$emit('input', isNaN(val) ? undefined : val);
        this.$emit('change');
      }
    }
  };
</script>
