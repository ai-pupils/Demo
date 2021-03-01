<template lang="pug">
  section
    Modal(v-model="visible", width="80%", footer-hide)
      div(slot="header") 模型列表
      span 商品组ID: {{cabinetInfo.bundle_id}}
      span
      span.ml20 当前模型ID: {{cabinetInfo.model_id}}
      span
      span.ml20 当前模型名称: {{currentModel.model_name}}
      span
      TableBox(:state="loadData", data-key="models")
        Column(prop="model_id", label="模型ID", align="center", show-overflow-tooltip)
        Column(label="模型名称", align="center", show-overflow-tooltip)
          template(slot-scope="{row}") {{row.model_name | emptyText}}
        Column(label="模型描述", align="center", show-overflow-tooltip)
          template(slot-scope="{row}") {{row.model_desc | emptyText}}
        Column(label="分配状态", align="center", show-overflow-tooltip)
          template(slot-scope="{row}") {{row.is_allocated === true ? '已分配' : '未分配'}}
        Column(label="版本", align="center", show-overflow-tooltip)
          template(slot-scope="{row}") {{row.is_default === true ? '正式' : 'beta'}}
        Column(label="操作", align="center")
          template(slot-scope="{row}")
            Button(v-if="row.model_id !== cabinetInfo.model_id", type="primary", @click="changeModel(row)") 点击更换
</template>


<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import TableBox from '@/components/shared/TableBox.vue';
import { of } from 'rxjs';
import { createEmptyTrackMeta } from '@/utils/misc';
import { bindCabinetModelV2 } from '@/api/models';

@Component({
  components: { TableBox }
})
export default class App extends Vue {
  visible: boolean = false;
  loadData: any = createEmptyTrackMeta();
  cabinetInfo: any = {};

  open(data: any, row: any) {
    this.visible = true;
    this.loadData = data;
    this.cabinetInfo = row;
  }

  close() {
    this.visible = false;
  }

  changeModel(row: any) {
    this.msgbox$({
      message: `确定更换模型为${row.model_id}`,
      api: bindCabinetModelV2,
      apiParams: {
        model_id: row.model_id,
        id: this.cabinetInfo.id,
        dealer_id: this.cabinetInfo.dealer_id
      }
    }).subscribe(({ isFulfill }) => {
      if (isFulfill) {
        this.close();
        this.$Message.success('修改成功!');
        this.$emit('complete');
      }
    });
  }

  get currentModel() {
    if (this.loadData.isFulfill) {
      const model:any = this.loadData.payload.data.models.filter(
        (model: any) => model.model_id === this.cabinetInfo.model_id
      )[0];
      return model || {};
    }
    return {}
  }

  beforeDestroy() {
    this.loadData = [];
  }
}
</script>
