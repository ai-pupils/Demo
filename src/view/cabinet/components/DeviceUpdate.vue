<template lang="pug">
  section.pr.m-height200
    Spin(fix, v-if="isLoading")
    div(v-else)
      div(v-if="voice_config.error")
        Alert(type="error") 该设备暂时无法调节
      Row.info-title(v-else) 语音播报
        Form(inline, :label-width='110', label-position='left')
          Row.info-box
            Col(span='8')
              FormItem(label='语音导购：')
                i-switch(v-model="form.voice_tran", @on-change="emitUpdate")
                  span(slot="open") 开
                  span(slot="close") 关
          Row.info-box
            Col(span='8')
              FormItem(label='补货提示：')
                i-switch(v-model="form.voice_replenish", @on-change="emitUpdate")
                  span(slot="open") 开
                  span(slot="close") 关
          Row.info-box
            Col(span='8')
              FormItem(label='音量：')
                Slider(v-model="form.volume", @on-change="emitUpdate"
                :min="0", :max="10", :step="1")
</template>

<script lang="ts">
import Vue from 'vue';
import Component, { mixins } from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import { Subject } from 'rxjs';
import { debounceTime, switchMap, take, takeUntil } from 'rxjs/operators';
import {
  GetVoiceParams,
  getCabinetVoice$,
  updateCabinetVoice$
} from '@/api/v2/cabinet';
import _ from 'lodash';
import LoadPageMixin, { LoadPageMixinInstance } from '@/mixins/loadPage';

const subject = new Subject();

@Component({})
export default class DeviceUpdate extends mixins(LoadPageMixin)
  implements LoadPageMixinInstance {
  @Prop() cabinetId!: number;
  defaultApi: any = getCabinetVoice$;
  defaultParams: GetVoiceParams = {
    cabinet_id: this.cabinetId
  };
  transformParams(params: GetVoiceParams) {
    return params;
  }
  voice_config: any = {};

  form: any = {
    voice_tran: false,
    voice_replenish: false,
    volume: 0
  };

  get isLoading() {
    return _.isEmpty(this.voice_config);
  }

  @Watch('state', { immediate: true })
  stateChanged(state: any) {
    if (state.isFulfill) {
      const {
        payload: {
          data: { voice_config }
        }
      } = state;
      this.voice_config = voice_config;
      if (voice_config) {
        this.form.voice_tran = voice_config.voice_tran;
        this.form.voice_replenish = voice_config.voice_replenish;
        this.form.volume = voice_config.voice_prompt_volume;
      }
    }
  }

  created() {
    let beforeDestroy$ = this.$eventToObservable('hook:beforeDestroy').pipe(
      take(1)
    );

    subject
      .pipe(
        debounceTime(500),
        switchMap(form =>
          updateCabinetVoice$({ ...form, cabinet_id: this.cabinetId })
        ),
        takeUntil(beforeDestroy$)
      )
      .subscribe({
        next: (state: any) => {
          if (!state.error) {
            this.$Message.success('设置成功');
          }
        }
      });
  }

  emitUpdate(e: any) {
    subject.next({
      ...this.form,
      volume: _.isNumber(e) ? e : this.form.volume
    });
  }
}
</script>

<style scoped lang="scss">
.m-height200 {
  min-height: 200px;
}
</style>
