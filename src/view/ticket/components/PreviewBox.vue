<template lang="pug">
  .preview-box
    div
      ul(class="ivu-upload-list")
        li(class="ivu-upload-list-file ivu-upload-list-file-finish")
          i(v-if="showClose", class="ivu-icon ivu-icon-ios-close ivu-upload-list-remove",
            @click="handleRemove")
          div(v-if="!isImage(attachment)")
            a.center(:href="`/v2/work-orders/attachments/${attachment.content}`", :download="attachment.source_name")
              svg-icon.ml10.icon-style(:icon-class="filterExt(attachment.content)")
              span.ml5 {{ attachment.source_name || attachment.content }}
          div(v-else)
            a.center(:href="`/v2/work-orders/attachments/${attachment.content}`", target="_blank")
              img.ml10.icon-style(:src="'/v2/work-orders/attachments/' + attachment.content")
              span.ml5 {{ attachment.source_name || attachment.content }}
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { getFileExt } from '@/mixins/helper';
import { Prop } from 'vue-property-decorator';

@Component({
  components: {}
})
export default class PreviewBox extends Vue {
  @Prop() attachment!: any;
  @Prop() download!: any;
  @Prop({type: Boolean, default: false}) showClose!: any;

  filterExt(name: string) {
    if (name) {
      const ext = getFileExt(name);
      if (['.txt', '.doc'].indexOf(ext) > -1) return 'icon-text-file';
      if (['.xls', '.xlsx'].indexOf(ext) > -1) return 'icon-xls-file';
      if (['.rar', '.zip', '.7z'].indexOf(ext) > -1) return 'icon-rar-file';
    }
    return 'icon-rar-file';
  }

  isImage(file: any): boolean {
    if (!file.content) return false;
    return '.jpg|.jpeg|.png'.indexOf(getFileExt(file.content)) > -1;
  }

  handleRemove(att: any) {
    this.$emit('handleRemove', att);
  }
}
</script>

<style scoped>
.icon-style {
  width: 2em;
  height: 2em;
}
.center {
  display: flex;
  position: relative;
  align-items: center;
  display: -webkit-flex;
}
.preview {
  width: 100%;
  height: 100%;
}

.ivu-icon-ios-close::before {
  content: '\F178';
}
</style>
