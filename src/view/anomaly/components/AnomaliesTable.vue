<template>
<div>
  <TableBox :state="state" :default-sort="defaultSort" @sortChange="sortChange">
        <Column prop="id" align="center" label="异常ID"></Column>
        <Column prop="manager_cabinet_id" align="center" label="柜体ID"></Column>
        <Column align="center" label="异常名称">
          <template slot-scope="{row}">
            {{row.error_name}}
          </template>
        </Column>
        <Column align="center" label="异常等级">
          <template slot-scope="scope">
            <Tag :color="getErrorLevelTag(scope.row.error_priority)">
              {{scope.row.error_priority}}
            </Tag>
          </template>
        </Column>
        <Column align="center" label="异常图片">
          <template slot-scope="{row}">
            <div>
              <div v-if="row.trx_id">
                <a
                  @click.prevent="showImages(row.trx_id)"
                >查看图片</a>
              </div>
              <div v-else>-</div>
            </div>
          </template>
        </Column>
        <Column prop="status" align="center" label="异常状态">
          <template slot-scope="{row}">
            {{row.status | getAnomalyStatusTypes}}
          </template>
        </Column>
        <Column align="center" label="处理方法">
          <template slot-scope="{row}">
            <div>
              <ElementTooltip effect="light" :visible-arrow="false" placement="right">
                <div slot="content">
                  <div style="font-size:14px;max-width:400px;">
                    <div style="padding-bottom:10px">处理意见：</div>
                      {{row.error_solution || '暂无'}}
                    </div>
                  </div>
                  <i class="el-icon-tickets" style="font-size:25px"></i>
              </ElementTooltip>
            </div>
          </template>
        </Column>
        <Column prop="status_start_time" align="center" label="开始时间">
          <template slot-scope="{row}">
            {{row.status_start_time | fmtLocalTime}}
          </template>
        </Column>
        <Column prop="status_end_time" align="center" label="结束时间">
          <template slot-scope="{row}">
            {{row.status_end_time | fmtLocalTime}}
          </template>
        </Column>
  </TableBox>
  <Modal ref="carousel" v-model="carouselVisible" :footer-hide="true" :width="1000">
    <header slot="header">
      <h3>相关图片</h3>
    </header>
    <Carousel type="card" indicator-position="outside" height="450px"
      arrow="always"
      :autoplay="false">
      <Spin size="large" fix  v-if="urls.length === 0"></Spin>
      <CarouselItem v-for="item in urls" :key="item">
        <LazyloadImg :src="item" style="" ></LazyloadImg>
      </CarouselItem>
    </Carousel>
  </Modal>
</div>

</template>

<script>
import _ from 'lodash';
import { Carousel, CarouselItem } from 'element-ui';
import StatusBox from '@/components/shared/StatusBox';
import TableBox from '@/components/shared/TableBox';
import LazyloadImg from '@/components/shared/LazyloadImg';
import { getTransactionBySn$ } from '@/api/transaction';

const PRIORITY_TO_TAG = {
  高: 'error',
  中: 'warning',
  低: 'success'
};

export default {
  props: ['state', 'sortChange', 'defaultSort'],
  components: { StatusBox, TableBox, LazyloadImg, Carousel, CarouselItem },
  data() {
    return {
      urls: [],
      carouselVisible: false
    };
  },
  methods: {
    getErrorLevelTag(priority) {
      return PRIORITY_TO_TAG[priority];
    },
    showImages(id) {
      this.carouselVisible = true;
      this.urls = [];
      getTransactionBySn$({id:id}).subscribe(withMetaResponse => {
        const payload = withMetaResponse.payload.data;
        const layerInfo = payload.layer_info;

        if (layerInfo) {
          this.urls = this.urls.concat(_.map(layerInfo, e => e.start_image));
          this.urls = this.urls.concat(_.map(layerInfo, e => e.end_image));
        }
      });
    }
  }
};
</script>
