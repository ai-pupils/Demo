<template lang="pug">
  section.preview
    .preview-bd
      .preview-image
        .preview-image-placeholder
          template(v-if='target')
            .image-placeholder.pr(ref='viewWarpper')
              span.total.pa 商品总数: {{total}}
              span.selected.pa(:style="{'top': auxLineY-24 +'px'}") 已选择: {{selectedLength}}
              span.aux-line.pa(:style='auxLineStyle')
              LazyloadImg.detect-image(:src='target | ossResize(280 * 2)')
            ul.preview-object
              template(v-for='(item,index) in result')
                li.preview-object-item(:class="{'active':hovering && hoverPuid===item.puid,'hide':hovering && hoverPuid!==item.puid}", :style='item.box', @mouseout='overOutBlock', @mousemove='overMoveBlock($event)', @mouseover='overInBlock(item)')
          template(v-else-if='isLoading')
            .image-placeholder
              Spin(:fix='true', size='large')
          template(v-else)
            .image-placeholder
              img(src='~@/assets/img/img404.png')
</template>

<script lang="ts">
import _ from 'lodash';
import LazyloadImg from '@/components/shared/LazyloadImg.vue';
import Component, { mixins } from 'vue-class-component';
import ComponentOptionsMixin from '@/mixins/componentOptions';
import { Prop, Watch } from 'vue-property-decorator';

@Component({
  components: { LazyloadImg }
})
export default class DetectByLayer extends mixins(ComponentOptionsMixin) {
  @Prop({ type: String, default: '' })
  hoverPuid!: string;
  @Prop({ type: Number, default: -1 })
  auxLineY!: number;
  @Prop({ type: String })
  target!: string;
  @Prop({ type: [Array, Object] })
  report!: any;
  @Prop({ type: Boolean, default: false })
  isLoading!: boolean;
  @Prop({ type: Number, default: 0 })
  total!: number;

  result: any[] = [];
  selectedLength: number = 0;

  get hovering(): string {
    const { hoverPuid } = this;
    return hoverPuid;
  }

  get warpperTop() {
    return (this.$refs.viewWarpper as Element).getBoundingClientRect().top;
  }

  get auxLineStyle(): any {
    const style = {
      position: 'absolute',
      top: `${this.auxLineY}px`,
      display: this.auxLineY > 0 ? 'block' : 'none'
    };
    return style;
  }

  load() {
    const { report }: any = this;
    if (_.isNil(report)) {
      return;
    }

    this.result = report.map((target: any) => {
      const { score, box, type, puid } = target;
      return {
        puid,
        score,
        type,
        box: {
          left: `${box[0] * 100}%`,
          top: `${box[1] * 100}%`,
          width: `${box[2] * 100}%`,
          height: `${box[3] * 100}%`
        }
      };
    });
  }

  overMoveBlock(e: any) {
    const auxLineY = e.clientY - this.warpperTop;
    this.$emit('auxLineHandle', auxLineY);
  }

  overInBlock(item: any) {
    const { puid } = item;
    this.$emit('setPuid', puid);
  }

  overOutBlock() {
    this.$emit('setPuid', '');
    this.$emit('auxLineHandle', -1);
  }

  @Watch('report', { immediate: true })
  reportChange() {
    this.load();
  }

  @Watch('hoverPuid', { immediate: true })
  hoverPuidChange(puid: any) {
    if (puid) {
      const filterPuid = this.report
        ? this.report.filter((e: any) => e.puid === puid)
        : [];
      this.selectedLength = filterPuid ? filterPuid.length : 0;
    } else {
      this.selectedLength = 0;
    }
  }
}
</script>

<style type="text/less" lang="less" scoped>
.preview {
  &-object {
    &-item {
      position: absolute;
      z-index: 9;
      background: transparent;
      padding-left: 3px;
      cursor: pointer;
      background: rgba(0, 0, 0, 0);
      border: 1px solid rgba(45, 140, 240, 0.8);
      &.active {
        background: rgba(0, 0, 0, 0);
        box-shadow: 0px 0px 3px #000;
        border: 1px solid rgba(45, 140, 240, 1);
        background: rgba(45, 140, 240, 0.2);
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
  .total {
    color: #fff;
    bottom: 20px;
    right: 20px;
  }
  .selected {
    color: #fff;
    right: 20px;
    bottom: 40px;
  }
  .aux-line {
    width: 100%;
    height: 1px;
    border: 1px dashed rgba(255, 255, 255, 0.6);
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

.preview-bd {
  padding: 0;
}
</style>
