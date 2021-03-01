<template lang="pug">
  div
    Row.info-title 基本信息
    Row.info-box
      Form(inline, :label-width='120', label-position='left')
        Col(span='8')
          FormItem(label='货柜ID：') {{cabinet.id}}
        Col(span='8')
          FormItem(label='商户ID：') {{cabinet.dealer_id}}
        Col(span='8')
          FormItem(label='货柜名称：') {{cabinet.name | emptyText}}
    Row.info-box
      Form(inline, :label-width='120', label-position='left')
        Col(span='8')
          FormItem(label='货柜编号：') {{cabinet.serial | emptyText}}
        Col(span='8')
          FormItem(label='柜体名称：') {{(cabinet.cabinet_type_info && cabinet.cabinet_type_info.name) | emptyText}}
        Col(span='8')
          FormItem(label='货柜ManagerID：') {{cabinet.manager_cabinet_id | emptyText}}
    Row.info-box
      Form(inline, :label-width='120', label-position='left')
        Col(span='8')
          FormItem(label='货柜位置：') {{cabinet.location | emptyText}}
        Col(span='8')
          FormItem(label='货柜描述：') {{cabinet.desc | emptyText}}
        <!--        Col(span='8')-->
        <!--          FormItem(label='换货状态：')-->
        <!--            Tag(v-if="cabinet.operation_status === 'in_operation'") 无-->
        <!--            Tag(v-else, color="orange") 换货中-->
        <!--    Row.info-box-->
        <!--      Form(inline, :label-width='110', label-position='left')-->
        Col(span='8')
          FormItem(label='固件版本：') {{cabinet.firmware | emptyText}}
    Row.info-title 硬件
    Row.info-box
      Form(inline, :label-width='110', label-position='left')
        Col(span='8')
          FormItem(label='货柜型号：') {{(cabinet.cabinet_type_info && cabinet.cabinet_type_info.factory_model) | emptyText}}
        Col(span='8')
          FormItem(label='摄像头类型：') {{(cabinet.cabinet_type_info && cabinet.cabinet_type_info.camera_model) | emptyText}}
        Col(span='8')
          FormItem(label='灯类型：') {{(cabinet.cabinet_type_info && cabinet.cabinet_type_info.light_model) | emptyText}}
    Row.info-box
      Form(inline, :label-width='110', label-position='left')
        Col(span='8')
          FormItem(label='工控机：') {{(cabinet.cabinet_type_info && cabinet.cabinet_type_info.industrial_pc_model) | emptyText}}
        Col(span='8')
          FormItem(label='层板：') {{(cabinet.cabinet_type_info && cabinet.cabinet_type_info.board_model) | emptyText}}
        Col(span='8')
          FormItem(label='灯功率：')
    Row.info-box
      Form(inline, :label-width='110', label-position='left')
        Col(span='8')
          FormItem(label='锁：') {{(cabinet.cabinet_type_info && cabinet.cabinet_type_info.lock_model) | empty}}
        Col(span='8')
          FormItem(label='路由器：') {{(cabinet.cabinet_type_info && cabinet.cabinet_type_info.router_model) | empty}}
        Col(span='8')
          FormItem(label='工控板IMEI：') {{cabinet.imei | empty}}
    Row.info-box
      Form(inline, :label-width='110', label-position='left')
        Col(span='8')
          FormItem(label='ICCID：') {{(cabinet.iccid) | empty}}
    Row.info-title 货柜状态
    Row.info-box
      Form(inline, :label-width='110', label-position='left')
        Col(span='8')
          FormItem(label='货柜运营状态：') {{cabinet.status | getCabinetStatusTypes}}
        Col(span='8')
          FormItem(label='创建时间：') {{cabinet.create_time | fmtLocalTime}}
        Col(span='8')
          FormItem(label='当前温度：')
            span(v-if="cabinet.temperature") {{ `${cabinet.temperature} 摄氏度` }}
            span(v-else) --
    Row.info-box
      Form(inline, :label-width='110', label-position='left')
        Col(span='8')
          FormItem(label='货柜运行状态：') {{cabinet.runtime_status | getCabinetRuntimeStatusTypes}}
        Col(span='8')
          FormItem(label='激活时间：')
            div(v-if='cabinet.activated_at ') {{cabinet.activated_at | fmtLocalTime}}
            div(v-else='') --
    Row.info-box
      Form(inline, :label-width='110', label-position='left')
        Col(span='8')
          FormItem(label='故障状态：') {{cabinet.fault_status | getCabinetFaultStatusFilter}}
    Row.info-title 服务相关
    Row.info-box
      Form(inline, :label-width='110', label-position='left')
        Col(span='8')
          FormItem(label='商品组ID：')
            div(v-if='cabinet.bundle_id > 0')
              router-link(:to="'/v2/sku-bundle/list?pageIndex=1&keyword='+cabinet.bundle_id ") {{cabinet.bundle_id | empty}}
            div(v-else)
              span --
        Col(span='8')
            FormItem(label='商品组名称：') {{(cabinet.binding_service && cabinet.binding_service.bundle_name) | empty}}
    Row.info-box
      Form(inline, :label-width='110', label-position='left')
        Col(span='8')
            FormItem(label='所属服务ID：')
              div(v-if="cabinet.binding_service && cabinet.status !== 'disable'")
                span {{ cabinet.binding_service.id }}
              div(v-else='') --
        Col(span='8')
          FormItem(label='服务名称：') {{(cabinet.binding_service && cabinet.binding_service.name) | empty}}
        Col(span='8')
          FormItem(label='服务版本：') {{(cabinet.binding_service && cabinet.binding_service.is_default) | getModelVersion}}
    Row.info-box
      Form(inline, :label-width='110', label-position='left')
        Col(span='8')
          FormItem(label='服务状态：')
            div(v-if='cabinet.binding_service') {{cabinet.binding_service.status | getModelServiceTypes}}
        Col(span='8')
          FormItem(label='LicenseID：') {{cabinet.license_id}}
    BindSkuBundleModal(ref='BindSkuBundleModal')
    Spin(size='large' fix v-if='isFetching')
