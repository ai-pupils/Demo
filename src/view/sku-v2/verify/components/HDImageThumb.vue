<template lang="pug">
  section
    div.text-center {{title}}
    LazyloadImg(:src="src", link)
</template>


<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import LazyloadImg from '@/components/shared/LazyloadImg.vue';
import {Prop} from "vue-property-decorator";

@Component({
  components: { LazyloadImg }
})
export default class HDImageThumb extends Vue {
    @Prop() title!:string;
    @Prop() src!:string;
}
</script>
