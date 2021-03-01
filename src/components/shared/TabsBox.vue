<template lang="pug">
  Tabs(:value="tabName", @on-click="clickHandle", :animated="isShowAnimation")
    TabPane(v-for="tabpane in tabs", :label="tabpane.label", :name="tabpane.name", :key="tabpane.name")
      slot(:name="tabpane.name")
</template>


<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Model, Prop, Watch } from 'vue-property-decorator';
import { getRouteQuery } from '@/utils/observables';

export interface TabPaneType {
  label: string;
  name: string;
}

@Component({})
export default class App extends Vue {
  @Prop() tabs!: TabPaneType[];
  @Model('change') tabName!: string;
  @Prop({type: Boolean, default: true}) isShowAnimation!: boolean;

  @Watch('$route.query', { immediate: true })
  routeQueryChange(query: any) {
    if (query && query.tabName) {
      this.$emit('change', query.tabName);
    }
  }

  clickHandle(name: string) {
    const query: any = getRouteQuery(this);
    this.$emit('change', name);
    this.$router.replace({ query: { ...query, tabName: name } });
  }
}
</script>
