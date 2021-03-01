<template>
  <Modal :value="visible" :width="1300" @on-cancel="exit">
    <header slot="header">
      <h3>上新任务审核</h3>
    </header>
    <div class="demo-split">
      <div class="demo-split-pane demo-split-pane-info info" v-if="instruction">
        <h3 class="demo-split-title">图片位样例图</h3>
        <div v-if="instruction.image_urls.length">
          <Carousel type="card" arrow="always" :autoplay="false" class="info-carousel" indicator-position="none">
            <CarouselItem v-for="item, index in instruction.image_urls"
                          :key="item"
                          name="item"
                          class="instruction-image">
              <LazyloadImg :src="item | ossResize(640)"></LazyloadImg>
              <a :href="item" class="btn btn-share" target="_blank"><i class="fa fa-external-link"></i></a>
            </CarouselItem>
          </Carousel>
        </div>
        <h3 class="demo-split-title">采集要点</h3>
        <Alert>
          <div class="desc-container">
            <pre slot="desc" class="instruction-hints" v-html="instruction.hints"></pre>
          </div>
        </Alert>
        <h3 class="demo-split-title">相关信息</h3>
        <Alert v-if="appearanceInfo" class="info-detail">
          <ul slot="desc" style="list-style-type:none; word-break: break-all; width: 100%;">
            <li v-if="instruction">所在层数：{{instruction.layer_index}}</li>
            <li>包装ID：{{appearanceInfo.id | emptyText}}</li>
            <li>包装名称：{{appearanceInfo.appearance_name | emptyText}}</li>
            <li>商品ID：{{appearanceInfo.sku_id}}</li>
            <li v-if="appearanceInfo.sku">商品名称：{{appearanceInfo.sku.sku_name}}</li>
            <li>视觉ID：{{jobInfo.vision_id}}</li>
            <li>支持柜体：{{appearanceInfo.cabinet_type_name}}</li>
            <li>图片位ID：{{jobInfo.instruction_id}}</li>
            <li class="img-box clearfix" v-if="appearanceInfo.sku">
              <span class="fl">样例图：{{appearanceInfo.sku.sku_url? '':'暂无'}}</span>
              <span class="sku-image fl">
                <a :href="appearanceInfo.sku.sku_url" target="_blank">
                  <LazyloadImg :src="appearanceInfo.sku.sku_url"></LazyloadImg>
                </a>
              </span>
            </li>
          </ul>
        </Alert>
      </div>
      <div class="demo-split-pane demo-split-pane-photo">
        <h3 class="demo-split-title">采集记录</h3>
        <Photos :currentIndex="currentImgIndex" :taskInfo="photos" :detectedInfo="reviewParams.detected_result"
                :disabled="disabled"
                @review="onReviewImage" @reviewBox="onReviewBox" @choosePhoto="setCurrentImgIndex"></Photos>
      </div>
    </div>
    <div slot="footer">
      <Tooltip content="快捷键↑" placement="top">
        <Button type="success" @click="next(-1)">查看上一项</Button>
      </Tooltip>
      <Tooltip content="快捷键esc" placement="top">
        <Button @click="exit">取消</Button>
      </Tooltip>
      <Tooltip content="快捷键↓" placement="top">
        <Button type="success" @click="next(1)">查看下一项</Button>
      </Tooltip>
    </div>
  </Modal>
</template>

<script>
import _ from 'lodash';
import Photos from './Photos';
import LazyloadImg from '../../../components/shared/LazyloadImg';
import { mapState } from 'vuex';
import {getSkuIngressionPhotos$, reviewIngressionPhoto$, getOneIngressionInstruction$} from '@/api/v2/skus';
import  {getSkuAppearances$, detectAnImage$} from '@/api/sku'
import {REVIEW_ACTION_STATUS_ACCEPT} from '@/const/data/skuIngression';

