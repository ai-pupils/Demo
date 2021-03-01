<template lang="pug">
  section
    Form(:ref="formName", :model="form", :rules="rules", :label-width="100")
      FormItem(label="货柜组名称:", prop="name")
        Input(v-model="form.name")
      FormItem(label="货柜组描述:", prop="description")
        Input(v-model="form.description")
      FormItem
        Button(type="primary", @click="nextStepHandle") 下一步
</template>

<script lang="ts">
import Component, { mixins } from 'vue-class-component';
import ValidFormMixin, { ValidFormOptions } from '@/mixins/validForm';
import { DefaultApiType } from '@/interface';
import { of } from 'rxjs';

@Component({
  data() {
    return {
      rules: {
        name: [{ required: true, message: '必填', trigger: 'blur' }]
      }
    };
  }
})
export default class BaseInfoForm extends mixins(ValidFormMixin)
  implements ValidFormOptions {
  formApi: DefaultApiType = () => of(true);
  formName: string = 'createCabinetGroup';
  form: any = {
    name: undefined,
    description: undefined,
  };

  transformFormParams() {
    return { ...this.form };
  }

  nextStepHandle() {
    this.validAndHandleForm$().subscribe(() => {
      this.$emit('next', { ...this.form });
      this.$router.replace({
        name: 'cabinet-group-create',
        query: {
          ...this.$route.query,
          step: '1'
        }
      });
    });
  }
}
</script>
