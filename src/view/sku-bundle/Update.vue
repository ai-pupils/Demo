<template>
    <div class="page-content">
        <GoBack ref="goBack" to="/sku-bundle/list"></GoBack>
        <Card>
            <h6 slot="title">编辑商品组</h6>
            <Alert>
                <h6 style="margin-bottom: 20px;">商品组信息</h6>
                <Form ref="form" :model="form" :rules="rules" :label-width="100">
                    <Row>
                        <Col span="12">
                            <FormItem label="商品组ID:" >{{form.id}}</FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem label="商品组名称:" prop="name">
                                <Input v-model="form.name" placeholder="请输入商品组名称"></Input>
                            </FormItem>
                        </Col>
                    </Row>
                     <Row>
                        <Col span="12">
                            <FormItem label="商户ID:">{{form.dealerId}}</FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem label="商品组描述:" prop="description">
                                <Input v-model="form.description" placeholder="请输入商品组描述"></Input>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="12">
                            <FormItem label="货柜类型:">{{form.cabinetTypeName || '暂无'}}</FormItem>
                        </Col>
                    </Row>
                </Form>
            </Alert>
            <div class="title-bar clearfix">
                <h6>商品列表</h6>
                <div class="tool fr">
                    <div class="help fl" @click="getHelp">相似商品不可同时添加<Icon type="md-help-circle" /></div>
                    <Button class="fr" type="primary" @click="addSku" :disabled="isDisableAddSkus">添加商品</Button>
                </div>
            </div>
            <Table
                :data="skus"
                :border="true"
                :fit="true">
                <Column label="商品ID" align="center" prop="id"></Column>
                <Column label="商品名称" align="center" prop="name"></Column>
                <Column label="商品条码" align="center" prop="barcode"></Column>
                <Column label="包装类型" align="center" prop="package_type">
                  <template slot-scope="{row}">
                    {{row.package_type | getSkuPackageTypes}}
                  </template>
                </Column>
                <Column label="商品类型" align="center" prop="package_type">
                  <template slot-scope="{row}">
                    {{row.sku_type | getSkuTypes}}
                  </template>
                </Column>
                <Column label="商品性质" align="center" prop="barcode_type">
                  <template slot-scope="{row}">
                    {{row.barcode_type | getSkuBarcodeTypes}}
                  </template>
                </Column>
                <Column label="商品样例图" align="center" :width="100">
                  <template slot-scope="{ row }">
                    <a v-if="row.url" :href="row.url" target="_blank">
                      <LazyloadImg class="thumb" :src="row.url"></LazyloadImg>
                    </a>
                    <span v-else>暂无</span>
                  </template>
                </Column>
                <Column label="操作" align="center">
                    <template slot-scope="{row}">
                        <Button type="error" size="small" v-if="models.length === 0" @click="deleteSku(row)">删除</Button>
                    </template>
                </Column>
                <template slot="empty">
                    <StatusBox
                        :isFetching="state.isFetching"
                        :error="state.error"
                        :isEmpty="skus && (skus.length === 0)">
                    </StatusBox>
                </template>
            </Table>
            <div class="footer-bar">
                <Button class="confirm" type="primary" @click="submit('form')" :loading="state.isFetching || isSubmit">提交修改</Button>
                <Button @click="goBack">取消</Button>
            </div>
        </Card>

        <Modal
            v-model="helpModalVisable"
            title="相似商品不可同时添加"
            width="40"
            :footer-hide="true">
            <div class="modal-content">
              <p>以下的互斥商品原则上不能在同一货柜中进行运营，如果需要在同一柜中运营需要允许识别模型将这些互斥商品识别成同一个商品。</p>
              <p>1.除容量外，完全一样的商品。 如：怡宝350ml和550ml</p>
              <div class="center"><img src="~@/assets/img/sku-bundle/show-sku-rule1.png" alt=""></div>
              <p>1.瓶盖颜色一样，瓶颈相似的商品。如： 统一午后奶茶和康师傅经典奶茶</p>
              <div class="center">
                <img src="~@/assets/img/sku-bundle/show-sku-rule2.png" alt="">
                <img src="~@/assets/img/sku-bundle/show-sku-rule3.png" alt="">
              </div>
              <p>2.单面完全一致的盒装商品， 如盒装统一冰红茶和 盼盼红苹果饮料</p>
              <div class="center">
                <img src="~@/assets/img/sku-bundle/show-sku-rule4.png" alt="">
                <img src="~@/assets/img/sku-bundle/show-sku-rule5.png" alt="">
              </div>
              <p>3.单面完全一致的纯圆柱形商品：可口可乐普通饮料 和可口可乐零度可乐</p>
              <div class="center">
                <img src="~@/assets/img/sku-bundle/show-sku-rule6.png" alt="">
                <img src="~@/assets/img/sku-bundle/show-sku-rule7.png" alt="">
              </div>
              <p>注意：顶部非纯圆柱形的商品可以摆放，如:天地壹号苹果醋和屈臣氏苏打水</p>
              <div class="center">
                <img src="~@/assets/img/sku-bundle/show-sku-rule8.png" alt="">
                <img src="~@/assets/img/sku-bundle/show-sku-rule9.png" alt="">
              </div>
            </div>
        </Modal>
    </div>
