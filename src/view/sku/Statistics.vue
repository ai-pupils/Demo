<template>
  <div class="page-content">
    <Card>
      <h6 slot="title">商品列表</h6>
      <Form class="search">
        <FormItem>
          <Input v-model="keyword" placeholder="商品名，商品ID，条形码" style="width: 300px"></Input>
          <Select v-model="packageType" placeholder="包装类型" style="width: 100px" filterable clearable>
            <Option v-for="item in SkuPackageTypes"
                    :value="item.id"
                    :key="item.id">{{ item.label }}</Option>
          </Select>
          <Select v-model="skuType" placeholder="商品类型" style="width: 100px" filterable clearable>
            <Option v-for="item in SkuTypes"
                    :value="item.id"
                    :key="item.id">{{ item.label }}</Option>
          </Select>
          <!-- 商品状态暂时隐藏 -->
          <!-- <Select v-model="skuStatus" placeholder="商品状态" style="width: 100px" filterable clearable>
            <Option v-for="item in SkuStatus"
                    :value="item.id"
                    :key="item.id">{{ item.label }}</Option>
          </Select> -->
          <Button icon="ios-search"
                  type="primary"
                  html-type="submit"
                  :loading="isFetching"
                  @click.prevent="load">查询</Button>
           <Button class="fr" type="primary" @click="$router.push('/sku/register')">商品注册</Button>
        </FormItem>

      </Form>

      <StatisticsTable :state="state"
              :pageIndex="start"
              :pageLimit="limit"
              @change="pageChange"
              @sortChange="sortChange"
              @refresh="refresh"></StatisticsTable>
    </Card>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex';
import stateParseMixin from '../../mixins/commonStateParseMixin';
import { SkuPackageTypes, SkuStatus, SkuTypes } from '../../const/data/sku';
import StatisticsTable from './StatisticsTable';

export default {
  components: { StatisticsTable },
  mixins: [stateParseMixin],
  data() {
    return {
      packageType: '',
      skuType: '',
      skuStatus: '',
      SkuPackageTypes,
      SkuTypes,
      SkuStatus,
      start: 0,
      limit: 20,
      keyword: '',
      sortBy: ['created_at', 'down']
    };
  },
  computed: {
    ...mapGetters('sku', { state: 'skus' })
  },
  methods: {
    ...mapActions('sku', ['getSkus']),
    load() {
      const {
        start,
        limit,
        keyword,
        sortBy,
        packageType,
        skuStatus,
        skuType
      } = this;

      this.getSkus({
        start,
        limit,
        keyword,
        sortBy,
        packageType,
        skuStatus,
        skuType
      });
    },
    pageChange({ pageIndex, pageLimit }) {
      this.start = pageIndex;
      this.limit = pageLimit;
      this.load();
    },
    sortChange({ sortBy }) {
      this.sortBy = sortBy;
      this.load();
    },
    refresh() {
      this.load();
    }
  },
  mounted() {
    this.load();
  }
};
</script>
<style lang="less" scoped>
</style>
