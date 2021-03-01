<template lang="pug">
  section
    GoBack
    Card.mb10
      .header
        h3 货柜组详情
        .btn-group
          Button.ml10(@click="open('1')", type="warning",
            :loading="selectCabinets.length===0 || isLoading") 锁定货柜组
          Button.ml10(@click="open('2')", type="success",
            :loading="selectCabinets.length===0 || isLoading") 解锁货柜组
          Button.ml10(@click="open('3')", type="info",
            :loading="selectCabinets.length===0 || isLoading", :disabled="!canEditBundle") 更换商品组
          Button.ml10(@click="open('4')", type="primary",
            :loading="selectCabinets.length===0 || isLoading") 启用QC
          Button.ml10(@click="open('5')", type="error",
            :loading="selectCabinets.length===0 || isLoading") 关闭QC
    Card.mb10(title="基础信息")
      Row.mb20(:gutter="20")
        Col(:span="2")
          span.bold 货柜组ID：
          span {{ cabinetGroupDetail.id }}
        Col(:span="6", :offset="1")
          span.bold 货柜组名称：
          Input(v-if="groupInfo.name.edit", v-model="cabinetGroupDetail.name", placeholder="货柜组名称", style="width: 50%")
          span(v-else) {{ groupInfo.name.value | empty }}
          a(v-if="!groupInfo.name.edit", @click="editGroupInfo('name')")
            Icon.ml10(type="md-create", size="16")
          a(v-else)
            Icon.ml10(type="md-checkmark", size="16", color="green", @click="submit('name')")
            Icon.ml10(@click="groupInfo.name.edit = false", type="md-close", color="red", size="16")
        Col(:span="6", :offset="1")
          span.bold 创建时间：
          span {{ cabinetGroupDetail.created_at | fmtLocalTime | empty }}
        Col(:span="6", :offset="1")
          span.bold 创建人：
          span {{ cabinetGroupDetail.creator_name | empty}}
      Row
        Col(:span="16")
          span.bold 货柜组描述：
          Input(v-if="groupInfo.description.edit", v-model="cabinetGroupDetail.description",
            placeholder="货柜组描述", style="width: 50%", type="textarea", :rows="2")
          span(v-else) {{ groupInfo.description.value | empty }}
          a(v-if="!groupInfo.description.edit", @click="editGroupInfo('description')")
            Icon.ml10(type="md-create", size="16")
          a(v-else)
            Icon.ml10(type="md-checkmark", color="green", @click="submit('description')", size="16")
            Icon.ml10(@click="groupInfo.description.edit = false", type="md-close", color="red", size="16")
    Card(title="货柜列表")
      add-cabinet(v-if="isFulfillData", ref="AddCabinetTable", :isExist="true", :isLoading="isLoading",
        :existCabinets="cabinets", :cabinetsTotal="cabinetsTotal", @next="submitHandle", @search="getExistCabinets")
      Spin(v-else, :fix="true" size="large")
    SkuBundleModal(v-if="canEditBundle", ref="bundleModal", :info="editBundleInfo", @changeBundles="changeBundles")
    CabinetLockModal(ref="lockCabinets", @lockCabinets="lockCabinets")
    ShowMessageModal(ref="msgModal")
</template>

<script lang="ts">
import Vue from 'vue';
import Component, { mixins } from 'vue-class-component';
import GoBack from '@/components/shared/GoBack.vue';
import LoadPageMixin, { LoadPageMixinInstance } from '@/mixins/loadPage';
import {
  getCabinetGroups$,
  GetCabinetGroupsParams,
  UpdateCabinetGroup$
} from '@/api/v2/cabinet-group';
import { Prop, Watch } from 'vue-property-decorator';
import { MetaType } from '@/interface';
import AddCabinet from '@/view/cabinet-group/components/AddCabinet.vue';
import { getCabinets$ } from '@/api/cabinet';
import { Getter } from 'vuex-class';
import Index from '@/view/monitor/recognition/Index.vue';
import CabinetGroupDetail from '@/view/cabinet-group/mixin';
import _ from 'lodash';
import SkuBundleModal from '@/view/cabinet-group/components/SkuBundleModal.vue';
import ShowMessageModal from '@/view/cabinet-group/components/ShowMessageModal.vue';
import CabinetLockModal from '@/view/cabinet-group/components/CabinetLockModal.vue';

@Component({
  components: {
    CabinetLockModal,
    Index,
    GoBack,
    AddCabinet,
    SkuBundleModal,
    ShowMessageModal
  }
})
export default class Detail extends mixins(CabinetGroupDetail) {
  @Prop() id!: number;
  @Getter('cabinetGroup/cabinets') selectCabinets!: any[];
  // 货柜组存在的货柜原始数据
  existCabinetsRaw: any = undefined;
  cabinetGroupDetail: any = {};
  canSubmitBaseInfo = true;
  transformParams(params: GetCabinetGroupsParams) {
    params.pageIndex = 1;
    return params;
  }

  // 更新货柜组需要的信息
  groupInfo: any = {
    name: { value: '', edit: false },
    description: { value: '', edit: false }
  };

  // 用于展示当前已经添加的货柜组信息
  cabinets: any = [];
  cabinetsTotal = 0;
  isFulfillData = false;

  // 是否可以更换商品组
  canEditBundle = false;
  // 更换商品组需要的信息
  editBundleInfo: any[] = [];

  mounted() {
    this.getCabinetGroups();
  }

