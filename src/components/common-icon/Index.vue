<template lang="pug">
  component(:is='iconType', :type='iconName', :color='iconColor', :size='iconSize')
</template>

<script lang="ts">
import Vue from 'vue';
import Icons from '@/components/icons/Index.vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

@Component({
  components: { Icons }
})
export default class CommonIcon extends Vue {
  @Prop({ type: String, required: true })
  type!: string;
  @Prop({ type: String })
  color!: string;
  @Prop({ type: Number })
  size!: Number;

  get iconType() {
    return this.type.indexOf('_') === 0 ? 'Icons' : 'Icon';
  }

  get iconName() {
    return this.iconType === 'Icons'
      ? this.getCustomIconName(this.type)
      : this.type;
  }

  get iconSize() {
    return this.size || (this.iconType === 'Icons' ? 12 : undefined);
  }

  get iconColor() {
    return this.color || '';
  }

  getCustomIconName(iconName: any) {
    return iconName.slice(1);
  }
}
</script>

<style>
</style>