export default {
  components: { LazyloadImg, Photos },
  data() {
    return {
      currentImgIndex: 0,
      instruction: null,
      appearanceInfo: null,
      photos: [],
      reviewParams: {}
    };
  },
  props: {
    visible: {required: true, type: Boolean},
    jobInfo: {required: true},
    disabled: {required: false, default: false, type: Boolean},
    isLastOne: {required: false, type: Boolean, default: false}
  },
  computed: {
    ...mapState({
      account: state => {
        const {profile} = state;
        if (profile.isFulfill) {
          return profile.payload.data.account;
        }
        return null;
      }
    })
  },
  methods: {
    exit() {
      this.reviewParams = {}
      this.$emit('exit');
    },
    next(offset) {
      this.reviewParams = {}
      this.$emit('next', offset);
      this.setCurrentImgIndex(0)
    },
    setCurrentImgIndex(i) {
      this.currentImgIndex = i;
    },
    async getDetectBoxes(url) {
      const {appearanceInfo: {sku_id}, jobInfo: {vision_id}} = this;
        const detectParams = {
          skuId: sku_id,
          visionId: vision_id,
          skuImageUrl: url
        }
        const state = await detectAnImage$(detectParams).toPromise()
        if(!state.isError) {return state.payload.data}
        return null
    },
    async onReviewImage({status, url, id, remark, index}) {
      // 审核不通过，直接发给上新
      if(status !== REVIEW_ACTION_STATUS_ACCEPT) {
          this.reviewParams = {
            reviewed_status: status,
            photoId: id,
            reviewed_comment: remark,
            reviewer: this.account
          }
          return this.onReviewBox(true, index)
      }
      // 审核通过，要先判断是否是最后一张来警告用户，然后调用 detect 接口出框，让用户判断框是否正确
      const CheckAndDetectImg = new Promise(async (resolve, reject) => {
        const detectImg = async () => {
          const data = await this.getDetectBoxes(url)
          if (data) {
            resolve(data)
          } else {
            reject()
          }
        }
        if (this.isLastOne) {
          this.$Modal.confirm({
            title: '警告',
            content: '通过这张图片后，整个任务将全部通过，无法重新审核，是否确认通过？',
            onOk: detectImg
          });
        } else {
          detectImg()
        }
      })
      try {
        const detectInfo = await CheckAndDetectImg;
        this.reviewParams = {
          reviewed_status: status,
          photoId: id,
          reviewed_comment: remark,
          reviewer: this.account,
          detected_result: detectInfo
        }
      } catch (e) {
        this.$Message.error('模型出框失败，无法提交上新审核结果！');
      }
    },
    onReviewBox(isCorrect, index) {
      const params = {
        ...this.reviewParams,
        hybrid: !isCorrect
      };
      reviewIngressionPhoto$(params).subscribe((state) => {
        if(!state.isError) {
          this.$Message.success('操作成功!');
          this.$emit('reviewed', this.reviewParams)
          this.next(1)
        }
      })
    }
  },
  created() {
    document.onkeyup = e => {
      const key = e.key.toLowerCase();
      if (key === 'arrowup') {
        this.next(-1);
      } else if (key === 'arrowdown') {
        this.next(1);
      }
    };
  },
  watch: {
    jobInfo: {
      handler(v) {
        if (_.isObject(v)) {
          const {jobInfo: {instruction_id, appearance_id, id: jobId}} = this;
          if(jobId) {
            getSkuIngressionPhotos$({jobId}).subscribe((state) => {
              const {payload: {data: {data}}} = state;
              this.photos = data;
            });
          }
          if(instruction_id) {
            getOneIngressionInstruction$({id: instruction_id}).subscribe((state) => {
              const {payload: {data: {data}}} = state;
              this.instruction = data;
            })
          }
          if(appearance_id) {
            getSkuAppearances$({id: appearance_id}).subscribe((state) => {
              const {payload: {data}} = state;
              this.appearanceInfo = data;
            })
          }
        }
      }
    }
  }
};
</script>

<style type="text/less" lang="less" scoped>
@import (less) '../../../css/vars.less';

.demo-split {
  display: flex;
  height: 700px;
  &-title {
    margin: 5px 0;
  }
  &-pane {
    margin-right: 20px;
    height: 100%;
    overflow-y: auto;
    &-info {
      display: flex;
      flex-direction: column;
      flex-shrink: 0;
      width: 360px;
      max-height: 695px;
    }
    &-photo {
      display: flex;
      flex-direction: column;
      flex-grow: 1;
    }
  }
}

.btn {
  &-share {
    @r: 18px;
    position: absolute;
    top: 10px;
    right: 10px;
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
.instruction {
  &-image {
    width: 100%;
    position: relative;
  }
  &-hints {
    margin: 0;
    white-space: pre-line;
    font-size: 14px;
  }
}
.info {
  &-carousel {
    min-height: 100px;
  }
  &-detail {
    overflow: auto;
  }
}
.desc-container {
  overflow-x: auto;
}
</style>
