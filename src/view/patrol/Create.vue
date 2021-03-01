<template lang="pug">
  section
    GoBack
    Card
      h6(slot="title") 新建任务
      Row
        Col(:span="6") &nbsp;
        Col(:span="8")
          Form(:ref="formName", :model="form", :rules="rules", :label-width="100")
            FormItem(label="商户ID:", prop="dealer_id")
              Select(v-model="form.dealer_id")
                Option(v-for="(item,index) in dealerList", :key="item.id", :value="item.id",
                  :label="item.label")
            FormItem(label="任务名称:", prop="name")
              Input(v-model="form.name", placeholder="任务名称")
            FormItem(label="开始时间:", prop="from_time")
              ElDatePicker(v-model="form.from_time", format="yyyy-MM-dd HH:mm:ss", type="datetime", placeholder="开始时间")
            FormItem(label="结束时间:", prop="to_time")
              ElDatePicker(v-model="form.to_time", format="yyyy-MM-dd HH:mm:ss", type="datetime", placeholder="结束时间")
            FormItem
              Button(type="primary", :disabled="!isCanSubmit || state.isFetching", :loading="state.isFetching", @click="submit") 提交
              Button.ml5(@click="$router.go(-1)") 取消
</template>

<script lang="ts">
import moment from 'moment';
import Component, { mixins } from 'vue-class-component';
import ValidFormMixin, { ValidFormOptions } from '@/mixins/validForm';
import GoBack from '@/components/shared/GoBack.vue';
import { DefaultApiType } from '@/interface';
import { postPatrols$, PostPatrolsParams } from '@/api/patrol';
import ElDatePicker from '@/components/shared/ElDatePicker.vue';
import { getCustomers$ } from '@/api/v2/users';
import { State } from 'vuex-class';
import { Watch } from 'vue-property-decorator';

@Component({
  components: { GoBack, ElDatePicker }
})
export default class PatrolCreate extends mixins(ValidFormMixin)
  implements ValidFormOptions {
  @State('profile') user!: any;

  formName = 'patrolForm';
  formApi: DefaultApiType = postPatrols$;
  form: PostPatrolsParams | any = {
    creator_id: undefined,
    name: '',
    from_time: null,
    to_time: null,
    dealer_id: undefined
  };
  dealerList = [];

  @Watch('user', { immediate: true })
  userIdChange(v: any) {
    if (v.isFulfill) {
      this.form.creator_id = v.payload.data.account;
    }
  }

  created() {
    getCustomers$({ pageIndex: 1, pageSize: 99999 }).subscribe(state => {
      if (state.isFulfill) {
        const {
          payload: {
            data: { results }
          }
        } = state as any;
        this.dealerList = results.map((r: any) => {
          return {
            id: r.user_id.toString(),
            name: r.name,
            // note: select列表必须转成字符串，否则有bug
            label: r.name ? r.user_id + ' - ' + r.name : r.user_id.toString()
          };
        });
      }
    });
    this.state.isFetching = false;
  }

  get rules() {
    const validDate = (type: string) => {
      return (rule: any, value: string, callback: Function) => {
        const { from_time, to_time } = this.form;
        if (
          from_time &&
          to_time &&
          moment(from_time).isAfter(moment(to_time))
        ) {
          return callback(new Error('请检查时间选择是否正确'));
        }
        return callback();
      };
    };

    return {
      from_time: [
        {
          validator: validDate('start'),
          required: true,
          trigger: 'change'
        }
      ],
      to_time: [
        {
          validator: validDate('end'),
          required: true,
          trigger: 'change'
        }
      ],
      dealer_id: [{ required: true, message: '必填', trigger: 'change' }]
    };
  }

  get isCanSubmit() {
    return !!(
      this.form.from_time &&
      this.form.to_time &&
      this.form.creator_id &&
      this.form.dealer_id
    );
  }

  transformFormParams() {
    return {
      ...this.form,
      dealer_id: Number(this.form.dealer_id)
    };
  }

  submit() {
    this.validAndHandleForm$().subscribe({
      next: (state: any) => {
        if (state.isFulfill) {
          this.$Message.success('任务创建成功!');
          this.$router.go(-1);
        }
        if (state.isError && state.error.origin.msg.error_code === 100001) {
          this.$Message.error({
            content: "时间范围内不存在任何交易",
            duration: 5
          });
        }
      }
    });
  }
}
</script>

<style scoped lang="scss"></style>
