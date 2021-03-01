<template lang="pug">
  div
    TableBox(:state='state', :default-sort='defaultSort')
      Column(label='柜体ID', align='center', prop='id')
      Column(label='柜体名称', align='center', prop='name')
      Column(label='柜体厂商', align='center', prop='manufacturer')
      Column(label='货柜数', align='center')
        template(slot-scope='{row}')
          div(v-if="row.statistics")
            router-link(:to="{name: 'cabinet-list', query:{pageIndex: 1, pageSize: 20, keyword: row.name}}")
              | {{ row.statistics.cabinet_count }}
          div(v-else='') -
      Column(label='类型', align='center', prop='type')
      Column(label='创建时间', align='center')
        template(slot-scope='{row}') {{row.create_time | fmtLocalTime}}
      Column(label='升级时间', align='center')
        template(slot-scope='{row}') {{row.udpate_time | fmtLocalTime}}
      Column(label='视觉ID', align='center', prop='vision_id')
      Column(label='备注', align='center' prop='comment')
      Column(label='操作', align='center')
        template(slot-scope='{row}')
          Button(@click='goView(row)') 查看
</template>

<script lang="ts">
  import Component from "vue-class-component";
  import PaginationBox from '@/components/shared/PaginationBox.vue';
  import Vue from 'vue';
  import TableBox from '@/components/shared/TableBox.vue';
  import {Prop} from "vue-property-decorator";

  @Component({
    components: {
      TableBox,
      PaginationBox
    }
  })
  export default class CabinetTypeTable extends Vue {
    @Prop() state!: any;
    @Prop() sortChange!: any;
    @Prop() defaultSort!: any;
    @Prop() params_id!: number;
    currentRowData: any = {};

    goView(row: any) {
      this.$router.push({name: 'cabinet-type-detail', params:{id: row.id}});
    }
  }

</script>
