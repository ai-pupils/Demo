<template>
  <div class="task">
    <template v-if="taskInfo.length">
      <ul class="task-preview">
        <li v-for="(info, index) in taskInfo" :key="info.id" class="task-preview-item"
          :class="[getJobsStatus(info.status).tagColor, computedClass(index)]"
          @click="choosePhoto(index)">
          <img :src="info.image_url" alt="preview image" width="100">
        </li>
      </ul>
      <div class="task-image-container">
        <div class="task-item pr" v-if="currentImgInfo">
          <LazyloadImg class="task-image" :src="currentImgInfo.image_url | ossResize(640)"></LazyloadImg>
          <template v-if="detectedInfo">
            <BoxOutline class="detected-boxes" :boxes="detectedInfo | getBoxData"></BoxOutline>
            <div class="detected-operations">
              <p>请判断图上的框位置是否完全正确？</p>
              <ButtonGroup class="detected-operations-wrapper">
                <Button class="detected-operations-btn" type="primary" @click="reviewDetectedBox(true)">正确</Button>
                <Button class="detected-operations-btn" type="error" @click="reviewDetectedBox(false)">错误</Button>
              </ButtonGroup>
            </div>
          </template>
          <template v-else>
            <div class="task-image-info">
              <Tag :color="getJobsStatus(currentImgInfo.status).tagColor" class="task-status" size="large">
                {{getJobsStatus(currentImgInfo.status).label}}
              </Tag>
              <p>图片ID: {{currentImgInfo.id}}</p>
              <p>拍摄时间：{{currentImgInfo.created_at | fmtLocalTime}}</p>
              <p v-if="currentImgInfo.reviewed_comment">备注：{{currentImgInfo.reviewed_comment}}</p>
              <p v-if="currentImgInfo.reviewer">审核者：{{currentImgInfo.reviewer}}</p>
            </div>
            <div class="task-operations" v-if="!disabled">
              <Poptip title="确定要通过该图片吗？" width="200" placement="top-end"
                content="content" confirm @on-ok="startReview(reviewAccept)">
                <Button type="primary">通过</Button>
              </Poptip>
              <Poptip title="拒绝该图片" content="content" width="300" placement="top-end" ref="reject">
                <Button type="error">淘汰</Button>
                <div slot="content">
                  <div class="flex">
                    备注：<Input v-model="remark" placeholder="请说明不通过的原因" width="200"></Input>
                    <Button class="task-operations-rejected" type="error" @click="startReview(reviewReject)">确定</Button>
                  </div>
                </div>
              </Poptip>
            </div>
          </template>
          <a :href="currentImgInfo.image_url" class="btn btn-share" target="_blank"><i class="fa fa-external-link"></i></a>
        </div>
      </div>
    </template>
    <p v-else class="task-empty-tips">没有审核图片</p>
  </div>
</template>

<script>
import { Carousel, CarouselItem, RadioGroup, RadioButton } from 'element-ui';
import LazyloadImg from '../../../components/shared/LazyloadImg';
import { jobStatus, REVIEW_ACTION_STATUS_ACCEPT, REVIEW_ACTION_STATUS_REJECT } from '../../../const/data/skuIngression';
import _ from 'lodash';
import BoxOutline from '@/components/shared/BoxOutline.vue'

export default {
  components: { Carousel, CarouselItem, RadioGroup, RadioButton, LazyloadImg, BoxOutline },
  data() {
    return {
      tasks: {},
      remark: ''
    };
  },
  filters: {
    getBoxData(info) {
      return info.boxes_detected.map(item => {
        const [left, top, width, height] = item.box;
        return {left, top, width, height}
      })
    }
  },
  computed: {
    currentImgInfo() {
      return this.taskInfo[this.currentIndex];
    },
    reviewAccept() {
      return REVIEW_ACTION_STATUS_ACCEPT;
    },
    reviewReject() {
      return REVIEW_ACTION_STATUS_REJECT;
    }
  },
  props: {
    taskInfo: { type: Array, required: true, default: [] },
    currentIndex: {type: Number, required: false, defalut: 0},
    disabled: {type: Boolean, required: false, default: false},
    detectedInfo: {required: true}
  },
  methods: {
    computedClass(i) {
      return i === this.currentIndex ? 'task-preview-item-selected' : '';
    },
    getJobsStatus(value) {
      return jobStatus.filter(item => item.value === value)[0];
    },
    choosePhoto(index) {
      this.$emit('choosePhoto', index);
    },
    startReview(status) {
      const {currentIndex, remark, reviewStatus} = this;
      const {id, image_url} = this.currentImgInfo;
      this.$emit('review', {status, id, remark, url: image_url, index: currentIndex});
      this.$refs.reject.cancel()
    },
    reviewDetectedBox(val) {
      this.$emit('reviewBox', val)
    }
  }
};
</script>

<style type="text/less" lang="less" scoped>
@import (less) '../../../css/vars.less';

.btn {
  &-share {
    @r: 18px;
    position: absolute;
    top: 8px;
    right: 6px;
    font-size: 12px;
    color: @color-content;
    background: rgba(255, 255, 255, 0.6);
    width: @r;
    line-height: @r;
    height: @r;
    border-radius: 100%;
    text-align: center;
  }
}
.task {
  &-empty-tips {
    text-align: center;
    padding-top: 320px;
  }
  &-preview {
    list-style: none;
    padding: 4px;
    margin: 0 20px 5px 0;
    &-item {
      position: relative;
      display: inline-block;
      border: 4px solid transparent;
      margin-bottom: 4px;
      font-size: 0;
      opacity: 0.8;
      cursor: pointer;
      &:after {
        width: 100%;
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;
        font-size: 35px;
        font-weight: bold;
        text-align: center;
        background: rgba(0,0,0, 0.7);
      }
      &-selected {
        border-color: @color-primary;
      }
      &.red {
        &:after {
          content: '×';
          color: @color-error;
        }
      }
      &.green {
        &:after {
          content: '√';
          color: @color-success;
        }
      }
    }
  }
  &-item{
    margin-bottom: 5px;
  }
  &-image {
    &-container {
      position: relative;
      overflow-y: auto;
    }
    &-info {
      position: absolute;
      bottom: 5px;
      left: 5px;
      color: #fff;
      font-size: 13px;
      z-index: 2;
    }
  }
  &-status {
    font-size: 14px;
    padding: 4px 10px;
    height: 30px;
  }
  &-operations {
    position: absolute;
    bottom: 5px;
    right: 5px;
    z-index: 2;
    &-rejected {
      margin-left: 5px;
    }
  }
}
.flex {
  .MX-flex-vertical();
  justify-content: space-around;
}
.detected {
  &-boxes {
    z-index: 1;
  }
  &-operations {
    position: absolute;
    right: 5px;
    bottom: 5px;
    z-index: 2;
    color: #fff;
    &-wrapper {
      width: 100%;
    }
    &-btn {
      width: 50%;
    }
  }
}
</style>
