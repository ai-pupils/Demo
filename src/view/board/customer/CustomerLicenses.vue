<template>
  <Modal v-model="visible" :width="1300">
    <header slot="header">
      <h3>客户使用详情</h3>
    </header>
    <Table :border="true" :data="customerDetailData">
      <Column prop="id" align="center" label="ID":width="100"></Column>
      <Column prop="agent_id" align="center" label="代理ID" :width="100"></Column>
      <Column prop="user_id" align="center" label="商户ID" :width="100"></Column>
      <Column align="center" label="货柜数量">
        <Column prop="total_cabinet_count" align="center" label="总量"></Column>
        <Column prop="used_cabinet_count" align="center" label="已使用"></Column>
        <Column align="center" label="未使用">
          <template slot-scope="scope">
            {{scope.row.total_cabinet_count - scope.row.used_cabinet_count}}
          </template>
        </Column>
      </Column>
      <Column prop="create_time" align="center" label="创建时间" :width="190"></Column>
      <Column prop="expire_date" align="center" label="过期时间" :width="190"></Column>
      <Column prop="update_time" align="center" label="更新时间" :width="190"></Column>

      <template slot="empty">
        <StatusBox :isFetching="isFetching" :isEmpty="isEmpty" :error="error"></StatusBox>
      </template>
    </Table>

    <div slot="footer"></div>
  </Modal>
</template>

<script>
import _ from 'lodash';
import { mapState, mapActions } from 'vuex';
import stateParseMixin from '../../../mixins/commonStateParseMixin';
import StatusBox from '../../../components/shared/StatusBox';

export default {
  mixins: [stateParseMixin],
  components: { StatusBox },
  data() {
    return {
      visible: false
    };
  },
  computed: {
    ...mapState('customer', { state: 'customerLicenses' }),
    customerDetailData() {
      if (this.isFulfill) {
        return this.state.payload.data.results;
      }
      return undefined;
    },
    isEmpty() {
      const { customerDetailData } = this;
      return !_.isArray(customerDetailData) || customerDetailData.length <= 0;
    }
  },
  methods: {
    ...mapActions('customer', ['getCustomerLicenses']),
    load(target) {
      this.visible = true;
      this.getCustomerLicenses({
        customerId: target['user_id'],
        customerType: target['user_type']
      });
    }
  }
};
</script>

<style scoped>
</style>
