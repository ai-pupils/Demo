<template lang="pug">
  section
    Card(title="工单管理")
      TabsBox(v-model="currentTab", :tabs="tabs")
        template(v-for="type in types", :slot="type.name")
          ticket-list(v-if="currentTab === type.name", :status="type.name", :personType="type.person_type")
</template>

<script lang="ts">
import Component from 'vue-class-component';
import TabsBox, { TabPaneType } from '@/components/shared/TabsBox.vue';
import Vue from 'vue';
import TicketList from '@/view/ticket/components/TicketList.vue';
import { TicketStatusTypes } from '@/const/data/ticket';

@Component({
  components: { TabsBox, TicketList }
})
export default class App extends Vue {
  currentTab: string = 'PENDING,PROCESSING';
  types: any[] = TicketStatusTypes;
  tabs: TabPaneType[] = this.types;
}
</script>

<style scoped></style>
