<template lang="pug">
  TableBox(:state="state", :dataKey="dataKey")
      slot(name="order")
        Column(label='序号', align='center', :width="120", type='index')
      Column(label='ID', align='center', prop='id', :width="120")
      Column(label='指令名称', align='center', prop='name', :width="160")
      Column(label='指令内容', align='center')
        template(slot-scope="{ row }")
          pre(style="white-space: pre-line")
            | {{row.hints}}
      Column(label='示例图', align='center', :width="280")
        template(slot-scope="{ row }")
          a(:href="row.image_urls[0]", target="__blank")
            figure(class="sample-container")
              LazyloadImg(class="sample" :src="row.image_urls[0]")
              figcaption(v-if="row.image_urls.length - 1", class="sample-describe")
                | +{{row.image_urls.length - 1}}
      Column(label="拍摄层板" align="center" prop="layer_index", :width="160")
      Column(label="操作", align="center")
        template(slot-scope="{row}")
          slot(name="operation" :info="row")
            Button(type='primary', @click="startEdit(row)")
              | 编辑指令
</template>
<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import TableBox from '@/components/shared/TableBox.vue';
import LazyloadImg from '@/components/shared/LazyloadImg.vue';

@Component({
  components: {TableBox, LazyloadImg}
})
export default class InstructionsTable extends Vue{
  @Prop({ type: Object, required: true })
  state: any;
  @Prop({ type: String, required: false, default: 'data' })
  dataKey?: string;

  startEdit(row: any) {
    this.$emit('start-edit', row)
  }
}
</script>
<style lang="less" scoped>
  @import (less) '~@/css/vars.less';

  .sample {
    flex-grow: 1;
    line-height: 0px;
    &-container {
      display: flex;
      align-items: center;
      padding: 3px 5px;
    }
    &-describe {
      margin-left: 8px;
      flex-basis: 20px;
      flex-shrink: 0;
      color: @color-sub-color;
    }
  }
</style>
