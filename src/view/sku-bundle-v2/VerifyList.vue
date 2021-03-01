<template lang="pug">
  .page-content
    Card
      h6(slot="title") 商品组审核
      Tabs(v-model='currentTab')
        TabPane(label='待初审', name='waiting')
          VerifyListTable(v-if='currentTab === "waiting"', :currentTab='currentTab')
        TabPane(label='待复审', name='again')
          VerifyListTable(v-if='currentTab === "again"', :currentTab='currentTab')
        TabPane(label='已审核', name='already')
          VerifyListTable(v-if='currentTab === "already"', :currentTab='currentTab')
</template>

<script lang="ts">
import Component from 'vue-class-component';
import VerifyListTable from './components/VerifyListTable.vue';
import _ from 'lodash';
import Vue from 'vue';

@Component({
  components: { VerifyListTable }
})
export default class VerifyList extends Vue {
  get currentTab() {
    const {
      $route: {
        query: { currentTab }
      }
    } = this;
    if (_.isNil(currentTab)) {
      return 'waiting';
    }
    return currentTab;
  }

  set currentTab(value: any) {
    const {
      $route: { query }
    } = this;
    this.$router.replace({
      query: { currentTab: value }
    });
  }
}
</script>
