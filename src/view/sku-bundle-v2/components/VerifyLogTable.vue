<template lang="pug">
  .table-wrappe
    TableBox(:state="logs")
      Column(align='center', label='审核步骤', :show-overflow-tooltip='true')
        template(slot-scope="{row}")
          | {{getLabel(row)}}
      Column(prop="operator_name", align='center', label='审核人', :show-overflow-tooltip='true')
      Column(align='center', label='审核结果', :show-overflow-tooltip='true')
        template(slot-scope="{row}")
          | {{getResult(row)}}
      Column(align='center', label='审核时间', :show-overflow-tooltip='true')
        template(slot-scope="{row}")
          | {{row.created_at | fmtLocalTime}}
      Column(align='center', label='审核备注', :show-overflow-tooltip='true')
        template(slot-scope="{row}")
          | {{(row.to_info && row.to_info.audited_comment) | emptyText}}
</template>

<script lang="ts">
import _ from 'lodash';
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { MetaType } from '@/interface';
import TableBox from '@/components/shared/TableBox.vue';
import { skuBundleLogStatus } from '@/const/data/sku-bundle';

@Component({
  components: { TableBox }
})
export default class VerifyLogTable extends Vue {
  @Prop() logs!: MetaType;

  getLabel(row: any): string {
    const { from_info, to_info } = row;
    if (
      from_info &&
      to_info &&
      from_info.status === 'PENDING' &&
      ["TRAINING","ACCEPTED","DEPLOYING"].indexOf(to_info.status) > -1
    ) {
      return skuBundleLogStatus[`${from_info.status}+${to_info.status}`];
    }
    if (to_info) {
      const { status, audited_status } = to_info;
      if ((status === 'REVIEWING' || status === 'REJECTED') && audited_status) {
        return skuBundleLogStatus[audited_status];
      } else if (status === 'ACCEPTED' && audited_status) {
        return skuBundleLogStatus[audited_status];
      } else if (status === 'TRAINING' && audited_status === 'ACCEPTED_THIRD') {
        return skuBundleLogStatus[`${status}+${audited_status}`];
      } else {
        return skuBundleLogStatus[status];
      }
    }
    return skuBundleLogStatus[to_info.status];
  }

  getResult(row: any): string {
    let r = '';
    const { from_info, to_info } = row;

    if (from_info && to_info) {
      if (_.isEmpty(from_info)) {
        return '--';
      }
      if (from_info.status === 'PENDING' && to_info.status === 'REVIEWING') {
        return '--';
      }
      if (
        from_info.audited_status &&
        from_info.audited_status.indexOf('REJECTED') > -1 &&
        to_info.status === 'REVIEWING'
      ) {
        return '--';
      }
    }

    if (to_info && to_info.audited_status) {
      if (to_info.audited_status.indexOf('ACCEPTED') > -1) {
        r = '审核通过';
      } else {
        r = '审核未通过';
      }
    } else {
      r = '审核通过';
    }
    return r;
  }
}
</script>

<style scoped lang="scss"></style>
