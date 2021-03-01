<template lang="pug">
  Modal(v-model="visible", title="新建品牌商标", :loading="isFetching" @on-visible-change="visibleChange")
    Form.trade_mark(:ref="formName", :model="form", :label-width="100")
      FormItem(label="品牌中文名称:", prop="chinese")
        autocomplete(v-model="form.chinese", :fetch-suggestions="queryCallBack('chinese')", :trigger-on-focus="false")
      FormItem(label="品牌英文名称:", prop="english")
        autocomplete(v-model="form.english", :fetch-suggestions="queryCallBack('english')", :trigger-on-focus="false")
    template(slot="footer")
      Button(@click="close") 取消
      Button(type="primary", @click="submit") 提交
</template>


<script lang="ts">
import _ from 'lodash';
import Component, { mixins } from 'vue-class-component';
import ValidFormMixin, { ValidFormOptions } from '@/mixins/validForm';
import { DefaultApiType, MetaType } from '@/interface';
import {
  createTradeMark$,
  CreateTradeMarkParams,
  getTradeMarks$
} from '@/api/sku';
import { Form } from 'iview';
import { Autocomplete } from 'element-ui';

@Component({
  components: { Autocomplete }
})
export default class TradeMarkModal
  extends mixins<ValidFormMixin<any, MetaType>>(ValidFormMixin)
  implements ValidFormOptions {
  formName: string = 'TradeMarkForm';
  formApi: DefaultApiType = createTradeMark$;
  visible: boolean = false;
  form: CreateTradeMarkParams = {
    chinese: '',
    english: ''
  };
  tradeMarkChineseMap: any[] = [];
  tradeMarkEnglishMap: any[] = [];

  transformFormParams() {
    return { ...this.form };
  }

  public open() {
    this.visible = true;
  }

  public close() {
    this.visible = false;
  }

  mounted() {
    getTradeMarks$().subscribe(({ isFulfill, payload }) => {
      const trademarks: any = (payload as any).data.trademarks;
      if (isFulfill) {
        this.tradeMarkChineseMap = trademarks
          .map((e: any) => {
            return {
              value: e.chinese
            };
          })
          .filter((e: any) => !_.isNil(e.value) && !!e.value);
        this.tradeMarkEnglishMap = trademarks
          .map((e: any) => {
            return {
              value: e.english
            };
          })
          .filter((e: any) => !_.isNil(e.value) && !!e.value);
      }
    });
  }

  visibleChange(status: boolean) {
    if (status === false) {
      const formRef = <Form>this.$refs[this.formName];
      formRef.resetFields();
    }
  }

  submit() {
    if (!this.form.chinese.trim() && !this.form.english.trim()) {
      this.$Message.error('请填写品牌中文名称或品牌英文名称');
      return;
    }
    this.validAndHandleForm$().subscribe(state => {
      if (state.isFulfill) {
        this.$emit('complete');
        this.close();
        this.$Message.success('品牌商标创建成功');
      }
    });
  }

  queryCallBack(type: 'chinese' | 'english') {
    return (query: string, cb: any) => {
      let restaurants = [];
      if (type === 'chinese') {
        restaurants = this.tradeMarkChineseMap;
      } else if (type === 'english') {
        restaurants = this.tradeMarkEnglishMap;
      }
      const results = query
        ? restaurants.filter(this.createFilter(query))
        : restaurants;
      cb(results);
    };
  }

  createFilter(queryString: string) {
    return (restaurant: any) => {
      return (
        restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
      );
    };
  }
}
</script>

<style lang="scss">
.trade_mark {
  .el-input__inner {
    height: 32px;
    line-height: 32px;
  }
}
</style>
