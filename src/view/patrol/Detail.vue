<template lang="pug">
  section
    GoBack
    Card
      h6(slot="title") 任务名称: {{(stateData.name || '--')+" "}}, 巡检进度:{{planned+" "}}, 序号:{{currentIndex}}
      Spin(v-show="isLoading || state.isFetching", fix)
      .content-wrap
        .image-boxs
          PatrolImageBox(:items="layers", :key="currentIndex")
        .exceptional-form.ml15
          Form(:ref="formName", :model="form", :rules="rules")
            FormItem(label="运营情况:")
              RadioGroup(style="display:block", v-model="form.state")
                div(style="width:100%;display: inline-block;")
                  Radio(v-for="(state,index) in itemStates", :key="state.id", :label="state.id") {{state.label}}
            FormItem(v-show="form.state === 'ABNORMAL'", label="异常类型:", prop="abnormal_types")
              Select(v-model="form.abnormal_types", multiple)
                Option(v-for="(type, index) in exceptionTypes", :key="type.id", :value="type.id") {{type.label}}
            FormItem(v-show="form.state === 'ABNORMAL'", label="异常详细描述:")
              Input(type="textarea", v-model="form.comment")
            FormItem(v-show="form.state === 'ABNORMAL'", label="异常处理建议:")
              Input(type="textarea", v-model="form.solution")
            FormItem
              Button(type="primary", :disabled="currentIndex <= 1 || isLoading", @click="jumpTo(currentIndex - 1)") 查看上一组图片
              Button.ml5(type="primary", :disabled="itemState === 'UNKNOWN' || isLoading", @click="jumpTo(currentIndex + 1)") 查看下一组图片
              Button.ml5(type="primary", :disabled="state.isFetching || isLoading || !isCanSubmit", :loading="state.isFetching", @click="submit") 提交
</template>

<script lang="ts">
import Component, { mixins } from 'vue-class-component';
import GoBack from '@/components/shared/GoBack.vue';
import LoadPageMixin, { LoadPageMixinInstance } from '@/mixins/loadPage';
import {
  DataListResponse,
  DefaultApiType,
  DefaultDataResponse,
  MetaType
} from '@/interface';
import {
  getPatrol$,
  GetPatrolData,
  getPatrolImtes$,
  PatrolItemInfo,
  PatrolItemState,
  postPatrol$,
  postPatrolItem$,
  PostPatrolItemParams
} from '@/api/patrol';
import { Prop, Watch } from 'vue-property-decorator';
import PatrolImageBox from '@/view/patrol/components/PatrolImageBox.vue';
import { delay, tap, mergeMap, map, mapTo, finalize } from 'rxjs/operators';
import { EMPTY, of, pipe } from 'rxjs';
import { PatrolAbnormalTypes, PatrolItemStates } from '@/const/data/patrol';
import ValidFormMixin, { ValidFormOptions } from '@/mixins/validForm';
import { State } from 'vuex-class';

