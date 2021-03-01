<template lang="pug">
  Row(:gutter="24")
    Col(span="4" :xs="24" :sm="12" :md="8" :lg="4")
      Card
        .total_count.col.bold
          span.col_key 货柜数
          span.col_value {{totalCount}}
    Col(span="4" :xs="24" :sm="12" :md="8" :lg="4" style="margin-bottom: 10px;")
      Card
        .total_count.col.bold
          span.col_key 激活货柜数
          span.col_value {{activeCount}}
    Col(span="4" :xs="24" :sm="12" :md="8" :lg="4" style="margin-bottom: 10px;")
      Card
        .total_count.col.bold
          span.col_key 运营货柜数
          span.col_value {{availableCount}}
</template>

<script lang="ts">
  import Vue from 'vue';
  import Component from 'vue-class-component';
  import {Prop, Watch} from "vue-property-decorator";

  @Component({})
  export default class CabinetCards extends Vue {
    @Prop() cabinetStatusInfo: any;
    totalCount: number = 0;
    activeCount: number = 0;
    availableCount: number = 0;

    @Watch('cabinetStatusInfo', {immediate: true})
    cabinetStatusInfoChange(info: any) {
      if (info.isFulfill) {
        const {results, total_count} = info.payload.data;
        this.totalCount = total_count;
        let available_count = 0;
        const data1 = results.filter((d: any) => d.status === 'available');
        if (data1 && data1.length > 0) {
          available_count = data1[0].count;
        }

        let authorized_count = 0;
        const data2 = results.filter((d: any) => d.status === 'authorized');
        if (data2 && data2.length > 0) {
          authorized_count = data2[0].count;
        }

        this.availableCount = available_count;
        this.activeCount = authorized_count + available_count;
      }
    }
  }
</script>

<style scoped>
  .total_count {
    font-size: 16px;
  }

  .col {
    display: flex;
    position: relative;
  }

  .col_key {
    text-align: left;
    flex: 1;
  }

  .col_value {
    text-align: right;
    font-weight: bold;
  }
</style>
