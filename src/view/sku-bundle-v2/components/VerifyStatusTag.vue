<template lang="pug">
  section
    Tag(:color="(bundle.status === 'in_review' ? (bundle.status+'+'+bundle.audited_status) : bundle.status) | getSkuBundleReviewedColorFilter")
      | {{(bundle.status === 'in_review' ? (bundle.status+'+'+bundle.audited_status) : bundle.status)  | getSkuBundleReviewedStatusFilter}}
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import {Prop} from 'vue-property-decorator';

@Component({})
export default class VerifyStatusTag extends Vue {
    @Prop() bundle!:any;
}
</script>

<style scoped lang="scss"></style>
