<template lang="pug">
  StatusBox.code-view(:isfetching='isLoading')
    template(v-if='isReady')
      div
        label.code-view-title {{ title }}
        pre.code-view-code(v-highlightjs='code')
          code.JSON
</template>

<script lang="ts">
import _ from 'lodash';
import StatusBox from '@/components/shared/StatusBox.vue';
import Component, { mixins } from 'vue-class-component';
import TransactionDetailsParseMixin from '@/view/transaction/detailsParseMixin';
import { Prop } from 'vue-property-decorator';

@Component({
  components: { StatusBox }
})
export default class ResponseView extends mixins(TransactionDetailsParseMixin) {
  @Prop({ type: [Object, Error] })
  response!: any;
  @Prop({ type: Boolean, default: false })
  isLoading!: boolean;
  @Prop({ type: String, default: 'Detect Results' })
  title!: string;

  get isReady(): boolean {
    return !this.isLoading && !_.isNil(this.response);
  }

  get code(): any {
    const { response } = this;
    return JSON.stringify(
      this.isError ? response : response.data,
      null,
      '    '
    );
  }

  get isError(): boolean {
    return this.status !== '200';
  }

  get status(): string {
    const { response } = this;
    return response.status === 0 ? '200' : response.status;
  }
}
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