</template>

<script lang="ts">
import {
  getCabinet$,
  updateCabinet$,
  activateCabinet$,
  logoutCabinet$,
  refreshCabinet$
} from '@/api/cabinet';
import { createEmptyTrackMeta } from '@/utils/misc';
import { getCabinetRuntimeStatusTypes } from '@/filters';
import BindSkuBundleModal from './BindSkuBundleModal.vue';
import Vue from 'vue';
import { Component, Prop, Provide, Watch } from 'vue-property-decorator';
import ComponentOptionsMixin from '@/mixins/componentOptions';
import { finalize, mergeMap } from 'rxjs/operators';
import { refreshCabinetExceptions$ } from '@/api/v2/cabinet-exceptions';

@Component({
  components: {
    BindSkuBundleModal
  }
})
export default class CabinetTable extends ComponentOptionsMixin {
  @Prop() id!: number;
  cabinet: any = {};
  state: any = createEmptyTrackMeta();

  mounted() {
    this.loadData();
    refreshCabinet$.subscribe(() => this.loadData());
  }

  @Watch('state')
  stateChange() {
    this.$emit('state', this.state);
  }

  showBundles(cabinet: any) {
    if (cabinet.bundle_id <= 0) {
      (this.$refs.BindSkuBundleModal as BindSkuBundleModal).load(cabinet);
    } else {
      this.$Modal.confirm({
        title: '确认',
        content: '本货柜已绑定商品组，确认更改商品组？',
        onOk: () => {
          (this.$refs.BindSkuBundleModal as BindSkuBundleModal).load(cabinet);
        }
      });
    }
  }

  get currentTab() {
    const {
      $route: {
        query: { currentTab }
      }
    } = this;
    return currentTab;
  }

  goBack() {
    window.history.go(-1);
  }

  loadData() {
    this.startFetch$()
      .pipe(
        mergeMap(() => getCabinet$(this.id)),
        finalize(() => {
          this.endFetch();
        })
      )
      .subscribe((res: any) => {
        if (res.isFulfill) {
          const {
            payload: { data }
          } = res;
          this.cabinet = data;
          this.state = res;
          this.$emit('getCabinetInfo', this.cabinet);
        }
      });
  }

