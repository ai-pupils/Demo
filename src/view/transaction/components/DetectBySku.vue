<template lang="pug">
  div(style='min-height:180px')
    section.preview
      .preview-bd
        template(v-if='hasOrigin')
          a.origin-link(:href='origin', target='_blank')
            i.fa.fa-picture-o(aria-hidden='true')
            | 抗畸变前原图
        .preview-image
          .preview-image-placeholder
            LazyloadImg(:src='target | ossResize(280 * 2)')
            template(v-if='!isEmpty')
              ul.preview-object
                template(v-for='(item,index) in result')
                  li.preview-object-item(:class="{'active':hovering && hoverIndex===index,'hide':hovering && hoverIndex!==index}", :style='item.box', @mouseout='overOutBlock', @mouseover='overInBlock(index)')
                    .preview-object-index
                      span {{ index + 1 }}
      footer.preview-result
        ul.object-desc
          template(v-for='(item,index) in result')
            li.object-desc-item(:class="{'deactive':hovering && hoverIndex!==index}", @mouseout='overOutBlock', @mouseover='overInBlock(index)')
              h6.object-desc-title {{index + 1}}: {{ item.type }}
              div
                label 置信度:
                span {{item.score | toFixed(4) }}
        p.preview-result-note *什么是置信度：置信度为本服务对所输出标签内容正确性的确信程度，对于输出标签，置信度越高，表明服务对这个标签正确性的确信程度越高，最大值为1。

</template>

<script lang="ts">
import _ from 'lodash';
import LazyloadImg from '@/components/shared/LazyloadImg.vue';
import Component, { mixins } from 'vue-class-component';
import ComponentOptionsMixin from '@/mixins/componentOptions';
import { Prop } from 'vue-property-decorator';

@Component({
  components: { LazyloadImg }
})
export default class DetectBySku extends mixins(ComponentOptionsMixin) {
  @Prop({ type: String })
  origin!: any;
  @Prop({ type: String })
  target!: any;
  @Prop({ type: Object })
  report!: any;
  @Prop({ type: Boolean, default: false })
  isLoading!: boolean;

  hoverIndex: number = -1;

  get isReady(): boolean {
    return !this.isEmpty && !this.isLoading;
  }

  get result(): any {
    const { report } = this;
    if (_.isNil(report)) {
      return undefined;
    }
    const data = report.boxes_detected;

    return data.map(({ score, box, type }: any) => ({
      score,
      type,
      box: {
        left: `${box[0] * 100}%`,
        top: `${box[1] * 100}%`,
        width: `${box[2] * 100}%`,
        height: `${box[3] * 100}%`
      }
    }));
  }

  get isEmpty(): boolean {
    const { report } = this;

    if (_.isNil(report) || report.boxes_detected.length === 0) {
      return true;
    }

    const { result } = this;
    return !_.isArray(result) || result.length <= 0;
  }

  get hovering(): boolean {
    const { hoverIndex } = this;
    return hoverIndex >= 0 && hoverIndex < this.result.length;
  }
  get hasOrigin(): boolean {
    return !_.isNil(this.origin);
  }

  overInBlock(index: number) {
    this.hoverIndex = index;
  }

  overOutBlock() {
    this.hoverIndex = -1;
  }
}
</script>

<style type="text/less" lang="less" scoped>
.preview {
  &-bd {
    background: white;
    position: relative;
    padding-top: 40px;
    border-radius: 5px;
    border-bottom: 1px solid #ccc;
  }

  &-object {
    &-item {
      position: absolute;
      z-index: 9;
      border: 1px solid #0653f7;
      background: rgba(6, 83, 247, 0.1);
      padding-left: 3px;
      cursor: pointer;
      &.active {
        background: rgba(0, 0, 0, 0);
        box-shadow: 0px 0px 11px #000;
        border-color: #fff;
      }
    }
    &-index {
      @w: 26px;
      position: absolute;
      z-index: 3;
      bottom: 100%;
      left: 50%;
      margin-left: -@w / 2;
      span {
        height: @w;
        width: @w;
        line-height: @w - 4px;
        background: #0653f7;
        text-align: center;
        border-radius: 1000px;
        color: #fff;
        display: inline-block;
        border: 2px solid #fff;
        box-shadow: 0px 0px 3px #0e0e0e;
        position: relative;
        z-index: 9;
      }
      &:after {
        content: '';
        z-index: 2;
        position: absolute;
        display: block;
        width: 16px;
        height: 16px;
        background: #fff;
        transform: rotate(45deg);
        top: 10px;
        left: 50%;
        margin-left: -16px /2;
      }
    }
  }
}

.object-desc {
  &-title {
    font-size: 14px;
    color: #0653f7;
    font-weight: 500;
    margin: 0 0 8px;
  }
  &-item {
    display: inline-block;
    border: solid 1px #0653f7;
    padding: 8px 12px;
    border-radius: 2px;
    color: #7b7b7b;
    font-size: 12px;
    margin-bottom: 10px;
    margin-right: 16px;
    cursor: pointer;
    line-height: 1.4;
    &.deactive {
      border: 1px solid #bdbbbb;
      background: none;
    }
  }

  label {
    line-height: inherit;
    margin: 0;
    font-weight: normal;
  }
}

ul,
li {
  list-style: none;
}

.origin-link {
  position: absolute;
  right: 13px;
}
</style>
