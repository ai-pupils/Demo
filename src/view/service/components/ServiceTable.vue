<template>
<div>
  <TableBox :state="state" :default-sort="defaultSort" @sortChange="sortChange">
        <Column label="服务ID" align="center" prop="id" sortable="custom"></Column>
        <Column label="服务名称" align="center" prop="name" sortable="custom"></Column>
        <Column label="服务描述" align="center" sortable="custom">
          <template slot-scope="{row}">
            {{row.desc || '暂无'}}
          </template>
        </Column>
        <Column label="服务地址URL" align="center" prop="model_url" sortable="custom" :show-overflow-tooltip="true"></Column>
        <Column label="商品组名称" align="center" prop="bundle_name" sortable="custom">
            <template slot-scope="{row}">
              <router-link :to="'/sku-bundle/list?keyword='+row.bundle_id">{{row.bundle_name}}</router-link>
            </template>
        </Column>
        <Column label="商户ID" align="center" prop="dealer_id" sortable="custom"></Column>
        <Column label="服务状态" align="center" prop="status" sortable="custom">
          <template slot-scope="{row}">
            {{row.status | getModelServiceTypes}}
          </template>
        </Column>
        <Column label="创建时间" align="center" prop="create_time" sortable="custom">
            <template slot-scope="{row}">
                {{row.create_time | fmtLocalTime}}
            </template>
        </Column>
        <Column label="操作" align="center">
          <template slot-scope="{row}">
            <Button type="primary" size="small" @click="goUpdate(row)">编辑</Button>
            <!-- TODO: 暂时没有此功能 -->
            <!-- <Button type="error" size="small" @click="goUpdate(row)">下线服务</Button>  -->
            <!-- <Button v-if="isCanTraining(row)" type="success" size="small" @click="training(row)" disabled>开始训练</Button> -->
            <!-- <Button v-if="isOffline(row)" type="primary" size="small" @click="redeploy(row)">重新训练</Button> -->
            <Button v-if="isOffline(row)" type="primary" size="small" @click="retraining(row)">重新部署</Button>
          </template>
        </Column>
  </TableBox>
  <Modal
        v-model="updateModelModal"
        title="编辑服务"
        width="60">
        <Form ref="form" :model="form" :rules="rules" label-position="right" :label-width="100">
            <FormItem label="服务名称" prop="name">
                <Input v-model="form.name" placeholder="请输入服务名称"></Input>
            </FormItem>
            <FormItem label="服务描述" prop="desc">
                <Input v-model="form.desc" placeholder="请输入服务描述"></Input>
            </FormItem>
        </Form>
        <template slot='footer'>
            <Button type='primary' @click="confimUpdate">确定</Button>
            <Button @click="cancelUpdate">取消</Button>
        </template>
    </Modal>
</div>

</template>

<script>
import StatusBox from '../../../components/shared/StatusBox';
import TableBox from '../../../components/shared/TableBox';
import { updateModel$ } from '../../../api/models';
import { postTrainTasks$ } from '../../../api/train-tasks';

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
    };
  },
  methods: {
    goUpdate(item) {
      this.currentModel = item;
      this.updateModelModal = true;
      this.form.name = item.name;
      this.form.desc = item.desc;
    },
    isCanTraining() {
      // TODO: 准备训练状态，暂时未定
      return true;
    },
    isOffline(item) {
      return item.status === 'offline';
    },
    redeploy(item) {
      this.$Modal.confirm({
        title: '确认是否要重新部署？',
        onOk: () => {
          updateModel$(item.id, {
            dealerId: item.dealer_id,
            bundleId: item.bundle_id,
            status: 'undeployed'
          }).subscribe(() => {
            this.$Message.success('重新部署成功!');
            this.$emit('refresh');
          });
        },
        onCancel: () => {
          this.$Modal.remove();
        }
      });
    },
    retraining(item) {
      this.$Modal.confirm({
        title: '确认是否要重新训练？',
        onOk: () => {
          postTrainTasks$({
            name: item.name,
            desc: item.desc,
            dealerId: item.dealer_id,
            bundleId: item.bundle_id,
            modelId: item.id
          }).subscribe(() => {
            this.$Message.success('重新训练成功!');
            this.$emit('refresh');
          });
        },
        onCancel: () => {
          this.$Modal.remove();
        }
      });
    },
    // TODO: 开始训练
    training() {},
    confimUpdate() {
      this.$refs.form.validate(valid => {
        if (valid) {
          updateModel$(this.currentModel.id, {
            name: this.form.name,
            desc: this.form.desc,
            dealerId: this.currentModel.dealer_id,
            bundleId: this.currentModel.bundle_id
          }).subscribe(() => {
            this.updateModelModal = false;
            this.$Message.success('更新成功!');
            this.$emit('refresh');
          });
        }
      });
    },
    cancelUpdate() {
      this.currentModel = {};
      this.updateModelModal = false;
      this.form.name = undefined;
      this.form.desc = undefined;
      this.$refs.form.resetFields();
    }
  }
};
</script>