  getCabinetGroups() {
    getCabinetGroups$({ cabinet_group_id: this.id }).subscribe(
      (state: MetaType) => {
        if (state.isFulfill) {
          const {
            payload: {
              data: { results }
            }
          } = state;
          if (results.length > 0) {
            this.cabinetGroupDetail = results[0];
            this.groupInfo.name.value = this.cabinetGroupDetail.name;
            this.groupInfo.description.value = this.cabinetGroupDetail.description;
          }
        }
      }
    );
  }

  @Watch('cabinetGroupDetail', { immediate: true })
  cabinetGroupDetailChanged(info: any) {
    if (info && info.cabinet_ids) {
      this.isFulfillData = false;
      this.getExistCabinets({});
    }
  }

  getExistCabinets(searchParams: any) {
    this.getExistCabinets$(searchParams).then((state: MetaType) => {
      this.isFulfillData = state.isFulfill;
      if (state.isFulfill) {
        this.cabinets = state.payload.data.results;
        if (!this.existCabinetsRaw) {
          this.existCabinetsRaw = _.cloneDeep(state.payload.data.results);
          this.checkCabinets();
        }
        this.cabinetsTotal =
          state.payload.data.total_count || state.payload.data.paging.total;
      }
    });
  }

  getExistCabinets$(searchParams: any) {
    return getCabinets$({
      cabinet_ids: this.cabinetGroupDetail.cabinet_ids.toString(),
      ...searchParams,
      pageIndex: 1,
      pageSize: 999
    }).toPromise();
  }

  editGroupInfo(type: string) {
    this.groupInfo[type].edit = true;
    this.cabinetGroupDetail.name = this.groupInfo[type].value;
  }

  submit(type: string) {
    if(!this.canSubmitBaseInfo){
      return
    }
    this.canSubmitBaseInfo = false;
    let params: any = { cabinet_group_id: this.cabinetGroupDetail.id };
    params[type] = this.cabinetGroupDetail[type];
    UpdateCabinetGroup$(params).subscribe((state: MetaType) => {
      if (!state.isError) {
        this.$Message.success('更新成功！');
        this.groupInfo[type].value = this.cabinetGroupDetail[type];
        this.groupInfo[type].edit = false;
      } else {
        this.$Message.error('更新失败！');
      }
      this.canSubmitBaseInfo = true;
    });
  }

  submitHandle(params: any) {
    UpdateCabinetGroup$({
      cabinet_group_id: this.id,
      cabinet_ids: params.cabinet_ids
    }).subscribe((state: MetaType) => {
      if (state.isFulfill) {
        this.$Message.success('更新成功');
        (this.$refs.AddCabinetTable as any).colseModal();
        this.existCabinetsRaw = undefined;
        this.getCabinetGroups();
      }
    });
  }

  checkCabinets() {
    let infoSet = new Set();
    this.editBundleInfo = [];
    if (this.existCabinetsRaw) {
      this.existCabinetsRaw.forEach((cabinet: any) => {
        infoSet.add(
          `${cabinet.cabinet_type_info.vision_id}|${cabinet.dealer_id}`
        );
      });
      infoSet.forEach((info: string) => {
        this.editBundleInfo.push({
          vision_id: info.split('|')[0],
          dealer_id: info.split('|')[1]
        });
      });
      this.canEditBundle = this.editBundleInfo.length === 1;
    }
  }

  openBundleModal() {
    (this.$refs.bundleModal as any).open(this.editBundleInfo);
  }

  get serials() {
    return _.sortBy(this.existCabinetsRaw, ['id']).map((c: any) => {
      return c.serial || '无';
    }) as any;
  }

  get canLockCabinets() {
    const cabinets = this.existCabinetsRaw.filter((c: any) => {
      // todo fix runtime_status in v2
      if (c.runtime_status !== 'locked_down' && c.runtime_status !== 'opened') {
        return { id: c.id, serial: c.serial };
      }
    });
    return _.sortBy(cabinets, ['id']);
  }

  changeBundles(row: any) {
    this.multipleRequest(
      this.changeBundle,
      '3',
      this.cabinetGroupDetail.cabinet_ids,
      this.serials as any,
      {
        dealer_id: row.dealer_id,
        bundle_id: row.id,
        callback: this.showMessageModal
      }
    );
    (this.$refs.bundleModal as any).close();
  }

  showMessageModal(info: any) {
    // 刷新状态
    this.getExistCabinets({});
    if (info.success) {
      this.$Message.success('操作成功！');
    } else {
      (this.$refs.msgModal as any).open(info);
    }
  }

  open(type: string) {
    switch (type) {
      case '1':
        (this.$refs.lockCabinets as any).open();
        break;
      case '3':
        (this.$refs.bundleModal as any).open(this.editBundleInfo);
        break;
      default:
        this.openModal(
          type,
          this.cabinetGroupDetail.cabinet_ids,
          this.serials as any,
          {
            callback: this.showMessageModal
          }
        );
    }
  }
  lockCabinets(form: any) {
    const ids = this.canLockCabinets.map((c: any) => {
      return c.id;
    });
    const serials = this.canLockCabinets.map((c: any) => {
      return c.serial;
    });
    this.multipleRequest(this.lockCabinetGroup, '1', ids, serials, {
      ...form,
      callback: this.showMessageModal
    });
    (this.$refs.lockCabinets as any).close();
  }
}
</script>

<style scoped>
.header {
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
}
</style>
