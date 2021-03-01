<template lang="pug">
  section
    GoBack
    Card.mb20
      .flex-box
        span.bold 处理工单
        Button(v-if="isHandler && !isFinished", type="primary", @click="submitHandle") 结单
    Card.mb20
      TicketInfo(v-if="!isFetching", :state="state")
    Card(title="沟通记录")
      TicketLogs(v-if="!isFetching", :state="state", @refresh="refresh", :isFinished="isFinished", :isHandler="isHandler")
</template>

<script lang="ts">
import Component, { mixins } from 'vue-class-component';
import LoadPageMixin, { LoadPageMixinInstance } from '@/mixins/loadPage';
import { Prop, Watch } from 'vue-property-decorator';
import { DataResponse, DefaultApiType, MetaType } from '@/interface';
import {
  getTicket$,
  GetTicketsData,
  GetTicketsParams,
  putTicket$
} from '@/api/ticket';
import Form from '@/view/sku/Form.vue';
import TicketInfo from '@/view/ticket/components/TicketInfo.vue';
import TicketLogs from '@/view/ticket/components/TicketLogs.vue';
import GoBack from '@/components/shared/GoBack.vue';
import { TicketStatus } from '@/const/data/ticket';
import { State } from 'vuex-class';

@Component({
  components: { GoBack, TicketInfo, TicketLogs }
})
export default class TicketDetail extends mixins(LoadPageMixin)
  implements LoadPageMixinInstance {
  @Prop() id!: any;
  @State(state => state.profile.isFulfill) isFulfill!: boolean;
  @State(state => {
    const { profile } = state;
    if (profile.isFulfill) {
      return profile.payload.data;
    }
    return {};
  })
  user!: any;
  defaultApi: DefaultApiType = getTicket$;
  defaultParams: GetTicketsParams = {
    id: this.id
  };
  isFinished = false;
  isHandler = false;

  transformParams(params: GetTicketsParams) {
    return params;
  }

  @Watch('state', { immediate: true })
  stateChanged(state: MetaType<DataResponse<GetTicketsData>>) {
    if (state.isFulfill) {
      const data = state.payload!.data as any;
      if (data) {
        this.isFinished = data.status === TicketStatus.DONE;
        if (data.handler_name) {
          this.isHandler = data.handler_name === this.user.account;
        } else {
          this.isHandler = true;
        }
      }
    }
  }

  refresh() {
    this.loadDefaultApi();
  }

  submitHandle() {
    this.$Modal.confirm({
      title: `是否确认结单？`,
      onOk: () => {
        this.submit();
      },
      onCancel: () => {
        this.$Modal.remove();
      }
    });
  }
  submit() {
    const id = this.state.payload!.data.id;
    putTicket$({ id: id }).subscribe(state => {
      if (!state.isError) {
        this.$Message.success('结单成功');
        this.$router.replace({ name: 'ticket-list' });
      } else {
        this.$Message.error(`结单失败 ${state.error.message || ''}`);
      }
    });
  }
}
</script>

<style scoped>
.flex-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}
</style>
