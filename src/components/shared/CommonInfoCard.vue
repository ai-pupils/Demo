<template lang="pug">
  section
    h3.mb10 {{cardTitle}}
    Alert(v-if="hasData")
      ul(slot='desc', style='list-style-type:none; word-break: break-all; width: 100%;',
      v-for="(field,index) in data")
        li.mb5
          Highlight(:text="field.label", :key="index")
          span(v-if="field") {{field.text}}
</template>

<script lang="ts">
import Vue from 'vue';
import Component, { mixins } from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';

const Highlight = {
  template: '<font color="#2f4f4f"><B>{{text}}</B></font>',
  props: {
    text: { type: String, required: true }
  }
};

@Component({
  components: { Highlight }
})
export default class TransactionDetail extends Vue {
  @Prop({ type: Array }) data!: any;
  @Prop() cardTitle!: string;

  get hasData() {
    return this.data && this.data.length > 0;
  }

  @Watch('data', { immediate: true })
  dataChanged(data: any) {
  }
}
</script>
