<template>
  <Tooltip placement="left" class="block-tip" :disabled="value<=0">
    <template slot="content">
      {{label}}{{percentValue | percent}}
    </template>
    <slot>
      <span>{{value | currency('', 0)}}</span>
    </slot>
    <Progress v-if="value>0" :status="status" :percent="percent" :hide-info="true"></Progress>
  </Tooltip>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      total: {type: Number, required: true, default: 0},
      value: {type: Number, required: true, default: 0},
      status: {type: String, required: false, default: 'normal'},
      label: {type: String, required: false, default: ''}
    },
    computed: {
      percent() {
        return this.percentValue * 100;
      },
      percentValue() {
        const {total, value} = this;
        if (total === 0) {
          return 0;
        }

        return value / total;
      }
    }
  };
</script>

<style type="text/less" lang="less" scoped>
  .block-tip {
    padding: 0 8px;
  }
</style>
