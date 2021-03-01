<template lang="pug">
  section
    TableBox(:state='state', style='min-height:250px', @sortChange='sortChanged')
      Column(align='center', label='商户ID', :width='120', :show-overflow-tooltip='true')
        template(slot-scope='{row}')
          div(v-if="row.dealer")
            router-link(:to="{name:'dealer-detail',params:{id: row.dealer.id}}") {{row.dealer.id}}
          span(v-else) {{''| empty}}
      Column(align='center', label='商户名称', :width='160', :show-overflow-tooltip='true')
        template(slot-scope='{row}')
          span(v-if="row.dealer") {{row.dealer.name | empty}}
          span(v-else) {{''| empty}}
      Column(align='center', label='柜体ID', :width='120', :show-overflow-tooltip='true')
        template(slot-scope='{row}')
          div(v-if="row.cabinet && row.cabinet.type && getFieldsListLength(row.cabinet.type.id) > 1")
            | {{row.cabinet.type.id}}
          div(v-else)
            router-link(v-if="row.cabinet", :to="{name:'cabinet-type-detail', params:{id: row.cabinet.type.id}}")
              | {{row.cabinet.type.id}}
            span(v-else) {{''| empty}}
      Column(align='center', label='柜体名称', :width='160', :show-overflow-tooltip='true')
        template(slot-scope='{row}')
          span(v-if="row.cabinet") {{row.cabinet.type.name | empty}}
          span(v-else) {{''| empty}}
      Column(align='center', label='箱体编号', :min-width='200', :show-overflow-tooltip='true')
        template(slot-scope='{row}')
          div(v-if="row.cabinet && getFieldsListLength(row.cabinet.serial) > 1")
            | {{row.cabinet.serial}}
          div(v-else)
            router-link(v-if="row.cabinet", :to="{name:'cabinet-detail',params:{id: row.cabinet.id}, query: {visionId: row.cabinet.type.vision_id}}")
              | {{row.cabinet.serial | empty}}
            span(v-else) {{''| empty}}
      Column(align='center', label='商品组ID', :width='120', :show-overflow-tooltip='true')
        template(slot-scope='{row}')
          div(v-if="row.bundle && getFieldsListLength(row.bundle.id) > 1")
            | {{row.bundle.id}}
          div(v-else)
            router-link(v-if="row.bundle && row.bundle.id", :to="{name:'v2-sku-bundle-detail',params:{skuBundleId: row.bundle.id}}")
              | {{row.bundle.id}}
            span(v-else) {{''| empty}}
      Column(align='center', label='模型ID', :width='120', :show-overflow-tooltip='true')
        template(slot-scope='{row}')
          div(v-if="row.model_id && getFieldsListLength(row.model_id) > 1")
            | {{row.model_id}}
          div(v-else)
            router-link(v-if="row.model_id && row.bundle && row.bundle.id",
              :to="{name:'v2-sku-bundle-detail',params:{skuBundleId: row.bundle.id}, query: {visionId: row.cabinet.type.vision_id, tabName: 'modelList'}}")
              | {{row.model_id}}
            span(v-else) {{row.model_id | empty}}
      Column(prop='total_count', align='center', label='总交易数', :width='120', :show-overflow-tooltip='true')
      Column(align='center', label='模型')
        Column(prop='model_correct_count', align='center', label='准确数量', :width='120', :show-overflow-tooltip='true')
        Column(prop='model_correct_ratio', align='center', label='准确率', :width='120', :show-overflow-tooltip='true')
      Column(align='center', label='系统')
        Column(prop='system_correct_count', align='center', label='准确数量', :width='120', :show-overflow-tooltip='true')
        Column(prop='system_correct_ratio', align='center', label='准确率', :width='120', :show-overflow-tooltip='true')
      Column(align='center', label='实际')
        Column(prop='payment_correct_count', align='center', label='准确数量', :width='120', :show-overflow-tooltip='true')
        Column(prop='payment_correct_ratio', align='center', label='准确率', :width='120', :show-overflow-tooltip='true')
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import TableBox from "@/components/shared/TableBox.vue";

@Component({
  components: { TableBox }
})
export default class RecognitionList extends Vue {
  @Prop() state!: any;

  sortChanged(params: any) {
    this.$emit('sortChanged', params);
  }

  getFieldsList(field: string) {
    if(field){
      return  field.split(',')
    }
    return [];
  }

  getFieldsListLength(serials: string) {
    return this.getFieldsList(serials).length;
  }
}
</script>

<style scoped></style>
