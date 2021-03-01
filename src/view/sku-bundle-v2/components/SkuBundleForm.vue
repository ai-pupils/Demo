<template lang="pug">
  section
    Form(:ref="formName", :model="form", :rules="rules", :label-width="100")
      FormItem(label="绑定商户ID:", prop="dealer_id")
        Select(v-model="form.dealer_id", clearable, filterable)
          Option(v-for="(item,index) in dealer_list", :key="item.id", :value="item.id",
            :label="item.label")
      FormItem(label="商品组名称:", prop="name")
        Input(v-model="form.name")
      FormItem(label="商品组描述:", prop="description")
        Input(v-model="form.description")
      FormItem(label="视觉ID:", prop="vision_id")
        Select(v-model="form.vision_id", :disabled="type === 'clone'")
          Option(v-for="(item,index) in cabinetVisions", :key="item.id", :value="item.id",
            :label="`${item.id}（${item.name}）`")
      FormItem
        Button(type="primary", @click="nextStepHandle") 下一步
</template>

<script lang="ts">
import _ from 'lodash';
import Component, { mixins } from 'vue-class-component';
import ValidFormMixin, { ValidFormOptions } from '@/mixins/validForm';
import { DefaultApiType } from '@/interface';
import { of } from 'rxjs';
import { getCabinetTypes$, GetCabinetTypesData } from '@/api/cabinet';
import { Prop, Watch } from 'vue-property-decorator';
import { SkuBundleV2Data } from '@/api/sku-bundle';
import { getCustomers$ } from '@/api/v2/users';

@Component({
  data() {
    return {
      rules: {
        name: [{ required: true, message: '必填', trigger: 'blur' }],
        dealer_id: [{ required: true, message: '必填', trigger: 'change' }],
        vision_id: [{ type: 'string',required: true, message: '必填', trigger: 'change' }]
      }
    };
  }
})
export default class SkuBundleForm extends mixins(ValidFormMixin)
  implements ValidFormOptions {
  @Prop() type!: string;
  @Prop() bundleInfo!: SkuBundleV2Data;
  @Prop() cabinet!: any;
  formApi: DefaultApiType = () => of(true);
  formName: string = 'createSku';
  form: any = {
    dealer_id: undefined,
    name: undefined,
    description: undefined,
    vision_id: undefined
  };
  cabinetVisions: any[] = [];
  dealer_list: any = [];

  transformFormParams() {
    return { ...this.form };
  }

  mounted() {
    if (this.cabinet) {
      this.form.dealer_id = this.cabinet.dealer_id;
      this.form.vision_id = this.cabinet.vision_id;
    }
    this.getDealerList();
  }

  getDealerList() {
    getCustomers$({ pageIndex: 1, pageSize: 99999 }).subscribe(state => {
      if (state.isFulfill) {
        const {
          payload: {
            data: { results }
          }
        } = state as any;
        this.dealer_list = results.map((r: any) => {
          return {
            id: r.user_id.toString(),
            name: r.name,
            // note: select列表必须转成字符串，否则有bug
            label: r.name ? r.user_id + ' - ' + r.name : r.user_id.toString()
          };
        });
      }
    });
  }

  @Watch('bundleInfo')
  bundleInfoChange(bundleInfo: any) {
    if (this.type === 'clone' && !_.isEmpty(bundleInfo)) {
      this.form.name = bundleInfo.name;
      this.form.description = bundleInfo.description;
      this.form.vision_id = bundleInfo.vision_id;
    }
  }

  async created() {
    const cabinetVisions = await this.getCabinetVisions();
    if (cabinetVisions.isFulfill) {
      cabinetVisions.payload!.data.results.forEach((type: any) => {
        let _type = _.find(this.cabinetVisions, { id: type.vision_id });
        if (_type) {
          _type.name += `，${type.name}`;
        } else {
          this.cabinetVisions.push({
            id: type.vision_id,
            name: type.name
          });
        }
      });
    }
  }

  getCabinetVisions() {
    return getCabinetTypes$({}).toPromise();
  }

  nextStepHandle() {
    this.validAndHandleForm$().subscribe(() => {
      this.$emit('next', { ...this.form });
      this.$router.replace({
        name:
          this.type === 'clone'
            ? 'v2-sku-bundle-clone'
            : 'v2-sku-bundle-create',
        query: {
          ...this.$route.query,
          step: '1',
          visionId: this.form.vision_id
        }
      });
    });
  }
}
</script>
