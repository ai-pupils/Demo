<template lang="pug">
  section
    GoBack
    Card(title="新建货柜组")
      Row(style="margin-bottom: 50px")
        Col(:span="19", :offset="5")
          Steps(:current="step")
            Step(title="填写货柜组信息")
            Step(title="添加货柜")
            Step(title="完成")
      Row(v-show="step===0")
        Col(:span="9", :offset="6")
          BaseInfoForm(@next="confirmHandle")
      Row(v-if="step===1")
        AddCabinet(ref="AddCabinetTable", @next="addCabinetHandle")
      div(v-if="step===2", style="width: 500px; margin: 0 auto;")
        Alert(type="success", show-icon)
          div(style="text-align: left;") 操作成功
          div(slot="desc") 已成功创建货柜组
        Form(:label-width="140")
          FormItem(label="货柜组名称:") {{ groupName | empty }}
          FormItem.pr(label="货柜组描述:", style="top:-25px") {{ groupDescription | empty }}
        div.text-center
          Button(@click="goCabinetGroupList") 完成

</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import GoBack from '@/components/shared/GoBack.vue';
import { Prop, Watch } from 'vue-property-decorator';
import { Getter, Mutation } from 'vuex-class';
import BaseInfoForm from '@/view/cabinet-group/components/BaseInfoForm.vue';
import AddCabinet from '@/view/cabinet-group/components/AddCabinet.vue';
import { CreateCabinetGroup$, getCabinetGroups$ } from '@/api/v2/cabinet-group';

@Component({
  components: { GoBack, AddCabinet, BaseInfoForm }
})
export default class CabinetBundleCreate extends Vue {
  @Getter('cabinetGroup/cabinets') selectCabinets!: any[];
  step: number = 0;
  isValid: boolean = false;
  form: any = {};
  groupName: string = '';
  groupDescription: string = '';

  @Watch('$route.query.step', { deep: true, immediate: true })
  stepChange(stepValue: any) {
    if (stepValue) {
      this.step = Number(stepValue);
      if (stepValue === '1' || stepValue === '2') {
        if (!this.isValid) {
          this.$router.replace({
            name: 'cabinet-group-create',
            query: { ...this.$route.query, step: '0' }
          });
        }
      }
    }
  }

  confirmHandle(form: any) {
    this.isValid = true;
    this.form = { ...form };
  }

  addCabinetHandle(form: any) {
    this.form = { ...this.form, ...form };
    CreateCabinetGroup$(this.form).subscribe((state: any) => {
      if (!state.isError) {
        (this.$refs.AddCabinetTable as any).colseModal();
        this.$router.replace({
          name: 'cabinet-group-create',
          query: { ...this.$route.query, step: '2' }
        });

        const id = state.payload.data.cabinet_group_id;
        getCabinetGroups$({ cabinet_group_id: id }).subscribe(state => {
          if (!state.isError && state.payload) {
            if (state.isFulfill) {
              const {
                payload: {
                  data: { results }
                }
              } = state as any;
              if (results && results.length > 0) {
                this.groupName = results[0].name;
                this.groupDescription = results[0].description;
              }
            }
          }
        });
      }
    });
  }

  goCabinetGroupList() {
    this.$router.replace({ name: 'cabinet-group-list' });
  }

  beforeDestroy() {}
}
</script>
