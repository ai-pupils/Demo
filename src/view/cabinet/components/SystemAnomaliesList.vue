<template lang="pug">
  div
    TableBox(:state='state', :default-sort='defaultSort', @sortChange='sortChange')
      Column(prop='id', align='center', label='异常ID')
      Column(prop='start_reason_code', align='center', label='异常代码')
      Column(align='center', label='异常名称')
        template(slot-scope='{row}')
          | {{row.error_name}}
      Column(align='center', label='异常图片')
        template(slot-scope='{row}')
          div
            div(v-if='row.trx_id')
              a(@click.prevent='showImages(row.trx_id)') 查看图片
            div(v-else='') -
      Column(prop='status', align='center', label='异常状态')
        template(slot-scope='{row}')
          | {{row.status | getAnomalyStatusTypes}}
      Column(prop='status_start_time', align='center', label='开始时间', sortable="custom")
        template(slot-scope='{row}')
          | {{row.status_start_time | fmtLocalTime}}
      Column(prop='status_end_time', align='center', label='结束时间', sortable="custom")
        template(slot-scope='{row}')
          | {{row.status_end_time | fmtLocalTime}}
      Column(align='center', label='操作')
        template(slot-scope='{row}')
          Button(@click="createHandler(row)", :disabled="isCanCreate(row)") 转为故障
    Modal(ref='carousel', v-model='carouselVisible', :footer-hide='true', :width='1000')
      header(slot='header')
        h3 相关图片
      Carousel(type='card', indicator-position='outside', height='450px', arrow='always', :autoplay='false')
        Spin(size='large', fix, v-if='urls.length === 0')
        CarouselItem(v-for='item in urls', :key='item')
          LazyloadImg(:src='item')
    SystemFaultInitModal(ref='initModal', :faultType="CabinetFaultSource.EXCEPTION.id")
</template>


<script lang="ts">
  import Vue from 'vue';
  import Component from 'vue-class-component';
  import _ from 'lodash';
  import { Carousel, CarouselItem } from 'element-ui';
  import TableBox from '@/components/shared/TableBox.vue';
  import LazyloadImg from '@/components/shared/LazyloadImg.vue';
  import { getTransactionBySn$ } from '@/api/transaction';
  import {Prop} from "vue-property-decorator";
  import {MetaType} from "@/interface";
  import SystemFaultInitModal
    from "@/view/cabinet/components/SystemFaultInitModal.vue";
  import {CabinetFaultSource} from '@/const/data/cabinetFault';

  @Component({
    components: {
      TableBox,
      LazyloadImg,
      Carousel,
      CarouselItem,
      SystemFaultInitModal
    }
  })
  export default class SystemAnomaliesList extends Vue {
    @Prop() state!: MetaType;
    @Prop() cabinetId!: number;
    @Prop() sortChange!: any;
    @Prop() defaultSort!: any;
    CabinetFaultSource = CabinetFaultSource;
    urls: any = [];
    carouselVisible: boolean = false;
    showImages(id: number) {
      this.carouselVisible = true;
      this.urls = [];
      getTransactionBySn$({id: id}).subscribe(withMetaResponse => {
        const payload = withMetaResponse.payload.data;
        const layerInfo = payload.layer_info;

        if (layerInfo) {
          this.urls = this.urls.concat(_.map(layerInfo, e => e.start_image));
          this.urls = this.urls.concat(_.map(layerInfo, e => e.end_image));
        }
      });
    }
    isCanCreate(row: any){
      return _.hasIn(row, 'fault_id');
    }
    createHandler(row: any){
      row.cabinetId = this.cabinetId;
      (this.$refs["initModal"] as SystemFaultInitModal).load(row);
    }
  }
</script>
