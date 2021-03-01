<template lang="pug">
  section
    snir-monitor(:cabinetId="cabinetId")
    signals-monitor.mb20(:cabinetId="cabinetId")
    temperature-monitor(:cabinetId="cabinetId")
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import TemperatureMonitor from '@/view/cabinet/components/TemperatureMonitor.vue';
import SignalsMonitor from '@/view/cabinet/components/SignalsMonitor.vue';
import SnirMonitor from '@/view/cabinet/components/SnirMonitor.vue';

@Component({
  components: { TemperatureMonitor, SignalsMonitor, SnirMonitor }
})
export default class CabinetStatusMonitor extends Vue {
  @Prop() cabinetId!: any;
}
</script>

<style scoped></style>
