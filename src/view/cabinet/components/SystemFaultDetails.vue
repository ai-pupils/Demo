<template lang="pug">
  section
    Modal(v-model='visible', width="1000")
      div(slot='header') 故障详情
      Row.info-title 故障货柜
      Row.info-box
        Form(inline, :label-width='110', label-position='left')
          Col(span='8')
            FormItem(label='商户ID:') {{cabinet.dealer_id}}
          Col(span='8')
            FormItem(label='货柜ID:') {{cabinet.id}}
          Col(span='8')
            FormItem(label='货柜名称:') {{cabinet.name | emptyText}}
      Row.info-box
        Form(inline, :label-width='110', label-position='left')
          Col(span='8')
            FormItem(label='货柜ManagerID:') {{cabinet.manager_cabinet_id | emptyText}}
          Col(span='8')
            FormItem(label='货柜描述:') {{cabinet.desc | emptyText}}
          Col(span='8')
            FormItem(label='货柜位置:') {{cabinet.location | emptyText}}
      Row.info-box
        Form(inline, :label-width='110', label-position='left')
          Col(span='8')
            FormItem(label='柜体名称:') {{(cabinet.cabinet_type_info && cabinet.cabinet_type_info.name) | emptyText}}
          // todo fix
          Col(span='8')
            FormItem(label='柜体类别:') {{(cabinet.cabinet_type_info && cabinet.cabinet_type_info.arch) | getCabinetArchTypes| emptyText}}
          Col(span='8')
            FormItem(label='柜体类型:') {{(cabinet.cabinet_type_info && cabinet.cabinet_type_info.type) | getCabinetTemperatureTypesFilter|  emptyText}}
      Row.info-title 故障信息
      Row.info-box
        Form(inline, :label-width='110', label-position='left')
          Col(span='8')
            FormItem(label='故障ID:') {{cabinetFault.id}}
          Col(span='8')
            FormItem(label='故障来源:') {{cabinetFault.source | getCabinetFaultSourceFilter}}
      Row.info-box
        Form(inline, :label-width='110', label-position='left')
          Col(span='8')
            FormItem(label='故障简述:') {{cabinetFault.desc}}
      Row.info-box
        Form(inline, :label-width='110', label-position='left')
          Col(span='8')
            FormItem(label='报告时间:') {{cabinetFault.created_at | fmtLocalTime}}
          Col(span='8')
            FormItem(label='处理完成时间:') {{cabinetFault.closed_at | fmtLocalTime}}
      Row.info-box
        Form(inline, :label-width='110', label-position='left')
          Col(span='8')
            FormItem(label='故障类型:') {{cabinetFault.type | getCabinetFaultTypes}}
          Col(span='8')
            FormItem(label='是否蓄意破坏:') {{cabinetFault.is_vandalism | getBooleanTypeFilter}}
      Row.info-box
        Form(inline, :label-width='110', label-position='left')
          Col(span='8')
            FormItem(label='处理结果:') {{cabinetFault.fixer_comment}}
      div(slot='footer')
    Spin(size='large' fix v-if='isFetching')
</template>

<script lang="ts">
import Vue from 'vue';
import { Component, Prop, Provide, Watch } from 'vue-property-decorator';
import { GetCabinetFaultParams, getFaultsDetails$ } from '@/api/cabinet-fault';
import { CabinetFaultSource } from '@/const/data/cabinetFault';
import { finalize, mergeMap } from 'rxjs/operators';
import { getCabinet$ } from '@/api/cabinet';
import ComponentOptionsMixin from "@/mixins/componentOptions";

@Component({})
export default class SystemFaultDetails extends ComponentOptionsMixin  {
  visible: boolean = false;
  cabinetFault: any = {};
  cabinet: any = {};
  @Prop() cabinetId!: number;
  @Prop() faultId!: number;

  load(row: any) {
    this.visible = true;
    this.loadFaultData(row);
  }

  mounted(){
    this.loadCabinetDetails();
  }

  loadCabinetDetails() {
      this.startFetch$()
        .pipe(
          mergeMap(() =>
            getCabinet$(this.cabinetId)
          ),
          finalize(() => {
            this.endFetch();
          })
        )
        .subscribe((res: any) => {
          if(res.isFulfill){
            const {
              payload: {data}
            } = res;
            this.cabinet = data;
          }
        });
    }

  loadFaultData(row: any) {
    this.startFetch$()
      .pipe(
        mergeMap(() =>
          getFaultsDetails$({ cabinetId: this.cabinetId, id: row.id })
        ),
        finalize(() => {
          this.endFetch();
        })
      )
      .subscribe((res: any) => {
        if (res.isFulfill) {
          const {
            payload: { data }
          } = res;
          this.cabinetFault = data;
        }
      });
  }

  close() {
    this.visible = false;
  }

  transformParams(params: GetCabinetFaultParams) {
    return params;
  }
}
</script>

<style scoped></style>
