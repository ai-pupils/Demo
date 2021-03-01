<template lang="pug">
  .box
    transition(
      v-for="(ball, index) in balls", :key="ball.id", name="ballslist",
      @appear="appear", @after-appear="afterAppear")
      .ball(v-if="ball.show", :data-id="ball.id",
        :style="{transform: `translate3d(${ball.x}px, ${ball.y}px, 0)`, top: 0,left: 0}")
        lazy-load-image(height="150px", :src="itemImgUrl")
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import LazyLoadImage from '@/components/shared/LazyLoadImage.vue';

@Component({
  components: { LazyLoadImage }
})
export default class FlyBall extends Vue {
  // 小球运动到终点需要的时间
  @Prop({ type: Number, default: 50 }) timeCost!: number;
  // 终点（购物车）相对于屏幕右侧和底部的距离
  @Prop({ type: Number, default: 100 }) targetRightOfClient!: number;
  @Prop({ type: Number, default: 70 }) targetBottomOfClient!: number;
  // 背景图片
  itemImgUrl: string = '';

  // 小球集合
  balls: any = [];
  // 控制小球运动速度
  speed: number = 20;
  // 购物车坐标
  target: any = { x: 0, y: 0 };
  // 被点击的元素
  clickedNode: any = {
    x: 0,
    y: 0,
    tagName: '',
    className: ''
  };

  mounted() {
    this.target.x = this.targetWidth;
    this.target.y = this.targetHeight;
    // 监听屏幕尺寸变化
    window.onresize = () => {
      this.target.x = this.targetWidth;
      this.target.y = this.targetHeight;
    };
    this.init();
  }

  get targetWidth() {
    return (
      (document.documentElement!.clientWidth || document.body.clientWidth) -
      this.targetRightOfClient
    );
  }
  get targetHeight() {
    return (
      (document.documentElement!.clientHeight || document.body.clientHeight) -
      this.targetBottomOfClient
    );
  }

  init() {
    document.body.addEventListener('click', (e: any) => {
      this.clickedNode.x = e.pageX;
      this.clickedNode.y = e.pageY;
      this.clickedNode.tagName = e.target!.tagName;
      this.clickedNode.className = e.target!.className;
    });
  }

  /* 外部组件调用此方法添加动画
   * params: clickedNode.tagName点击元素的tagName，clickedNode.className点击元素的className
   * itemImageUrl: 点击元素在运动时的背景图片
   * */
  click2Show(clickedNode: any, itemImageUrl: string = '') {
    if (
      clickedNode &&
      this.clickedNode.tagName === clickedNode.tagName &&
      this.clickedNode.className === this.clickedNode.className
    ) {
      let balls = this.balls;
      this.itemImgUrl = itemImageUrl;
      this.speed = (this.targetWidth - this.clickedNode.x) / this.timeCost;
      balls.push({
        id: new Date().getTime(),
        x: this.clickedNode.x,
        y: this.clickedNode.y,
        show: true
      });
    }
  }
  move(el: any, x: number, y: number, a: any, done: any) {
    let style = el.style;
    // 记录下起始点坐标
    let sx = x;
    let sy = y;
    let moveFn = (x: number, y: number) => {
      requestAnimationFrame(() => {
        let scaleX = (this.targetWidth - x) / (this.targetWidth - sx);
        if (scaleX < 0.1) {
          scaleX = 0;
        }
        style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scaleX}, ${scaleX})`;
        if (x < this.target.x) {
          y = a * Math.pow(x - sx, 2) + sy;
          x += this.speed;
          moveFn(x, y);
        } else {
          done();
        }
      });
    };
    moveFn(x, y);
  }
  appear(el: any, done: any) {
    let balls = this.balls;
    let target = this.target;
    let id = el.dataset.id;
    let x, y;
    for (let i = 0; i < balls.length; i++) {
      if (balls[i].id == id) {
        x = balls[i].x;
        y = balls[i].y;
        break;
      }
    }
    // let {x, y} = balls[id]
    // 假设抛物线顶点在原点，则抛物线方式为 y = a*Math.pow(x-h, 2) + k，
    // 其中(h,k)即为抛物线顶点坐标
    let a = (target.y - y) / Math.pow(target.x - x, 2);
    this.move(el, x, y, a, done);
    // done()
  }
  afterAppear(el: any) {
    let balls = this.balls;
    let id = el.dataset.id;
    // 隐藏小球
    for (let i = 0; i < balls.length; i++) {
      if (balls[i].id == id) {
        balls[i].show = false;
        break;
      }
    }
  }

  targetClicked() {
    this.$emit('targetClicked');
  }
}
</script>

<style scoped>
.ball {
  position: fixed;
  width: 120px;
  z-index: 2999;
}
.box {
  position: fixed;
  z-index: 2999;
  height: 0;
}
</style>
