<template>
  <Popover trigger="hover" placement="right">
    <span slot="reference">{{moduleData.bundle_id}}</span>
    <h3>历史模型列表</h3>
    <Table :data="moduleHistoryList" :border="true" width="300">
      <Column prop="module_id" align="center" label="ModuleID" :width="150"></Column>
      <Column prop="attach_time" align="center" label="Attach时间" :width="200">
        <template slot-scope="scope">
          {{ scope.row.attach_time | getFormatTime }}
        </template>
      </Column>
    </Table>
  </Popover>
</template>

<script type="text/ecmascript-6">
import moment from 'moment';
import { Popover } from 'element-ui';

export default {
  components: { Popover },
  props: {
    moduleData: {
      type: Object,
      require: true
    }
  },
  filters: {
    getFormatTime(val) {
      return moment.unix(val).format('YYYY-MM-DD HH:mm:ss');
    }
  },
  computed: {
    moduleHistoryList() {
      return this.moduleData.bundle_history_list;
    }
  }
};
</script>
