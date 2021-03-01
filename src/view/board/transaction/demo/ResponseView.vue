<template>
  <StatusBox :isFetching="isLoading" class="code-view">
    <template v-if="isReady">
      <div>
        <label class="code-view-title">Detect Results</label>
        <pre v-highlightjs="code" class="code-view-code"><code class="JSON"></code></pre>
      </div>
    </template>
  </StatusBox>
</template>

<script type="text/ecmascript-6">
import _ from 'lodash';
import StatusBox from '../../../../components/shared/StatusBox';

export default {
  components: { StatusBox },
  props: {
    response: {
      type: [Object, Error],
      required: false
    },
    isLoading: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  computed: {
    isReady() {
      return !this.isLoading && !_.isNil(this.response);
    },
    code() {
      const { response } = this;
      return JSON.stringify(
        this.isError ? response : response.data,
        null,
        '    '
      );
    },
    isError() {
      return this.status !== '200';
    },
    status() {
      const { response } = this;
      return response.status === 0 ? '200' : response.status;
    }
  }
};
</script>

<style type="text/less" lang="less" scoped>
.code-view {
  line-height: 1.2;
  font-size: 12px;
  min-height: 180px;
  &-title {
    font-size: 12px;
    color: #323232;
    display: block;
    margin: 0;
    font-weight: normal;
  }
  &-code {
    color: #fff;
    border-radius: 2px;
    background-color: #1e1e1e;
    padding: 10px;
    margin: 5px 0 15px 0;
    word-break: break-all;
    word-wrap: break-word;
    border: none;
  }
}
</style>
