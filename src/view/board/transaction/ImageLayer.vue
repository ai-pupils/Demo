<template>
  <div class="gallery-wrapper">

    <template v-for="item in layerInfo">
      <ul class="gallery">
        <template v-for="image in [item.start_image, item.end_image]">
          <li class="gallery-item">
            <figure class="gallery-item-inner" @click="switchLayer(item.layer_index)">
              <div v-if="image">
                <LazyloadImg :src="image | ossResize(280)" class="gallery-img"></LazyloadImg>
              </div>
              <div class="empty-warning" v-else>
                <i class="fa fa-exclamation-triangle" aria-hidden="true" fa-3x></i>
                <span>URL为None</span>
              </div>
              <p class="txt-attribute"><span>Layer index: {{item.layer_index}}</span></p>
            </figure>
            <a :href="image" class="btn btn-share" target="_blank"><i class="fa fa-external-link"></i></a>
          </li>
        </template>
      </ul>
    </template>

    <template v-if="isEmpty">
      <Alert type="warning" show-icon slot="empty">
        <p>该交易暂无快照</p>
      </Alert>
    </template>

  </div>
</template>

<script type="text/ecmascript-6">
import { mapGetters } from 'vuex';
import stateParseMixin from '../../../mixins/commonStateParseMixin';
import transDetailsParseMixin from '../../../mixins/transactionDetailsParseMixin';
import LazyloadImg from '../../../components/shared/LazyloadImg';

export default {
  components: { LazyloadImg },
  mixins: [stateParseMixin, transDetailsParseMixin],
  computed: {
    ...mapGetters('transaction', { state: 'transactionDetails' }),
    layerInfo() {
      if (this.isEmpty) {
        return [];
      }
      return this.data.layer_info;
    }
  },
  methods: {
    switchLayer(layerIndex = '') {
      const {
        $route: { query }
      } = this;
      this.$router.replace({
        query: { ...query, layerIndex, currentTab: 'confirm' }
      });
    }
  }
};
</script>

<style type="text/less" lang="less" scoped>
@import (less) '../../../css/vars.less';

.toolbar {
  padding: 14px 24px;
}

.ivu-poptip {
  height: 80px;
}

.gallery {
  width: 100%;
  margin-top: 5px;
  display: flex;
  justify-content: space-between;
  vertical-align: top;
  list-style: none;
  &-item {
    position: relative;
    width: 50%;
    opacity: 0.8;
    cursor: pointer;
    padding: 2px 0;
    margin-left: 5px;
    box-sizing: border-box;
    transition: transform 0.2s linear;
    .btn-share {
      z-index: 9;
      opacity: 0;
    }
    &-inner {
      min-height: 80px;
      background: #fff;
      border: 1px solid #ddd;
      overflow: hidden;
      .MX-flex-vertical;
    }
    &:hover {
      opacity: 1;
      .btn-share {
        opacity: 1;
      }
    }
  }
  &-img {
    width: 100%;
  }
  & .empty-warning {
    font-size: 13px;
  }
}

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

.txt-attribute {
  text-align: center;
  color: #fff;
  position: absolute;
  bottom: 3%;
  left: 1%;
  width: 98%;
  height: 18px;
  z-index: 10;
  background: #000000;
  font: italic bold 14px/18px arial, sans-serif;
}
</style>
