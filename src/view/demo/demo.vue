<template lang="pug">
  #demo
    input#file(type="file" v-on:change="handleFileChange")
    #wrapper
      img#img(:src="src")
      div#tag(v-for="(tag, index) in tags" :key="index" :style="{width: tag.box[2]*100+'%', height: tag.box[3]*100+'%', left: tag.box[0]*100+'%', top: tag.box[1]*100+'%'}")
        div.id {{index+1}}
    #tag-list
      Tag(style="margin-top:20px" v-for="(tag, index) in tags" :key="index") {{`${index+1} ${tag.type}`}}
</template>


<script lang="ts">
import Vue from 'vue';
import _ from 'lodash';
import Component from 'vue-class-component';
import http from 'axios';


@Component({})
export default class Demo extends Vue {
  src = '';
  tags = [];

  handleClick() {
  }

  handleFileChange(e: any) {
    const _this = this;
    const reads = new FileReader();

    const f = (document.getElementById('file') as any).files[0];

    reads.readAsDataURL(f);

    reads.onload = function (e: any) {
      _this.src = this.result as any;
    };

    const fd = new FormData();

    fd.append('search', f, f.name);

    http.request({
      url: process.env.url,
      method: 'get',
      data: fd,
      headers: {'Content-Type': 'multipart/form-data'}
    }).then((res: any) => {
      this.tags = res.data.boxes_detected
    });
  }

}
</script>

<style lang="scss">
#file {
  margin-bottom: 20px;
}

#wrapper {
  position: relative;
  width: 600px;
  height: 600px;
}

#img {
  border: 1px solid #2b85e4;
  width: 600px;
  height: 600px;
}

#tag {
  position: absolute;
  border: 1px solid white;
  z-index: 100;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #ffffff;
  font-size: 18px;
}
</style>
