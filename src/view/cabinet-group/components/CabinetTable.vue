<template lang="pug">
  section
    TableBox(ref="tableBox", :state='cabinetsState')
      .is-can-edit(v-if="canEdit || setSelectAll")
        Column(v-if="setSelectAll", width="60", fixed="left")
          template(slot-scope='{row}')
            Checkbox(v-model="row.is_selected", @on-change="select(row)", :indeterminate="indeterminate")
        Column(v-else, width="60", fixed="left")
          template(slot='header', slot-scope='slot')
            Checkbox(v-model="isCheckedAll", :indeterminate="indeterminate", @on-change="selectedAll")
          template(slot-scope='{row}')
            Checkbox(v-model="row.is_selected", @on-change="select(row)")
      Column(label='货柜ID', align='center', prop='id', :show-overflow-tooltip='true')
      Column(label='箱体ID', align='center', :show-overflow-tooltip='true')
        template(slot-scope='{row}') {{row.serial | emptyText}}
      Column(label='货柜名称', align='center', prop='name', :show-overflow-tooltip='true')
      Column(label='点位地址', align='center', :show-overflow-tooltip='true')
        template(slot-scope='{row}') {{row.location | emptyText}}
      Column(label='视觉ID', align='center', :show-overflow-tooltip='true')
        template(slot-scope='{row}') {{row.cabinet_type_info && row.cabinet_type_info.vision_id | emptyText}}
      Column(label='货柜运营状态', align='center', :show-overflow-tooltip='true')
        template(slot-scope='{row}') {{row.status | getCabinetStatusTypes}}
      Column(label='货柜运行状态', align='center', :show-overflow-tooltip='true')
        template(slot-scope='{row}') {{row.runtime_status | getCabinetRuntimeStatusTypes}}
      Column(label='商品组ID', align='center', :show-overflow-tooltip='true')
        template(slot-scope='{row}')
          div(v-if='row.bundle_id > 0')
            router-link(:to="{name: 'v2-sku-bundle-list', query:{pageIndex: 1, keyword: row.bundle_id}}", target="_blank")
              | {{row.bundle_id}}
          div(v-else)
            span --
      Column(label='商户ID', align='center', :show-overflow-tooltip='true')
        template(slot-scope='{row}')
          router-link(v-if="row.dealer_id > 0", :to="{name:'dealer-detail', params:{id: row.dealer_id}}", target="_blank")
            | {{row.dealer_id}}
          span(v-else) --
      Column(label='操作', align='center', fixed="right", width="150px", :show-overflow-tooltip='true')
        template(slot-scope='{row}')
          router-link(:to="{name: 'cabinet-detail', params: {id: row.id}}", target="_blank") 查看
</template>

<script lang="ts">
import Component from 'vue-class-component';
import Vue from 'vue';
import TableBox from '@/components/shared/TableBox.vue';
import { Prop, Watch } from 'vue-property-decorator';
import { Getter, Mutation } from 'vuex-class';
import { MetaType } from '@/interface';
import { createEmptyTrackMeta } from '@/utils/misc';
import _ from 'lodash';

@Component({
  components: {
    TableBox
  }
})
export default class CabinetTable extends Vue {
  @Getter('cabinetGroup/cabinets') selectCabinets!: any[];
  @Mutation('cabinetGroup/setCabinets') setCabinets!: any;
  @Prop() cabinets!: any[];
  @Prop() setSelectAll!: boolean;
  @Prop() canEdit!: boolean;
  indeterminate = false;
  isCheckedAll = false;
  cabinetsState: MetaType<any> = createEmptyTrackMeta({
    data: { results: {} }
  } as any);

  @Watch('cabinets', { immediate: true, deep: true })
  cabinetsChanged(cabinets: any[]) {
    if (cabinets) {
      this.cabinetsState.isFulfill = true;
      this.cabinetsState.isFetching = false;
      this.cabinetsState.payload.data.results = _.cloneDeep(cabinets);
    }
  }

  // 监听当前页面所有数据的选中状态
  @Watch('cabinetsState.payload.data.results', {immediate: true, deep: true})
  cabinetsStateChanged(cabinets: any[]){
    // 如果都选中 isCheckedAll = true, indeterminate = false
    // 如果选中部分 isCheckedAll = false, indeterminate = true
    // 如果没有选中 isCheckedAll = false, indeterminate = false
    const selected = cabinets.filter(c => c.is_selected);
    if(selected.length === this.cabinets.length){
      this.indeterminate = false;
      this.isCheckedAll = true;
    } else if(selected.length === 0) {
      this.indeterminate = false;
      this.isCheckedAll = false;
    } else {
      this.indeterminate = true;
      this.isCheckedAll = false;
    }
  }

  selectedAll(val: boolean) {
    let all = _.cloneDeep(this.cabinets);
    all.forEach(row => {
      row.is_selected = val;
    });

    if (val) {
      this.setCabinets({
        name: 'all',
        rows: all
      });
    } else {
      this.setCabinets({
        name: 'all',
        pageData: this.cabinets
      });
    }
  }

  select(row: any) {
    row.is_selected = true;
    this.setCabinets({ name: 'single', row: { ...row } });
  }
}
</script>

<style scoped></style>
