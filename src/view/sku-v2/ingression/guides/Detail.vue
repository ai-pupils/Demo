<template lang="pug">
  div
    GoBack
    Card(title="指南详情")
      div.info-container
        p.info-item
          | 指南 ID：{{guideData.id}}
        p.info-item
          template(v-if="!editingName")
            | 指南名称：{{guideData.name}}
            Button(icon="md-create", shape="circle", @click="editInfo", :disabled="isDisabled").ml5
              | 修改名称
          template(v-else)
            | 指南名称：
            Input(v-model="editingName", style="width: 200px")
            ButtonGroup
              Button(type="primary", @click="updateGuideName")
                | 确定
              Button(type="default", @click="cancelUpdateName")
                | 取消
          p.info-item
            | 指南状态：
            DataTag(:value="guideData.status" :dataMap="GUIDE_STATUS")
      Card(title="相关指令", dis-hover, :bordered="false").instructions
        div(slot="extra").operations
          ButtonGroup
            Button(type="primary", icon="md-search" :disabled="isDisabled" @click="toggleLinking(true)").pull-right
              | 关联现有指令
            Button(type="primary", icon="md-add" :disabled="isDisabled" @click="toggleAdding(true)").pull-right
              | 增加新的指令
          Poptip(confirm title="确认后的指南无法再修改，是否继续？" @on-ok="confirmGuide" width="220" placement="top-end").ml5
            Button(type="success", icon="md-checkmark" :disabled="isDisabled").pull-right
              | 确认这份指南
        InstructionTable(:state="instructionsState")
          template(slot="operation" slot-scope="scope")
            Button(type="primary", :disabled="isDisabled" @click="startEdit(scope.info)")
              | 编辑指令
            Poptip(title="确定要取消关联该指令吗？" width="200" placement="top-end" transfer
              content="content" confirm @on-ok="unlinkInstruction(scope.info.id)")
              Button(type="error" :disabled="isDisabled").ml5
                | 取消关联
            div.mt5
              ButtonGroup
                Button(icon="md-arrow-round-up", :disabled="isDisabled", @click="changeIndex(scope.info.id, -1)")
                  | 调整顺序
                Button(icon="md-arrow-round-down", :disabled="isDisabled", @click="changeIndex(scope.info.id, 1)")
                  | 调整顺序
        Modal(:value="isLinking" :width="1200", @on-cancel="toggleLinking(false)", footer-hide)
          AddExistedInstruction(v-if="isLinking", :currentData="guideData.instructions", @onAdd="addInstruction")
        Modal(:value="!!activeInstruction" :width="1300", @on-cancel="close" footer-hide)
          EditInstruction(v-if="activeInstruction", :info="activeInstruction" @cancel="close" @onChanged="getGuideData")
        Modal(:value="isAdding",:width="1200", @on-cancel="toggleAdding(false)" footer-hide)
          AddNewInstruction(v-if="isAdding", @onAdded="onNewInstructionAdded")
</template>
<script lang="ts">
import Component, {mixins} from 'vue-class-component';
import Vue from 'vue';
import { getOneGuide$,
  GetOneIngressionGuideParams,
  updateGuide$,
  confirmGuide$,
  ConfirmGuideParams,
  UpdateGuideParams } from '@/api/v2/skus';
import { DefaultApiType } from '@/interface';
import TableBox from '@/components/shared/TableBox.vue';
import EditInstruction from '../instructions/EditInstruction.vue';
import InstructionTable from '../instructions/InstructionsTable.vue';
import AddExistedInstruction from './AddInstruction.vue';
import AddNewInstruction from './addNewInstruction.vue';
import { createEmptyTrackMeta } from '@/utils/misc';
import { State } from 'vuex-class';
import GoBack from '@/components/shared/GoBack.vue';
import DataTag from '@/components/shared/DataTag.vue';
import {GUIDE_STATUS, GUIDE_STATUS_CONFIRMED} from '@/const/data/v2/ingression.ts'

