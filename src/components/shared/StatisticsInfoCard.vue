<template lang="pug">
  .charts
    Row(:gutter="24", v-for="(row, index) in rows", :key="index")
      Col.mb10(v-for="(item, index) in row", :key="index", :span="span", :xs="24", :sm="span * 2", :md="span * 2", :lg="span")
        Card
          p.total_count.col(slot="title")
            span.col_key {{item.title}}
            span.col_value {{item.count}}
          .col(v-for="(content,index) in item.contents", :key="index")
            span.col_key {{content.label}}
            span.col_value {{content.count}}
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import { of } from 'rxjs';
import { bufferCount, concatAll, toArray } from 'rxjs/operators';

export interface StatisticsInfoCardType {
  title: string;
  count?: number;
  contents: Array<{
    label: string;
    count: number;
  }>;
}

@Component({})
export default class App extends Vue {
  @Prop({ type: Number, default: 6 })
  span!: number;
  @Prop({ type: Array, required: true, default: () => [] })
  data!: StatisticsInfoCardType[];
  rows: StatisticsInfoCardType[][] = [];

  @Watch('data', { immediate: true })
  dataChange(data: StatisticsInfoCardType[]) {
    of(data)
      .pipe(
        concatAll(),
        bufferCount(24 / this.span),
        toArray()
      )
      .subscribe((data: any) => {
        this.rows = data;
      });
  }
}
</script>

<style lang="scss" scoped>
.total_count {
  font-size: 16px;
}

.col {
  display: flex;
  position: relative;
  margin-bottom: 10px;
}

.col_key {
  text-aligindexindexn: left;
  flex: 1;
}

.col_value {
  text-align: right;
  font-weight: bold;
}
</style>
