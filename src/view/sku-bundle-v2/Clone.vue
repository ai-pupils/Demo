<template lang="pug">
  Create(type="clone", :skuBundleId="skuBundleId")
</template>


<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import Create from './Create.vue';
import {Prop} from "vue-property-decorator";

@Component({
  components: { Create }
})
export default class App extends Vue {
  @Prop() skuBundleId!:string;
}
</script>
