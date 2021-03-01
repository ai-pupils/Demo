<template lang="pug">
  .full-screen-btn-con(v-if='showFullScreenBtn')
    tooltip(:content="value ? '退出全屏' : '全屏'", placement='bottom')
      icon(@click.native='handleChange', :type="value ? 'md-contract' : 'md-expand'", :size='23')
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

@Component({})
export default class Fullscreen extends Vue {
  @Prop({ type: Boolean })
  value!: boolean;

  get showFullScreenBtn() {
    return window.navigator.userAgent.indexOf('MSIE') < 0;
  }

  handleFullscreen() {
    let main: any = document.body;
    let doc: any = document;

    if (this.value) {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (doc.mozCancelFullScreen) {
        doc.mozCancelFullScreen();
      } else if (doc.webkitCancelFullScreen) {
        doc.webkitCancelFullScreen();
      } else if (doc.msExitFullscreen) {
        doc.msExitFullscreen();
      }
    } else {
      if (main.requestFullscreen) {
        main.requestFullscreen();
      } else if (main.mozRequestFullScreen) {
        main.mozRequestFullScreen();
      } else if (main.webkitRequestFullScreen) {
        main.webkitRequestFullScreen();
      } else if (main.msRequestFullscreen) {
        main.msRequestFullscreen();
      }
    }
  }

  handleChange() {
    this.handleFullscreen();
  }

  mounted() {
    let doc: any = document;
    let isFullscreen =
      doc.fullscreenElement ||
      doc.mozFullScreenElement ||
      doc.webkitFullscreenElement ||
      doc.fullScreen ||
      doc.mozFullScreen ||
      doc.webkitIsFullScreen;
    isFullscreen = !!isFullscreen;
    document.addEventListener('fullscreenchange', () => {
      this.$emit('input', !this.value);
      this.$emit('on-change', !this.value);
    });
    document.addEventListener('mozfullscreenchange', () => {
      this.$emit('input', !this.value);
      this.$emit('on-change', !this.value);
    });
    document.addEventListener('webkitfullscreenchange', () => {
      this.$emit('input', !this.value);
      this.$emit('on-change', !this.value);
    });
    document.addEventListener('msfullscreenchange', () => {
      this.$emit('input', !this.value);
      this.$emit('on-change', !this.value);
    });
    this.$emit('input', isFullscreen);
  }
}
</script>

<style lang="less">
.full-screen-btn-con .ivu-tooltip-rel {
  height: 50px;
  line-height: 50px;
  i {
    cursor: pointer;
  }
}
</style>
