import { Component } from 'vue-property-decorator';
import Vue from 'vue';
import { concat, defer, forkJoin, Observable, of, Subject } from 'rxjs';
import { catchError, toArray } from 'rxjs/operators';
import { updateBundle$, updateCabinet$ } from '@/api/cabinet';
import { CabinetRuntimeStatusTypes } from '@/const/data/cabinet';
import ShowMessageModal from '@/view/cabinet-group/components/ShowMessageModal.vue';
import _ from 'lodash';

@Component({ components: { ShowMessageModal } })
export default class CabinetGroupDetail extends Vue {
  // 当批量操作货柜组时，所有按钮显示loading
  isLoading = false;
  loading(v: boolean) {
    this.isLoading = v;
  }
  openModal(
    type: string,
    ids: number[],
    serials: string[] = [],
    args: any = {}
  ) {
    let title = '';
    let content = '';
    let method: any = undefined;
    switch (type) {
      case '1':
        title =
          '锁定货柜组后，则货柜组内所有货柜均不可进行交易，确认锁定该货柜组吗？';
        content = '';
        method = this.lockCabinetGroup;
        break;
      case '2':
        title =
          '解锁货柜组后，则货柜组内所有货柜可进行交易，确认解锁该货柜组吗？';
        content = '';
        method = this.unlockCabinetGroup;
        break;
      case '4':
        title = '确认启用QC吗？';
        content = '';
        method = this.openQc;
        break;
      case '5':
        title = '确认关闭QC吗？';
        content = '';
        method = this.closeQc;
        break;
    }
    this.$Modal.confirm({
      title: title,
      content: content,
      onOk: () => {
        this.multipleRequest(method, type, ids, serials, args);
      },
      onCancel: () => {}
    });
  }

  multipleRequest(
    method: any,
    type: string,
    ids: number[],
    serials: string[] = [],
    args: any = {}
  ) {
    this.loading(true);
    // 对ID进行升序排序
    ids = ids.sort((a: number, b: number) => {
      return a - b;
    });
    const methods = ids.map(id => method(id, args));
    concat(...methods)
      .pipe(toArray())
      .subscribe((states: any) => {
        this.showMessage(states, ids, serials, type, args.callback);
      });
  }

  lockCabinetGroup(cabinetId: number, args: any) {
    return updateCabinet$({
      id: cabinetId,
      // todo fix in v2
      status: 'locked_down',
      is_breakdown_lock: Boolean(args.is_breakdown_lock),
      lock_desc: args.lock_desc
    });
  }

  unlockCabinetGroup(cabinetId: number, args: any) {
    return updateCabinet$({
      id: cabinetId,
      // todo fix in v2
      status: 'available'
    });
  }
  changeBundle(cabinetId: number, args: any) {
    return updateBundle$({
      id: cabinetId,
      dealerId: args.dealer_id,
      bundleId: args.bundle_id
    });
  }
  openQc(cabinetId: number, args: any) {
    return updateCabinet$({
      id: cabinetId,
      hybridEnable: true
    });
  }
  closeQc(cabinetId: number, args: any) {
    return updateCabinet$({
      id: cabinetId,
      hybridEnable: false
    });
  }
  showMessage(
    info: any[],
    ids: number[],
    serials: string[],
    type: string,
    callback: any
  ) {
    this.loading(false);
    const errors = info.filter((item: any) => item.error);
    let title = '';
    switch (type) {
      case '1':
        title = '锁柜失败';
        break;
      case '2':
        title = '解锁失败';
        break;
      case '3':
        title = '更换商品组失败';
        break;
      case '4':
        title = '开启QC失败';
        break;
      case '5':
        title = '关闭QC失败';
        break;
    }
    let contents = `<h3 style="margin: 10px">${title}</h3>`;
    info.forEach((item: any, index: number) => {
      if (item.error) {
        contents += `
          <div style="display:flex;">
            <div style="margin: 10px; width: 250px">
              <span>箱体ID： </span>
              <span>${serials[index]}</span>
            </div>
            <div style="margin: 10px; width: 200px;">
              <span>失败原因： </span>
              <span>${item.error.error_msg}<span>
            </div>
          </div>`;
      }
    });
    callback({
      contents: contents,
      success: errors.length === 0
    });
  }
}
