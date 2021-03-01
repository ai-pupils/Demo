<template lang="pug">
  .page-content
    GoBack
    Card
      h6.clearfix(slot='title', style='line-height: 30px')
        span 货柜详情
          span(v-if='currentTab !== "details"') （货柜ID: {{id}} 商户ID: {{cabinet.dealer_id}}）
        div(style='float: right;')
          Button(style='margin-right:5px;', type='primary', :loading='state.isFetching',
          v-if='isCanBindBundle', @click.prevent='showBundles()')
            | 绑定商品组
          <!--          Button(style='margin-right:5px;', type='info', :loading='state.isFetching',-->
          <!--          v-if='isCanChangeBundle && !isInChangeOperationStatus', @click.prevent='doChangeBundleOperationStatus()')-->
          <!--            | 换货-->
          <!--          Button(style='margin-right:5px;', type='info', :loading='state.isFetching',-->
          <!--          v-if='isCanChangeBundle && isInChangeOperationStatus', @click.prevent='revertBundleOperationStatus()')-->
          <!--            | 取消换货-->
          <!--          Tooltip(content="当货柜已绑定商品组且处于换货状态时，才被允许更换商品组", placement="top", theme="light", max-width="200")-->
          Button(style='margin-right:5px;', type='primary', :loading='state.isFetching',
          :disabled='!isCanChangeBundle', @click.prevent='showBundles()')
            | 更换商品组
          Button(style='margin-right:5px;', type='warning', :loading='state.isFetching',
          v-if='isCanReportFault', @click.prevent='reportFault()')
            | 报告故障
          // https://jira.malong.com/browse/SCAD-3190
          //- Button(style='margin-right:5px;', type='primary', :loading='state.isFetching',
          //- v-if='isCanActiveCabinet', @click.prevent='doActivate()')
          //-   | 激活货柜
          Button.warning-btn(style='margin-right:5px;', :class="{'is-disabled': !cabinet.is_malong_iot}", :disabled="!cabinet.is_malong_iot", :loading='state.isFetching',
          v-if='isCanLockCabinet', @click.prevent='openLockModal()')
            | 锁定货柜
          Button(style='margin-right:5px;', type='primary', :disabled="!cabinet.is_malong_iot", :loading='state.isFetching',
          v-if='isCanUnLockCabinet', @click.prevent='unlockCabinet()')
            | 解锁货柜
          // https://jira.malong.com/browse/SCAD-3190
          //- Button(style='margin-right:5px;', type='error', :loading='state.isFetching',
          //- v-if='isCanLogoutCabinet', @click.prevent='logoutCabinet()')
          //-   | 注销货柜
      Tabs(v-model='currentTab')
        TabPane(label='货柜信息', name='details')
          CabinetForm(ref='CabinetForm', v-show="currentTab === 'details'", :id='id', type='create',
            @getCabinetInfo='getCabinetInfo', @state='getState', @closeLockModal="closeLockModal")
        TabPane(label='商品组', name='skubundle')
          SkuBundleTable(v-if="currentTab === 'skubundle'", :cabinet_id='id')
        TabPane(label='历史快照', name='snapshot')
          SnapShot(:cabinet-id='id', :model-id='modelId', :isMalongIot="cabinet.is_malong_iot", v-if="currentTab ==='snapshot'")
        TabPane(label='历史交易', name='trxHistory')
          TrxHistory(:cabinetId='id', v-if="currentTab ==='trxHistory'")
        TabPane(label='历史异常', name='systemAnomalies')
          SystemAnomalies(:cabinetId='id', v-if="currentTab ==='systemAnomalies'")
        <!--        TabPane(label='故障记录', name='systemFaultLogs')-->
        <!--          SystemFaultLogs(:cabinetId='id', v-if="currentTab ==='systemFaultLogs'")-->
        TabPane(label='状态监控', name='cabinetStatusMonitor')
          .show(v-if="cabinet.is_malong_iot")
            CabinetStatusMonitor(:cabinetId='id', v-if="currentTab ==='cabinetStatusMonitor'")
          Alert(v-else, type="warning") 暂无数据
        TabPane(label='锁柜记录', name='cabinetLockedLogs')
          .show(v-if="cabinet.is_malong_iot")
            CabinetLockedLogs(:cabinetId='id', v-if="currentTab ==='cabinetLockedLogs'")
          Alert(v-else, type="warning") 暂无数据
        <!--SystemFaultInitModal(ref='initModal', :faultType="CabinetFaultSource.REPORT.id")-->
        TabPane(label='设备调节', name='deviceUpdate')
          .show(v-if="cabinet.is_malong_iot")
            DeviceUpdate(:cabinetId='id', v-if="currentTab === 'deviceUpdate'")
          Alert(v-else, type="warning") 暂无数据
    SystemFaultInitModal(ref='initModal', :faultType="CabinetFaultSource.REPORT.id")
    CabinetLockModal(ref="cabinetLockModal", @lockCabinets="lockCabinet")