@Component({
  components: { TableBox, EditInstruction, InstructionTable, AddExistedInstruction, GoBack, AddNewInstruction, DataTag },
})
export default class GuideDetail extends Vue {
  @State('profile') user!: any;
  state: any = createEmptyTrackMeta();
  activeInstruction: null|object = null;
  editingName: string = '';
  isEditing: boolean = false;
  isLinking: boolean = false;
  isAdding: boolean = false;
  get GUIDE_STATUS() {
    return GUIDE_STATUS;
  }
  get isDisabled() {
    return this.guideData.status === GUIDE_STATUS_CONFIRMED
  }
  get guideId() {
    return (this.$route.params as any).id;
  }
  get params(): GetOneIngressionGuideParams {
    return {
      guideId: Number(this.guideId)
    }
  };
  get instructionsState() {
    const {state: {payload, isFetching, ...others}} = this;
    if(isFetching) {
      return this.state
    }
    return {
      ...others,
      isFetching,
      payload: {
        data: {
          data: payload.data.data.instructions
        }
      }
    }
  }
  get instructionsIds() {
    const {state: {isFetching}} = this;
    if(isFetching) {
      return []
    }
    const {guideData: {instructions = []}} = this
    return instructions.map(item => item.id)
  }
  get guideData() {
    const {state: {payload, isFetching}} = this;
    if(isFetching) {
      return {}
    }
    return payload.data.data
  }
  startEdit(instruction: object) {
    this.activeInstruction = instruction;
  }
  editInfo() {
    this.editingName = this.guideData.name;
  }
  close(){
    this.activeInstruction = null;
  }
  toggleAdding(flag: boolean) {
    this.isAdding = flag;
  }
  toggleLinking(flag: boolean) {
    this.isLinking = flag;
  }
  getGuideData() {
    return getOneGuide$(this.params).subscribe(withMetaResponse => {
      this.state = withMetaResponse;
    });
  }
  confirmGuide() {
    const params: ConfirmGuideParams = {
      guideId: this.guideId,
      updater: this.user.payload.data.account
    }
    return confirmGuide$(params).subscribe(state => {
      if(!state.isError) {
        this.$Message.success('操作成功！')
        this.getGuideData()
      }
    })
  }
  updateGuide(params: UpdateGuideParams) {
    const data: UpdateGuideParams = {
      ...params,
      guideId: this.guideId,
      updater: this.user.payload.data.account
    }
    return updateGuide$(data)
  }
  unlinkInstruction(id: number) {
    const newInstructionIds = this.instructionsIds.filter((instruction: number) => instruction !== id);
    this.updateGuideInstructions(newInstructionIds)
  }
  addInstruction(id: number) {
    const newInstructionIds = [...this.instructionsIds, id]
    this.updateGuideInstructions(newInstructionIds)
  }
  onNewInstructionAdded(id: number) {
    this.addInstruction(id)
    this.toggleAdding(false)
  }
  updateGuideName() {
    const {editingName: name} = this;
    this.updateGuide({name}).subscribe((state) => {
      if (!state.isError) {
        this.guideData.name = name
        this.editingName = ''
        this.$Message.success('修改成功！')
      }
    })
  }
  updateGuideInstructions(newInstructionIds) {
    this.updateGuide({instructionIds: newInstructionIds}).subscribe((state) => {
      if (!state.isError) {
        this.$Message.success('操作成功！')
        this.getGuideData()
      }
    })
  }
  cancelUpdateName() {
    this.editingName = ''
  }
  changeIndex(id: number, step: number) {
    const {instructionsIds} = this;
    const index = instructionsIds.findIndex((instruction: any) => instruction === id);
    const finalIndex = index+step;
    if( index > -1 && finalIndex > -1 && finalIndex < instructionsIds.length) {
      const newInstructionIds = instructionsIds.slice()
      newInstructionIds[finalIndex] = instructionsIds[index]
      newInstructionIds[index] = instructionsIds[finalIndex]
      this.updateGuideInstructions(newInstructionIds)
    }
  }
  created() {
    this.getGuideData()
  }
}

</script>
<style lang="less" scoped>
  @import (less) '~@/css/vars.less';

  .info {
    margin-bottom: 40px;
    &-container {
      display: flex;
      align-items: center;
      padding: 16px;
    }
    &-item {
      width: 33.33%
    }
  }
  .operations {
    display: flex;
    align-items: flex-start;;
  }
  .title {
    margin-bottom: 10px;
  }
  .mt5 {
    margin-top: 5px;
  }
</style>
