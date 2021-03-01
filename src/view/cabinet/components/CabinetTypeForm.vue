<template lang="pug">
  div
    Row.info-title 基本信息
    Row.info-box
      Form(inline, :label-width='110', label-position='left')
        Col(span='8')
          FormItem(label='柜体ID:') {{cabinetTypeInfo.id}}
        Col(span='8')
          FormItem(label='柜体名称:') {{cabinetTypeInfo.name | emptyText}}
        Col(span='8')
          FormItem(label='柜体类型:') {{cabinetTypeInfo.type | emptyText}}
    Row.info-box
      Form(inline, :label-width='110', label-position='left')
        Col(span='8')
          FormItem(label='柜体厂商:') {{cabinetTypeInfo.manufacturer | emptyText}}
        Col(span='8')
          FormItem(label='货柜数:')
            div(v-if="cabinetTypeInfo.statistics")
              router-link(:to="{name: 'cabinet-list', query:{pageIndex: 1, pageSize: 20, keyword: cabinetTypeInfo.name}}")
                | {{ cabinetTypeInfo.statistics.cabinet_count }}
            div(v-else='') -
        Col(span='8')
          FormItem(label='创建时间:') {{cabinetTypeInfo.create_time | fmtLocalTime}}
    Row.info-box
      Form(inline, :label-width='110', label-position='left')
        Col(span='8')
          FormItem(label='升级时间:') {{cabinetTypeInfo.udpate_time | fmtLocalTime}}
        Col(span='8')
          FormItem(label='备注:') {{cabinetTypeInfo.comment | emptyText}}
    Row.info-box
      Form(inline, :label-width='110', label-position='left')
        Col(span='8')
          FormItem(label='锁具型号:') {{cabinetTypeInfo.lock_model | emptyText}}
        Col(span='8')
          FormItem(label='路由器:') {{cabinetTypeInfo.router_model | emptyText}}
    Row.info-title 视觉模块
    Row.info-box
      Form(inline, :label-width='110', label-position='left')
        Col(span='8')
          FormItem(label='视觉ID:') {{cabinetTypeInfo.vision_id | emptyText}}
        Col(span='8')
          FormItem(label='灯具型号：') {{cabinetTypeInfo.light_model | emptyText}}
        Col(span='8')
          FormItem(label='工控板型号：') {{cabinetTypeInfo.industrial_pc_model | emptyText}}
    Row.info-box
      Form(inline, :label-width='110', label-position='left')
        Col(span='8')
          FormItem(label='柜体类型:') {{cabinetTypeInfo.factory_model | emptyText}}
        Col(span='8')
          FormItem(label='摄像头：') {{cabinetTypeInfo.camera_model | emptyText}}
        Col(span='8')
          // todo
          FormItem(label='摄像头曝光值：') --
</template>

<script lang="ts">
  import {
    getCabinetTypesById$,
  } from '@/api/cabinet';
  import ComponentOptionsMixin from "@/mixins/componentOptions";
  import {Component, Prop} from "vue-property-decorator";
  import {finalize, mergeMap} from "rxjs/operators";

  @Component({components: {}})
  export default class CabinetTypeForm extends ComponentOptionsMixin {
    @Prop() id!: number;
    cabinetTypeInfo: any = {};

    mounted() {
      this.loadData();
    }

    loadData() {
      this.startFetch$()
        .pipe(
          mergeMap(() =>
            getCabinetTypesById$({
              id: this.id,
            })
          ),
          finalize(() => {
            this.endFetch();
          })
        )
        .subscribe((res: any) => {
          if (res.isFulfill) {
            const {data} = res.payload;
            this.cabinetTypeInfo = data;
          }
        });
    }

    goBack() {
      window.history.go(-1);
    }
  }
</script>

<style scoped>

</style>
<style>

</style>
