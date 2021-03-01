<template lang="pug">
  section
    Modal(v-model='visible', :width='600', @on-cancel="close")
      header(slot='header')
        h3
          Icon(style="color: #f79903;", type="ios-alert", size="18")
          span.ml5 锁定货柜组
      Form(ref="form", :model="form", :rules="rules")
        FormItem(label="锁柜原因：", prop="is_breakdown_lock")
          RadioGroup(v-model="form.is_breakdown_lock", style="margin-top: -5px")
            Radio(:label="1") 故障锁柜
            Radio(:label="0") 非故障锁柜
        FormItem(label="备注：")
          Input(v-model="form.lock_desc", type="textarea", :rows="4", placeholder="请填写锁柜原因")
      .footer(slot="footer")
        Button(type="default", @click="close") 取消
        Button(type="primary", @click="confirm") 确认锁柜
</template>

<script lang="ts">
import Vue from 'vue';
import Component, { mixins } from 'vue-class-component';
import LoadPageMixin, { LoadPageMixinInstance } from '@/mixins/loadPage';
import TableBox from '@/components/shared/TableBox.vue';
import PaginationInnerBox from '@/components/shared/PaginationInnerBox.vue';
import { getSkuBundlesV2$, GetSkuBundlesV2Params } from '@/api/sku-bundle';
import { Prop, Watch } from 'vue-property-decorator';
import { createEmptyTrackMeta } from '@/utils/misc';

@Component({
  components: { PaginationInnerBox, TableBox },
  data() {
    return {
      rules: {
        is_breakdown_lock: [
          { required: true, type: "number", message: '必填', trigger: 'blur' }
        ]
      }
    };
  }
})
export default class CabinetLockModal extends Vue {
  visible = false;
  state: any = createEmptyTrackMeta();
  dataTotal = 0;
  form: any = {
    is_breakdown_lock: undefined,
    lock_desc: undefined
  };

  open() {
    this.visible = true;
  }
  close() {
    this.visible = false;
    this.form = {};
    (this.$refs.form as any).resetFields();
  }
  confirm() {
    (this.$refs.form as any).validate().then((validate: any) => {
      if (validate) {
        this.$emit('lockCabinets', this.form);
      }
    });
  }
}
</script>

<style scoped>

</style>
