<template>
  <span :class="themeCls">{{percent | percentage}}</span>
</template>

<script type="text/ecmascript-6">
  import _ from 'lodash';

  export default {
    filters: {
      percentage(v, placeholder = '--') {
        if (_.isNil(v)) {
          return placeholder;
        }
        const percent = +v;
        if (_.isNumber(percent) && !_.isNaN(percent)) {
          switch (percent) {
            case 1:
              return '100%';
            case 0:
              return '0%';
            default :
              return `${(percent * 100).toFixed(2)}%`;
          }
        }

        return placeholder;
      }
    },
    props: {
      withTheme: {type: Boolean, default: true, required: false},
      value: {type: Number, default: null, required: false},
      count: {type: Number, default: 0, required: false},
      total: {type: Number, default: 0, required: false}
    },
    computed: {
      percent() {
        const {value, count, total} = this;
        if (!_.isNil(value)) {
          return value;
        } else if (total !== 0) {
          return count / total;
        }
        return null;
      },
      themeCls() {
        const {percent} = this;
        if (percent >= 0.98) {
          return 'text-success';
        } else if (percent < 0.8) {
          return 'text-error';
        }

        return 'text-info';
      }
    }
  };
</script>
