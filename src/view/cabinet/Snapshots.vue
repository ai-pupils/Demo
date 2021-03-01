<template>
  <div class="page-content">
    <Row class-name="mb20">
      <Col :span="6">货柜ID: {{cabinetId}}</Col>
    </Row>
    <Row class="mb20 clearfix">
      <Button
        class="fl"
        type="primary"
        @click="doSnapshot"
        :loading="state.isFetching || isSnapShotFetching"
        :disabled="!isMalongIot"
      >{{buildingSnapshotText}}</Button>
      <Alert
        v-if="isBuildSnapShot"
        class="fl ml20"
        type="error"
        show-icon
        closable
        style="width:200px;"
      >快照生成失败!</Alert>
    </Row>
    <Row class-name="mb20">
      <Timeline>
        <TimelineItem v-for="(result, index) in results" :key="result.create_time">
          <p>拍摄时间：{{result.create_time | fmtLocalTime}}</p>
          <p>服务ID：{{result.model_id | emptyText}}</p>
          <Carousel
            v-if="result.snapshot"
            type="card"
            arrow="always"
            :autoplay="false"
            height="450px"
          >
            <CarouselItem v-for="item, index in result.snapshot.layers" :key="index">
              <LazyloadImg :src="item.snapshot.images[0]"></LazyloadImg>
              <a :href="item.snapshot.images[0]" class="btn btn-share" target="_blank">
                <i class="fa fa-external-link"></i>
              </a>
            </CarouselItem>
          </Carousel>
        </TimelineItem>
      </Timeline>
      <Alert type="warning" show-icon v-if="results.length === 0">暂无快照</Alert>
      <Spin size="large" fix v-if="state.isFetching"></Spin>
    </Row>
  </div>
</template>

<script>
import { throwError } from 'rxjs';
import { tap, mergeMap, filter, scan } from 'rxjs/operators';
import GoBack from '../../components/shared/GoBack';
import LazyloadImg from '../../components/shared/LazyloadImg';
import { getSnapshots$, postSnapshot$ } from '../../api/snapshots';
import { createEmptyTrackMeta } from '../../utils/misc';
import { Carousel, CarouselItem } from 'element-ui';
import { polling$ } from '../../utils/observables';

const subscrptions = [];

export default {
  components: { GoBack, Carousel, CarouselItem, LazyloadImg },
  props: ['cabinetId', 'isMalongIot'],
  data() {
    return {
      state: createEmptyTrackMeta(),
      isSnapShotFetching: false,
      isBuildSnapShot: false,
      buildingSnapshotText: '生成快照'
    };
  },
  created() {
    this.load().subscribe();
  },
  destroyed() {
    subscrptions.forEach(e => e.unsubscribe());
  },
  methods: {
    load(params) {
      this.state = createEmptyTrackMeta();
      return getSnapshots$({
        cabinetId: this.cabinetId,
        ...params
      }).pipe(
        tap(state => {
          this.state = { ...state };
        })
      );
    },
    doSnapshot() {
      const getSnapshotById$ = id =>
        getSnapshots$({
          cabinetId: this.cabinetId,
          snapshotId: id
        });

      this.isSnapShotFetching = true;
      this.isBuildSnapShot = false;
      this.buildingSnapshotText = '生成快照中...';
      const countDownHandle = () => source =>
        source.pipe(
          scan(acc => acc - 1, 60 + 1),
          tap(count => {
            this.buildingSnapshotText = `生成快照中...(${count}s)`;
          })
        );
      subscrptions[0] = postSnapshot$(this.cabinetId)
        .pipe(
          mergeMap(res => {
            const { payload, isFulfill, error } = res;
            if (isFulfill) {
              // 获取快照服务端为异步处理，需要polling处理
              // polling总时长60s，间隔时间1s
              return polling$(
                1000,
                1000,
                60 * 1000,
                getSnapshotById$(payload.data.snapshot_id),
                countDownHandle()
              );
            }
            return throwError(error);
          }),
          filter(res => res.payload.data.total_count > 0),
          tap(() => {
            this.load().subscribe(() => {
              this.isSnapShotFetching = false;
              this.buildingSnapshotText = '生成快照';
              subscrptions[0].unsubscribe();
            });
          })
        )
        .subscribe({
          error: () => {
            this.isSnapShotFetching = false;
            this.isBuildSnapShot = true;
            this.buildingSnapshotText = '生成快照';
          },
          complete: () => {
            this.isSnapShotFetching = false;
            this.isBuildSnapShot = true;
            this.buildingSnapshotText = '生成快照';
          }
        });
    }
  },
  computed: {
    results() {
      return this.state.isFulfill && this.state.payload.data.results;
    }
  }
};
</script>

<style type="text/less" lang="less" scoped>
@import (less) '../../css/vars.less';

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
</style>
