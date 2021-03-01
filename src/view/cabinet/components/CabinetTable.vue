<template lang="pug">
  div
    TableBox(:state='state', :default-sort='defaultSort')
      Column(label='货柜ID', align='center', prop='id')
      Column(label='货柜ManagerID', align='center', prop='manager_cabinet_id')
        template(slot-scope='{row}')
          router-link(:to="{ name: 'transaction-list', query: { keyword: row.manager_cabinet_id }}")
            | {{row.manager_cabinet_id}}
      Column(label='货柜编号', align='center')
        template(slot-scope='{row}') {{row.serial | emptyText}}
      Column(label='货柜名称', align='center', prop='name')
      Column(label='柜体类别', align='center', prop='arch')
        template(slot-scope='{row}') {{(row.cabinet_type_info && row.cabinet_type_info.arch) | getCabinetArchTypes}}
      Column(label='商品组', align='center')
        template(slot-scope='{row}')
          div(v-if='row.bundle_id > 0') {{ row.bundle_id}}
          div(v-else)
            a(@click.prevent='showBundles(row)', v-if="row.status === 'authorized' || row.status === 'available'") 绑定商品组
            span(v-else) -
      Column(label='货柜运营状态', align='center')
        template(slot-scope='{row}') {{row.status | getCabinetStatusTypes}}
      Column(label='货柜运行状态', align='center')
        template(slot-scope='{row}') {{row.runtime_status | getCabinetRuntimeStatusTypes}}
      Column(label='货柜位置', align='center')
        template(slot-scope='{row}') {{row.location | emptyText}}
      Column(label='商户ID', align='center')
        template(slot-scope='{row}') {{row.dealer_id}}
      Column(label='货柜描述', align='center', prop='desc')
        template(slot-scope='{row}') {{row.desc | emptyText}}
      Column(label='柜体名称', align='center')
        template(slot-scope='{row}') {{(row.cabinet_type_info && row.cabinet_type_info.name) | emptyText}}
      Column(label='操作', align='center', fixed="right", width="150px")
        template(slot-scope='{row}')
          section
            Row
              Button(@click='goView(row)') 查看
              Button(type='primary', @click='handleEditCabinet(row)') 编辑
            Row(style='margin-top: 5px;')
              Button(type='primary', ghost, @click='handleQrCodeModal(row)') 验证工具二维码
    BindSkuBundleModal(ref='BindSkuBundleModal')
    QRCodeModal(ref='QRCodeModalRef', :rowData='currentRowData')
    EditCabinetModal(ref='EditCabinetModal')
</template>

<script lang="ts">
  import Component from "vue-class-component";
  import PaginationBox from '@/components/shared/PaginationBox.vue';
  import _ from 'lodash';
  import Vue from 'vue';
  import TableBox from '@/components/shared/TableBox.vue';
  import BindSkuBundleModal from './BindSkuBundleModal.vue';
  import QRCodeModal from './QRCodeModal.vue';
  import EditCabinetModal from './EditCabinetModal.vue';
  import {Prop} from "vue-property-decorator";

  @Component({
    components: {
      TableBox,
      PaginationBox,
      BindSkuBundleModal,
      QRCodeModal,
      EditCabinetModal
    }
  })
  export default class CabinetTable extends Vue {
    @Prop() state!: any;
    @Prop() sortChange!: any;
    @Prop() defaultSort!: any;
    @Prop() params_id!: number;
    currentRowData: any = {};

    handleEditCabinet(row: any) {
      // 打开编辑货柜Modal
      const {id, name, desc, location, hybrid_enable: hybridEnable} = row;
      (this.$refs.EditCabinetModal as EditCabinetModal).load(row, {
        id,
        name,
        desc,
        location,
        hybridEnable: Boolean(hybridEnable)
      });
    }

    goView(row: any) {
      this.$router.push({name: 'cabinet-detail', params: {id: row.id}});
    }

    showBundles(row: any) {
      if(row.bundle_id <= 0){
        (this.$refs.BindSkuBundleModal as BindSkuBundleModal).load(row);
      }else {
        this.$Modal.confirm({
          title: '确认',
          content: '本货柜已绑定商品组，确认更改商品组？',
          onOk: () => {
            (this.$refs.BindSkuBundleModal as BindSkuBundleModal).load(row);
          }
        })
      }
    }

    handleQrCodeModal(row: any) {
      this.currentRowData = row;
      (this.$refs.QRCodeModalRef as QRCodeModal).open();
    }
  }

</script>
