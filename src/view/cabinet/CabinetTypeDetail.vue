<template lang="pug">
  .page-content
    GoBack
    Card
      h6.clearfix(slot='title', style='line-height: 30px') 柜体详情
      Tabs(v-model='tab')
        TabPane(label='柜体信息', name='detail')
          CabinetTypeForm(ref='CabinetTypeForm', v-show="tab === 'detail'", :id='id')
</template>
<script lang="ts">
  import GoBack from '@/components/shared/GoBack.vue';
  import Component from "vue-class-component";
  import {Prop} from "vue-property-decorator";
  import ComponentOptionsMixin from "@/mixins/componentOptions";
  import CabinetTypeForm from "./components/CabinetTypeForm.vue";

  @Component({
    components: {
      GoBack,
      CabinetTypeForm
    }
  })
  export default class CabinetTypeTable extends ComponentOptionsMixin {
    @Prop() id!: number;
    tab: string = 'detail';
  }
</script>
