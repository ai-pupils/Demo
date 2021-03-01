<template lang="pug">
  section(id="verify-step")
    steps(align-center, :active="active", :process-status="processStatus")
      step(v-for="item in state", :key="item.title")
        template(slot="title")
          div.title-slot {{item.title}}
        template(slot="description")
          div.user {{item.user}}
          div {{item.date}}
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { Steps, Step } from 'element-ui';
import {VerifyStepStateType} from '@/view/sku-bundle-v2/components/interface';

@Component({
  components: { Steps, Step }
})
export default class VerifyStep extends Vue {
  @Prop() state!: VerifyStepStateType[];
  @Prop() active!: number;
  @Prop() processStatus!: 'wait' | 'process' | 'finish' | 'error' | 'success';
}
</script>

<style lang="scss">
#verify-step {
  .el-step__title {
    position: relative;
    .title-slot {
      position: absolute;
      top: -60px;
      left: 50%;
      text-align: center;
      transform: translateX(-50%);
    }
  }
  .el-step__title.is-error {
    .title-slot {
      font-weight: bold;
    }
  }
  .el-step__title.is-finish {
    color: #000;
  }
  .el-step__description.is-finish {
    color: #515a6e;
  }
  .user {
    padding-top: 10px;
  }
}
</style>
