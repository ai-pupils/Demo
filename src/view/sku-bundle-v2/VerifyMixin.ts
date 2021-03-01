import Vue from 'vue';
import Component from 'vue-class-component';
import { VerifyStepStateType } from '@/view/sku-bundle-v2/components/interface';
import { GetBundleLogsData } from '@/api/v2/sku-bundle';
import _ from 'lodash';
import fmt from '@/const/fmt';

const verifyStepState: VerifyStepStateType[] = [
  {
    title: '创建商品组',
    user: '',
    date: ''
  },
  {
    title: '送审商品组',
    user: '',
    date: ''
  },
  {
    title: '运营一次初审',
    user: '',
    date: ''
  },
  {
    title: '运营二次初审',
    user: '',
    date: ''
  },
  {
    title: '运营总监复审',
    user: '',
    date: ''
  },
  {
    title: '完成',
    user: '',
    date: ''
  }
];

const verifyMap: any = {
  ACCEPTED: 'finish',
  REJECTED: 'error'
};

@Component({})
export default class VerifyMixin extends Vue {
  isOldVersion(data: any): boolean {
    return !data.audited_status;
  }

  isAutoTraining(logs: any[]) {
    return (
      logs &&
      logs.length > 1 &&
      logs[logs.length - 2].to_info.status === 'PENDING' &&
      this.isAcceptedStatus(logs[logs.length - 1].to_info.status)
    );
  }

  isAcceptedStatus(status: string) {
    return ['TRAINING', 'ACCEPTED', 'DEPLOYING'].indexOf(status) > -1;
  }

  getInitState(logs: GetBundleLogsData[]): GetBundleLogsData | undefined {
    return logs.find(
      (e: any) => _.isEmpty(e.from_info) && e.to_info.status === 'PENDING'
    );
  }

  getReviewState(logs: GetBundleLogsData[]): GetBundleLogsData | undefined {
    return logs.find(
      (e: any) =>
        (e.from_info.status === 'PENDING' &&
          e.to_info.status === 'REVIEWING') ||
        (e.from_info.audited_status &&
          e.from_info.audited_status.indexOf('REJECTED') > -1 &&
          e.to_info.status === 'REVIEWING')
    );
  }

  getReviewFirstState(
    logs: GetBundleLogsData[]
  ): GetBundleLogsData | undefined {
    return logs.find(
      (e: any) =>
        e.to_info.audited_status &&
        e.from_info.audited_status === undefined &&
        e.to_info.audited_status.indexOf('FIRST') > -1
    );
  }

  getReviewSecondState(
    logs: GetBundleLogsData[]
  ): GetBundleLogsData | undefined {
    return logs.find(
      (e: any) =>
        e.from_info.audited_status &&
        e.from_info.audited_status.indexOf('FIRST') > -1 &&
        e.to_info.audited_status &&
        e.to_info.audited_status.indexOf('SECOND') > -1
    );
  }

  getReviewThirdState(
    logs: GetBundleLogsData[]
  ): GetBundleLogsData | undefined {
    return logs.find(
      (e: any) =>
        e.from_info.audited_status &&
        e.from_info.audited_status.indexOf('SECOND') > -1 &&
        e.to_info.audited_status &&
        e.to_info.audited_status.indexOf('THIRD') > -1
    );
  }

  setReviewStepLog(
    initState: GetBundleLogsData | undefined,
    reviewState: GetBundleLogsData | undefined,
    reviewFirstState: GetBundleLogsData | undefined,
    reviewSecondState: GetBundleLogsData | undefined,
    reviewThirdState: GetBundleLogsData | undefined,
    stepIndex?: number
  ): VerifyStepStateType[] {
    const verifyState = [...verifyStepState];
    verifyState[0].user = initState && initState.operator_name;
    verifyState[0].date =
      initState && initState.created_at && fmt.formatDate(initState.created_at);
    verifyState[1].user = reviewState && reviewState.operator_name;
    verifyState[1].date =
      reviewState &&
      reviewState.created_at &&
      fmt.formatDate(reviewState.created_at);
    verifyState[2].user = reviewFirstState && reviewFirstState.operator_name;
    verifyState[2].date =
      reviewFirstState &&
      reviewFirstState.created_at &&
      fmt.formatDate(reviewFirstState.created_at);
    verifyState[3].user = reviewSecondState && reviewSecondState.operator_name;
    verifyState[3].date =
      reviewSecondState &&
      reviewSecondState.created_at &&
      fmt.formatDate(reviewSecondState.created_at);
    verifyState[4].user = reviewThirdState && reviewThirdState.operator_name;
    verifyState[4].date =
      reviewThirdState &&
      reviewThirdState.created_at &&
      fmt.formatDate(reviewThirdState.created_at);
    if (stepIndex) {
      verifyState.forEach((e, index) => {
        if (index >= stepIndex) {
          verifyState[index].user = '';
          verifyState[index].date = '';
        }
      });
    }
    return verifyState;
  }

  getProcessStatus(reviewState: any): 'finish' | 'error' {
    const map = { ...verifyMap };
    return map[reviewState.to_info.audited_status.split('_')[0]];
  }

  setAutoTraining(logs: any[]) {
    const verifyStepState = [
      {
        title: '创建商品组',
        user: logs[1].operator_name,
        date: fmt.formatDate(logs[1].created_at)
      },
      {
        title: '自动审核',
        user: '',
        date: ''
      },
      {
        title: '完成',
        user: '',
        date: ''
      }
    ];
    const verifyStepIndex = 2;
    const verifyStepStatus = 'success';

    return {
      verifyStepState,
      verifyStepIndex,
      verifyStepStatus
    };
  }
}
