import _ from 'lodash';

export default {
  computed: {
    data() {
      if (this.isFulfill) {
        return this.state.payload.data;
      }
      return null;
    },
    isEmpty() {
      const {data} = this;
      return _.isNil(data);
    }
  }
};