</template>
<script>
import StatusBox from '../../components/shared/StatusBox';
import { tap } from 'rxjs/operators';
import {
  getSkuBundle$,
  updateSkuBundles$,
  deleteSkuFromBundle$
} from '../../api/sku-bundle';
import { createEmptyTrackMeta } from '../../utils/misc';
import LazyloadImg from '../../components/shared/LazyloadImg';
import GoBack from '../../components/shared/GoBack';

export default {
  props: ['id', 'dealerId'],
  components: { StatusBox, LazyloadImg, GoBack },
  data() {
    return {
      isSubmit: false,
      isFetching: true,
      form: {
        id: undefined,
        name: undefined,
        dealerId: undefined,
        description: undefined
      },
      rules: {
        name: [{ required: true, message: '请输入商品组名称', trigger: 'blur' }]
      },
      skus: [],
      models: [],
      state: createEmptyTrackMeta(),
      helpModalVisable: false
    };
  },
  created() {
    this.getData().subscribe();
  },
  computed: {
    isDisableAddSkus() {
      return this.models.length > 0;
    }
  },
  methods: {
    getData() {
      this.state = createEmptyTrackMeta();
      this.skus = [];
      return getSkuBundle$(this.id).pipe(
        tap(state => {
          const {
            payload: { data }
          } = state;
          this.form.id = data.id;
          this.form.name = data.name;
          this.form.dealerId = data.dealer_id;
          this.form.description = data.description;
          this.form.cabinetTypeName = data.cabinet_type_name;
          this.skus = data.skus || [];
          this.models = data.models || [];
          this.state = state;
        })
      );
    },
    submit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.isSubmit = true;
          updateSkuBundles$(this.id, {
            dealerId: this.form.dealerId,
            name: this.form.name,
            description: this.form.description
          }).subscribe(() => {
            this.isSubmit = false;
            this.$Message.success('修改成功！');
            this.$router.push('/sku-bundle/list');
          });
        }
      });
    },
    deleteSku(item) {
      this.$Modal.confirm({
        title: '确认是否删除这个商品？',
        onOk: () => {
          deleteSkuFromBundle$(this.id, {
            dealerId: this.form.dealerId,
            barcodes: [item.barcode]
          }).subscribe(() => {
            this.$Message.success('删除成功!');
            this.getData().subscribe();
          });
        },
        onCancel: () => {
          this.$Modal.remove();
        }
      });
    },
    addSku() {
      this.$router.push(`/sku-bundle/add-sku/${this.form.dealerId}/${this.id}`);
    },
    getHelp() {
      this.helpModalVisable = true;
    },
    goBack() {
      this.$refs.goBack.back();
    }
  }
};
</script>
<style lang="scss">
.footer-bar {
  text-align: center;
  .confirm {
    margin-right: 15px;
  }
}
.title-bar {
  margin-top: 20px;
  height: 30px;
  line-height: 30px;
  h6 {
    display: inline-block;
  }
}
.tool .help {
  &:hover {
    cursor: pointer;
  }
  margin-right: 10px;
}
.center {
  text-align: center;
}
.modal-content {
  padding: 0 40px;
  p {
    font-size: 14px;
    margin-top: 40px;
    margin-bottom: 40px;
    &:first-child {
      margin-top: 0px;
    }
  }
  img {
    height: 241px;
  }
}
</style>
