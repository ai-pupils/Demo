import _ from 'lodash';
import Component, { mixins } from 'vue-class-component';
import ComponentOptionsMixin from '@/mixins/componentOptions';

@Component({})
export default class TransactionDetailsParseMixin extends mixins<
  ComponentOptionsMixin<any>
>(ComponentOptionsMixin) {
  get detailInfo() {
    if (this.isFulfill) {
      return this.state.payload.data;
    }
    return null;
  }
  get isEmpty(this: any) {
    const { detailInfo } = this;
    return _.isNil(detailInfo);
  }
}
