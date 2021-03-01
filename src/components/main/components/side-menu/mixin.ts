import Vue from 'vue';
import Component from 'vue-class-component';
import { showTitle } from '@/libs/util';
import CommonIcon from '@/components/common-icon/Index.vue';

@Component({
  components: { CommonIcon }
})
export default class SideMenuMixin extends Vue {
  showTitle(item: any) {
    return showTitle(item, this);
  }

  showChildren(item: any) {
    return (
      item.children &&
      (item.children.length > 1 || (item.meta && item.meta.showAlways))
    );
  }

  getNameOrHref(item: any, children0: any) {
    return item.href
      ? `isTurnByHref_${item.href}`
      : children0
        ? item.children[0].name
        : item.name;
  }
}
