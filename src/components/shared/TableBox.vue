<template>
  <div style="position:relative">
    <Spin v-if="state.isFetching" :fix="true" size="large"></Spin>
    <Table
      ref="table"
      :data="data"
      :border="true"
      :fit="true"
      @selection-change="handleSelectionChange"
      @select="select"
      @select-all="selectAll"
      @sort-change="resort"
      @cell-dblclick="cellDBClick"
      :default-sort="sortParams"
      :row-key="rowKey"
    >
      <slot></slot>
      <template slot="empty">
        <StatusBox
          :isFetching="state.isFetching"
          :error="state.error"
          :isEmpty="data && data.length === 0"
        ></StatusBox>
      </template>
    </Table>
  </div>
</template>

<script>
import StatusBox from '@/components/shared/StatusBox';
import stateParseMixin from '@/mixins/commonStateParseMixin';
import { getRouteQuery } from '@/utils/observables';

export default {
  props: {
    state: Object,
    defaultSort: Object,
    dataKey: String,
    rowKey: { type: String, default: 'id' }
  },
  mixins: [stateParseMixin],
  components: { StatusBox },
  data() {
    return {
      init: 0,
      sortParams: {},
      multipleSelection: []
    };
  },
  created() {
    const { sortBy, sortDirection } = getRouteQuery(this);
    if (sortBy && sortDirection) {
      this.sortParams.prop = sortBy;
      this.sortParams.order =
        sortDirection === 'down' ? 'descending' : 'ascending';
    } else {
      this.sortParams = this.defaultSort;
    }
  },
  mounted() {
    setTimeout(() => {
      this.init++;
    });
  },
  methods: {
    resort({ order, prop }) {
      if (this.init === 0) return;
      this.$emit('sortChange', {
        sortBy: prop,
        sortDirection: order === 'descending' ? 'down' : 'up'
      });
    },
    select(val, row) {
      this.$emit('select', val, row);
    },
    selectAll(val) {
      this.$emit('select-all', val);
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      this.$emit('selection-change', val);
    },
    clearSort() {
      this.$refs['table'].clearSort();
    },
    cellDBClick(row, column, cell, event) {
      this.$emit('cell-dblclick', { row, column, cell, event });
    }
  },
  computed: {
    data() {
      if (this.state.isFulfill) {
        if (this.dataKey) {
          return this.state.payload.data[this.dataKey];
        }
        return this.state.payload.data.results;
      }
      return [];
    }
  }
};
</script>
