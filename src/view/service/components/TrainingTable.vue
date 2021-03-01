<template>
  <div>
    <TableBox :state="state" :default-sort="defaultSort" @sortChange="sortChange">
      <Column label="任务ID" :width="100" :show-overflow-tooltip="true" align="center" prop="task_id" :sortable="false">
        <!--任务ID链接先去掉-->
        <!--<template slot-scope="{row}">-->
          <!--<a class="hover-pointer" @click="openSkuModal(row.task_id)">{{row.task_id | emptyText}}</a>-->
        <!--</template>-->
      </Column>
      <Column label="任务名称" align="center" prop="task_name" :sortable="false"></Column>
      <Column label="任务描述" align="center" :sortable="false">
        <template slot-scope="{row}">
          {{row.task_desc || '暂无'}}
        </template>
      </Column>
      <Column label="任务来源" align="center" prop="task_from" :sortable="false"></Column>
      <Column label="服务ID" :width="100" align="center" prop="model_id" :sortable="false">
        <template slot-scope="{row}">
          <routerLink :to="'/service/list?pageIndex=1&keyword='+ row.model_id">
            {{row.model_id || '暂无'}}
          </routerLink>
        </template>
      </Column>
      <Column label="商品组ID" :width="100" align="center" prop="bundle_id" :sortable="false" :show-overflow-tooltip="true">
        <template slot-scope="{row}">
          <routerLink :to="'/sku-bundle/update/'+ row.bundle_id + '? dealerId=' + row.dealer_id ">
            {{row.bundle_id || '暂无'}}
          </routerLink>
        </template>
      </Column>
      <Column label="商户ID" :width="100" align="center" prop="dealer_id" :sortable="false">
        <template slot-scope="{row}">
          <routerLink :to="'/board/cabinets?keyword=' + row.dealer_id ">
            {{row.dealer_id || '暂无'}}
          </routerLink>
        </template>
      </Column>
      <Column label="任务状态" :width="100" align="center" prop="status" :sortable="false">
        <template slot-scope="{row}">
          <Tag :color="getTrainingTaskStatusTypes(row.status).color">
            {{getTrainingTaskStatusTypes(row.status).text}}
          </Tag>
        </template>
      </Column>
      <Column label="任务开始时间" align="center" prop="create_time" :sortable="false">
        <template slot-scope="{row}">
          {{row.created_at | fmtLocalTime}}
        </template>
      </Column>
      <Column label="任务更新时间" align="center" prop="modified_at" :sortable="false">
        <template slot-scope="{row}">
          {{row.modified_at | fmtLocalTime}}
        </template>
      </Column>
      <Column label="训练时长" :width="100" align="center" :sortable="false">
        <template slot-scope="{row}">
          <span v-if="row.status === 4">{{[row.modified_at, row.created_at] | timeDiff}}</span>
          <span v-else>-</span>
        </template>
      </Column>
    </TableBox>
    <!--训练任务点击ID弹窗，先隐藏-->
    <!--<Modal-->
      <!--v-model="skuModalVisable"-->
      <!--title="训练任务"-->
      <!--width="60"-->
      <!--:footer-hide="true">-->
    <!--</Modal>-->
  </div>

</template>

<script>
import StatusBox from '../../../components/shared/StatusBox';
import TableBox from '../../../components/shared/TableBox';
import _ from 'lodash';
import { CrainingTaskStatusTypes } from '../../../const/data/trainingTaskStatusTypes';
// import {getTrainTask$} from '@/api/train-tasks';

export default {
  props: ['state', 'sortChange', 'defaultSort'],
  components: { StatusBox, TableBox },
  data() {
    return {
      currentModel: {},
      updateModelModal: false,
      form: {
        name: undefined,
        desc: undefined
      },
      rules: {
        name: [{ required: true, message: '请输入服务名称', trigger: 'blur' }]
      }
      // skuModalVisable: false,
      // skuModalData: []
    };
  },
  methods: {
    // TODO 获取单个任务信息
    // openSkuModal(id) {
    //   getTrainTask$(id).subscribe((stage) => {
    //     console.log(stage.payload.data);
    //     // this.skuModalData = stage.payload.data;
    //     // this.skuModalVisable = true;
    //     });
    // }
    getTrainingTaskStatusTypes(status) {
      return (_.find(CrainingTaskStatusTypes, { id: status }) || {}).label;
    }
  }
};
</script>