  doActivate(cabinet: any) {
    this.$Modal.confirm({
      title: '确认',
      content: `<p>激活货柜后，货柜将被授权，确认激活该货柜(${cabinet.manager_cabinet_id})？</p>`,
      onOk: () => {
        this.state = createEmptyTrackMeta();
        activateCabinet$(cabinet.id).subscribe(withMetaResponse => {
          this.state = withMetaResponse;
          if (!withMetaResponse.isError && withMetaResponse.payload) {
            this.loadData();
            this.$Message.success('激活成功!');
          }
        });
      }
    });
  }

  logoutCabinet(cabinet: any) {
    this.$Modal.confirm({
      title: '确认',
      content: `<p>注销货柜后，授权会被回收，确认注销该货柜(${cabinet.manager_cabinet_id})？</p>`,
      onOk: () => {
        this.state = createEmptyTrackMeta();
        logoutCabinet$(cabinet.id).subscribe(withMetaResponse => {
          this.state = withMetaResponse;
          if (!withMetaResponse.isError && withMetaResponse.payload) {
            this.loadData();
            this.$Message.success('注销成功!');
          }
        });
      }
    });
  }

  lockCabinet(cabinet: any, form: any) {
    this.$emit('closeLockModal');
    updateCabinet$({
      id: cabinet.id,
      status: 'locked_down',
      ...form
    }).subscribe(withMetaResponse => {
      this.state = withMetaResponse;
      if (!withMetaResponse.isError && withMetaResponse.payload) {
        const { runtime_status } = (withMetaResponse as any).payload.data;
        cabinet.runtime_status = runtime_status;
        if (runtime_status === 'locked_down') {
          this.$Message.success('锁定成功!');
        } else {
          this.$Message.error('锁定失败!');
        }
        if (this.currentTab === 'cabinetLockedLogs') {
          // 广播，更新数据
          refreshCabinetExceptions$.next();
        }
        this.loadData();
      }
    });
  }

  unlockCabinet(cabinet: any) {
    if (
      cabinet.status !== 'available' ||
      cabinet.runtime_status !== 'locked_down'
    ) {
      return;
    }
    this.$Modal.confirm({
      title: '确认',
      content: `<p>解除锁定后，该货柜可进行正常交易，确认解除锁定货柜(${cabinet.manager_cabinet_id})？</p>`,
      onOk: () => {
        this.state = createEmptyTrackMeta();
        updateCabinet$({ id: cabinet.id, status: 'available' }).subscribe(
          withMetaResponse => {
            this.state = withMetaResponse;
            if (!withMetaResponse.isError && withMetaResponse.payload) {
              const { runtime_status } = (withMetaResponse as any).payload.data;
              cabinet.runtime_status = runtime_status;
              if (runtime_status === 'available') {
                this.$Message.success('解锁成功!');
              } else {
                this.$Message.error('解锁失败!');
              }
              if (this.currentTab === 'cabinetLockedLogs') {
                // 广播，更新数据
                refreshCabinetExceptions$.next();
              }
              this.loadData();
            }
          }
        );
      }
    });
  }

  changeBundleOperationStatus(cabinet: any) {
    this.$Modal.confirm({
      title: '确认',
      content: `<p>是否切换为换货状态(${cabinet.manager_cabinet_id})？</p>`,
      onOk: () => {
        this.state = createEmptyTrackMeta();
        updateCabinet$({
          id: cabinet.id,
          operation_status: 'replenishing'
        }).subscribe(withMetaResponse => {
          this.state = withMetaResponse;
          if (!withMetaResponse.isError && withMetaResponse.payload) {
            this.loadData();
            this.$Message.success('切换成功!');
          }
        });
      }
    });
  }

  revertBundleOperationStatus(cabinet: any) {
    this.$Modal.confirm({
      title: '确认',
      content: `<p>是否取消换货状态(${cabinet.manager_cabinet_id})？</p>`,
      onOk: () => {
        this.state = createEmptyTrackMeta();
        updateCabinet$({
          id: cabinet.id,
          operation_status: 'in_operation'
        }).subscribe(withMetaResponse => {
          this.state = withMetaResponse;
          if (!withMetaResponse.isError && withMetaResponse.payload) {
            this.loadData();
            this.$Message.success('切换成功!');
          }
        });
      }
    });
  }
}
</script>

<style scoped>
</style>
<style>
</style>