</template>
<script lang="ts">
import _ from 'lodash';
import GoBack from '@/components/shared/GoBack.vue';
import CabinetForm from './components/CabinetForm.vue';
import SnapShot from './Snapshots.vue';
import SkuBundleTable from './components/SkuBundleTable.vue';
import TrxHistory from './components/TrxHistory.vue';
import SystemAnomalies from './components/SystemAnomalies.vue';
import SystemFaultLogs from '@/view/cabinet/components/SystemFaultLogs.vue';
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { createEmptyTrackMeta } from '@/utils/misc';
import { CabinetFaultSource } from '@/const/data/cabinetFault';
import SystemFaultInitModal from '@/view/cabinet/components/SystemFaultInitModal.vue';
import CabinetStatusMonitor from '@/view/cabinet/components/CabinetStatusMonitor.vue';
import CabinetLockModal from '@/view/cabinet-group/components/CabinetLockModal.vue';
import DeviceUpdate from '@/view/cabinet/components/DeviceUpdate.vue';
import CabinetLockedLogs from '@/view/cabinet/components/CabinetLockedLogs.vue';

@Component({
  components: {
    DeviceUpdate,
    CabinetForm,
    GoBack,
    SnapShot,
    SkuBundleTable,
    TrxHistory,
    SystemAnomalies,
    SystemFaultLogs,
    SystemFaultInitModal,
    CabinetStatusMonitor,
    CabinetLockModal,
    CabinetLockedLogs
  }
})
export default class CabinetTypeForm extends Vue {
  @Prop() id: any;
  @Prop() modelId: any;
  cabinet: any = {};
  state: any = createEmptyTrackMeta();
  CabinetFaultSource = CabinetFaultSource;

  get isCanActiveCabinet(): boolean {
    // 货柜注销后，运营状体会更新为disable
    return this.cabinet.status === 'disable';
  }

  get isCanBindBundle(): boolean {
    return this.cabinet.bundle_id <= 0;
  }

  get isCanChangeBundle(): boolean {
    return this.cabinet.bundle_id > 0;
  }

  get isInChangeOperationStatus(): boolean {
    return this.cabinet.operation_status === 'replenishing';
  }

  get isCanReportFault(): boolean {
    return true;
  }

  get isCanLockCabinet(): boolean {
    return (
      this.cabinet.status !== 'opened' &&
      this.cabinet.runtime_status !== 'locked_down'
    );
  }

  get isCanUnLockCabinet(): boolean {
    return this.cabinet.runtime_status === 'locked_down';
  }

  get isCanLogoutCabinet(): boolean {
    return (
      this.cabinet.status === 'authorized' ||
      this.cabinet.status === 'available'
    );
  }

  getCabinetInfo(cabinet: any) {
    this.cabinet = cabinet;
  }

  getState(state: any) {
    this.state = state;
  }

  showBundles() {
    (this.$refs.CabinetForm as CabinetForm).showBundles(this.cabinet);
  }

  reportFault() {
    (this.$refs['initModal'] as SystemFaultInitModal).load({
      cabinetId: this.id
    });
  }

  doChangeBundleOperationStatus() {
    (this.$refs.CabinetForm as CabinetForm).changeBundleOperationStatus(
      this.cabinet
    );
  }

  revertBundleOperationStatus() {
    (this.$refs.CabinetForm as CabinetForm).revertBundleOperationStatus(
      this.cabinet
    );
  }

  doActivate() {
    (this.$refs.CabinetForm as CabinetForm).doActivate(this.cabinet);
  }

  openLockModal() {
    (this.$refs.cabinetLockModal as any).open();
  }

  closeLockModal() {
    (this.$refs.cabinetLockModal as any).close();
  }

  lockCabinet(form: any) {
    (this.$refs.CabinetForm as CabinetForm).lockCabinet(this.cabinet, form);
  }

  unlockCabinet() {
    (this.$refs.CabinetForm as CabinetForm).unlockCabinet(this.cabinet);
  }

  logoutCabinet() {
    (this.$refs.CabinetForm as CabinetForm).logoutCabinet(this.cabinet);
  }

  get currentTab() {
    const {
      $route: {
        query: { currentTab }
      }
    } = this;
    if (_.isNil(currentTab)) {
      return 'details';
    }
    return currentTab;
  }

  set currentTab(value: any) {
    const {
      $route: { query }
    } = this;
    this.$router.replace({
      query: { currentTab: value }
    });
  }
}
</script>

<style scoped>
.warning-btn {
  color: #fff;
  background-color: #ff725e;
  border-color: #ff725e;
}
.is-disabled {
  color: #c5c8ce;
  background-color: #f7f7f7;
  border-color: #dcdee2;
}
</style>