@Component({
  components: { PatrolImageBox, GoBack }
})
export default class PatrolDetail extends mixins(LoadPageMixin, ValidFormMixin)
  implements LoadPageMixinInstance, ValidFormOptions {
  @State('profile') user!: any;
  @Prop() id!: string;
  defaultApi: DefaultApiType = getPatrol$;
  defaultParams = {
    id: Number(this.id)
  };
  patrolItems: PatrolItemInfo[] = [];
  exceptionTypes = PatrolAbnormalTypes;
  itemStates = PatrolItemStates;
  currentIndex = 0;
  formName = 'patrolItemForm';
  form: PostPatrolItemParams | any = {
    id: Number(this.id),
    itemId: undefined,
    state: 'NORMAL',
    abnormal_types: undefined,
    comment: undefined,
    solution: undefined,
    handler_id: undefined
  };
  formApi: DefaultApiType = postPatrolItem$;
  isLoading = false;
  itemException = false;

  @Watch('user', { immediate: true })
  userIdChange(v: any) {
    if (v.isFulfill) {
      this.form.handler_id = v.payload.data.account;
    }
  }

  @Watch('form.state')
  stateChange(state: PatrolItemState) {
    if (state === 'NORMAL') {
      (this.$refs[this.formName] as any).resetFields();
      this.form.abnormal_types = undefined;
      this.form.comment = undefined;
      this.form.solution = undefined;
    }
  }

  get rules() {
    const _this = this;
    const validAbnormalType = (rules: any, value: any, cb: Function) => {
      if (_this.form.state === 'ABNORMAL') {
        if (!value || (value && value.length === 0)) {
          return cb(new Error('必填'));
        }
      }
      return cb();
    };
    return {
      abnormal_types: [
        {
          validator: validAbnormalType,
          required: true,
          trigger: 'change'
        }
      ]
    };
  }

  get layers() {
    if (this.patrolItems.length > 0) {
      return this.patrolItems[0].trx_info.layers;
    }
    return [];
  }

  get planned() {
    if (this.state.isFulfill) {
      const r = this.state.payload as DefaultDataResponse<GetPatrolData>;
      return `(${r.data.finished_count}/${r.data.total_count})`;
    }
  }

  get itemState(): PatrolItemState {
    if (this.patrolItems.length > 0) {
      return this.patrolItems[0].state;
    }
    return 'UNKNOWN';
  }

  get isCanSubmit() {
    return (
      !(
        this.form.state !== 'NORMAL' &&
        ((this.form.abnormal_types && this.form.abnormal_types.length === 0) ||
          !this.form.abnormal_types)
      ) && !this.itemException
    );
  }

  transformParams(params: any) {
    return params;
  }

  transformFormParams() {
    if (this.form.state === 'NORMAL') {
      this.form.abnormal_types = [];
    }
    return {
      ...this.form
    };
  }

  patrolItems$(index?: number) {
    return pipe(
      mergeMap<any, any>((curIndex: number) => {
        return getPatrolImtes$({
          id: Number(this.id),
          page_index: index ? index : curIndex
        }).pipe(
          mergeMap((state: any) => {
            if (state.isError) {
              if (state.error.origin.msg.error_code === 200001) {
                this.itemException = true;
                this.resetForm();
                this.patrolItems = [];
                this.$Message.error({
                  content: `交易SN:${state.error.origin.msg.message}状态异常`,
                  duration: 0,
                  closable: true
                });
              }
              return EMPTY;
            }
            return of(state);
          })
        );
      }),
      tap(() => this.resetForm()),
      tap((state: MetaType<DataListResponse<PatrolItemInfo>>) => {
        if (!state.isFulfill) return;
        const data = state.payload!.data.results[0];
        this.itemException = false;
        if (data.state !== 'UNKNOWN') {
          this.form.state = data.state;
        }
        if (data.abnormal_types.length > 0) {
          this.form.abnormal_types = data.abnormal_types;
        }
        if (data.comment) {
          this.form.comment = data.comment;
        }
        if (data.solution) {
          this.form.solution = data.solution;
        }
        this.form.itemId = data.id;
        this.patrolItems = state.payload!.data.results as PatrolItemInfo[];
      })
    );
  }

  created() {
    const currentIndex$ = pipe(
      map<any, number | undefined>((state: any) => {
        if (!state.isFulfill) return;
        const { finished_count, total_count } = state.payload.data;
        this.currentIndex =
          finished_count === total_count ? finished_count : finished_count + 1;
        return this.currentIndex;
      })
    );
    this.$observables.response$
      .pipe(
        currentIndex$,
        this.patrolItems$()
      )
      .subscribe((state: MetaType<DataListResponse<PatrolItemInfo>>) => {
        const { payload, isFulfill } = state;
        if (isFulfill) {
          this.patrolItems = payload!.data.results as PatrolItemInfo[];
        }
      });
  }

  submit() {
    this.validAndHandleForm$()
      .pipe(
        mergeMap((state: any) => {
          if (state.isFulfill) {
            if (this.currentIndex === this.state.payload!.data.total_count) {
              return postPatrol$({
                id: Number(this.id),
                status: 'SUBMITTED'
              }).pipe(
                tap(() => (this.isLoading = true)),
                tap(() =>
                  this.$Message.success({ content: '任务完成', duration: 3 })
                ),
                delay(3000),
                tap(() => this.$router.push({ name: '_patrols_list' })),
                mapTo(false)
              );
            }
          }
          return of(state);
        })
      )
      .subscribe((state: any) => {
        if (!state) return;
        this.loadDefaultApi({ ...this.defaultParams });
      });
  }

  jumpTo(index: number) {
    of(true)
      .pipe(
        tap(() => (this.isLoading = true)),
        tap(() => this.resetForm()),
        tap(() => (this.currentIndex = index)),
        this.patrolItems$(index),
        finalize(() => (this.isLoading = false))
      )
      .subscribe();
  }

  resetForm() {
    this.form.solution = undefined;
    this.form.comment = undefined;
    this.form.abnormal_types = undefined;
    this.form.state = 'NORMAL';
  }
}
</script>

<style scoped lang="scss">
.image-boxs {
  width: 348 * 2px + 12px;
}
.content-wrap {
  display: flex;
}
.exceptional-form {
  margin-left: 15px;
  width: 50%;
}
</style>
