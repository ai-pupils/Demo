import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

@Component({})
export default class SideMenuItemMixin extends Vue {
  @Prop({ type: Object, default: () => {} })
  parentItem!: any;
  @Prop({ type: String })
  theme!: string;
  @Prop({ type: Number })
  iconSize!: number;

  get parentName(this: any): any {
    return this.parentItem.name;
  }

  get children(this: any): any {
    return this.parentItem.children;
  }

  get textColor(this: any): any {
    return this.theme === 'dark' ? '#fff' : '#495060';
  }
}
