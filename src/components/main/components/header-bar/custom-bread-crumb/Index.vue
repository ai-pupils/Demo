<template lang="pug">
  .custom-bread-crumb
    Breadcrumb(:style='{fontSize: `${fontSize}px`}')
      BreadcrumbItem(v-for='item in list', :to='item.to', :key='`bread-crumb-${item.name}`')
        common-icon(style='margin-right: 4px;', :type="item.icon || ''")
        | {{ showTitle(item) }}
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { showTitle } from '@/libs/util';
import CommonIcon from '@/components/common-icon/Index.vue';

@Component({
  components: {
    CommonIcon
  }
})
export default class customBreadCrumb extends Vue {
  @Prop({ type: Array, default: () => [] })
  list!: any[];
  @Prop({ type: Number, default: 14 })
  fontSize!: number;
  @Prop({ type: Boolean, default: false })
  showIcon!: boolean;

  showTitle(item: any): any {
    return showTitle(item, this);
  }

  isCustomIcon(iconName: any): any {
    return iconName.indexOf('_') === 0;
  }

  getCustomIconName(iconName: any): any {
    return iconName.slice(1);
  }
}
</script>

<style lang="less">
.custom-bread-crumb {
  display: inline-block;
  vertical-align: top;
}
</style>
