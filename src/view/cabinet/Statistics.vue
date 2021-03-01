<template lang="pug">
  Row(:gutter='24')
    Col
      CabinetCards(:cabinetStatusInfo = 'cabinetStatus')
    Col
      CabinetCharts(:cabinetStatusInfo = 'cabinetStatus' :cabinetRuntimeStatusInfo = 'cabinetRuntimeStatus'
      :cabinetErrorStatusInfo = 'cabinetErrorStatus')
</template>

<script lang="ts">
  import Vue from 'vue';
  import Component from 'vue-class-component';
  import CabinetCards from './components/CabinetCards.vue';
  import CabinetCharts from "./components/CabinetCharts.vue";
  import ComponentOptionsMixin from "@/mixins/componentOptions";
  import {finalize, mergeMap} from "rxjs/operators";
  import {
    getCabinetStatus$,
    getCabinetStatusCharts$,
    GetCabinetChartsData,
    getCabinetRuntimeStatusCharts$,
    getCabinetErrorStatusCharts$
  } from "@/api/cabinet";

  @Component({
    components: {
      CabinetCards,
      CabinetCharts
    }
  })
  export default class CabinetStatistics extends ComponentOptionsMixin {

    cabinetStatus: any = {};
    cabinetRuntimeStatus: any = {};
    cabinetErrorStatus: any = {};

    created() {
      this.getCabinetStatusChartsData();
      this.getCabinetRuntimeStatusChartsData();
      this.getCabinetErrorStatusChartsData();
    }

    getCabinetStatusChartsData() {
      this.startFetch$()
        .pipe(
          mergeMap(() =>
            getCabinetStatusCharts$({})
          ),
          finalize(() => {
            this.endFetch();
          })
        )
        .subscribe((res: any) => {
          if (res.isFulfill) {
            this.cabinetStatus = res;
          }
        });
    }

    getCabinetRuntimeStatusChartsData() {
      this.startFetch$()
        .pipe(
          mergeMap(() =>
            getCabinetRuntimeStatusCharts$({})
          ),
          finalize(() => {
            this.endFetch();
          })
        )
        .subscribe((res: any) => {
          if (res.isFulfill) {
            this.cabinetRuntimeStatus = res;
          }
        });
    }

    getCabinetErrorStatusChartsData() {
      this.startFetch$()
        .pipe(
          mergeMap(() =>
            getCabinetErrorStatusCharts$({})
          ),
          finalize(() => {
            this.endFetch();
          })
        )
        .subscribe((res: any) => {
          if (res.isFulfill) {
            this.cabinetErrorStatus = res;
          }
        });
    }
  }
</script>


<style scoped>

</style>
