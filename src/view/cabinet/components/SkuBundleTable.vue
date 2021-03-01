<template lang="pug">
  .page-content(v-if='cabinet.bundle_id !== -1')
    div(v-if='cabinet.binding_service')
      b 商品组ID:
      <!--router-link(:to="'/v2/sku-bundle/detail/'+cabinet.bundle_id")-->
      span.ml-20 {{cabinet.bundle_id | emptyText}}
      b.ml-50 商品组名称:
      span.ml-20 {{cabinet.binding_service.bundle_name | emptyText}}
    Table(:data='skus', :border='true', :fit='true')
      Column(label='商品ID', align='center', prop='sku_id')
      Column(label='商品名称', align='center', prop='sku_name')
      Column(label='包装类型', align='center', prop='package_type')
        template(slot-scope='{row}')
          | {{row.package_type | getSkuPackageTypes}}
      Column(label='商品类型', align='center', prop='package_type')
        template(slot-scope='{row}')
          | {{row.sku_type | getSkuTypes}}
      Column(label='商品性质', align='center', prop='barcode_type')
        template(slot-scope='{row}')
          | {{row.barcode_type | getSkuBarcodeTypes}}
      Column(label='商品样例图', align='center', :width='100')
        template(slot-scope='{ row }')
          a(v-if='row.sku_url', :href='row.sku_url', target='_blank')
            LazyloadImg.thumb(:src='row.sku_url')
          span(v-else='') --
      template(slot='empty')
        StatusBox(:isFetching='state.isFetching', :error='state.error', :isEmpty='skus && (skus.length === 0)')
  Alert(v-else='')
    | 暂无
</template>
<script lang="ts">
  import Vue from 'vue';
  import StatusBox from '@/components/shared/StatusBox.vue';
  import {tap, mergeMap} from 'rxjs/operators';
  import {getV2SkuBundle$} from '@/api/sku-bundle';
  import {getCabinet$} from '@/api/cabinet';
  import {createEmptyTrackMeta} from '@/utils/misc';
  import LazyloadImg from '@/components/shared/LazyloadImg.vue';
  import {Component, Prop} from "vue-property-decorator";
  import {EMPTY} from "rxjs";
  import {refreshCabinetBundle$} from "@/api/cabinet";


  @Component({
    components: {StatusBox, LazyloadImg}
  })
  export default class TrxHistoryList extends Vue {
    @Prop() cabinet_id!: number;
    skus: any = [];
    models: any = [];
    cabinet: any = {};
    state: any = createEmptyTrackMeta();

    mounted() {
      refreshCabinetBundle$.subscribe(()=> this.getTableInfo());
    }

    created() {
      this.getTableInfo();
    }

    getTableInfo() {
      this.loadCabinetData()
        .pipe(
          mergeMap(res => {
            this.cabinet = res.payload.data;
            if(this.cabinet.bundle_id <= 0){
              return EMPTY;
            }
            return this.getData();
          })
        ).subscribe();
    }

    loadCabinetData() {
      return getCabinet$(this.cabinet_id);
    }
    getData() {
      this.state = createEmptyTrackMeta();
      this.skus = [];
      return getV2SkuBundle$(this.cabinet.bundle_id).pipe(
        tap(state => {
          const {
            payload: {data}
          } = state;
          this.skus = data.skus || [];
          this.models = data.models || [];
          this.state = state;
        })
      );
    }
  }
</script>
<style lang="scss">
  .ml-20 {
    margin-left: 20px;
  }

  .ml-50 {
    margin-left: 50px;
  }
</style>
