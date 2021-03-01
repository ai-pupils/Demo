<template lang="pug">
  section
    Form(:ref="formName", :model="form", :rules="rules", :label-width="100")
      FormItem(label="商品名称:", prop="sku_name")
        Input(v-model="form.sku_name")
      FormItem.pr(label="商品品牌:", prop="trade_mark")
        Select(:loading="trademarkLoading", v-model="form.trade_mark", filterable, @on-change="handleChange")
          Option(v-for="(trademark,index) in tradeMarkMap", :key="index", :value="trademark.vendor_code",
            :label="handleTradeMarkLabel(trademark)"
          )
            div.clearfix
              .fl {{trademark.chinese | empty}}
              .fr {{trademark.english | empty}}
        Button.pa(style="right: -110px", @click="openTradeMarkModal") 新增商标品牌
        span Proposal商标：{{ proposalTradeMark | empty }}
      FormItem(label="原产国:", prop="coc")
        Select(v-model="form.coc", filterable, placeholder="请选择(支持关键字搜索)")
          Option(v-for="(coc,index) in cocMap", :key="index", :value="coc.code", :label="coc.name")
        span Proposal原产国：{{ proposalCoc | CocFilter | empty }}
      FormItem(label="商品类型:", prop="sku_type")
        Select(v-model="form.sku_type", @on-change="skuTypeChange")
          Option(v-for="(item,index) in SkuTypes", :key="index", :value="item.id", :label="item.label")
      FormItem(label="包装类型:", prop="package_type")
        Select(v-model="form.package_type")
          Option(v-for="(item,index) in SkuPackageTypes", :key="index", :value="item.id", :label="item.label")
      FormItem(label="商品性质:", prop="barcode_type")
        Select(v-model="form.barcode_type")
          Option(v-for="(item,index) in SkuBarcodeTypes", :key="index", :value="item.id", :label="item.label")
      FormItem(label="备注:", prop="comment")
        Input(v-model="form.comment", type="textarea", placeholder="请输入备注")
      FormItem(label="商品示例图:", prop="sku_url")
        UploadImage(
        :image-url="form.sku_url",
        :loading="uploadLoading",
        size="default",
        :showImg="true",
        :action="UPLOAD_SKU_IMAGE"
        @on-uploading="uploadLoading = true",
        @on-uploaded="uploadedHandle",
        ref="uploadBox"
        )
      FormItem(label="商品重量(可选):")
        Input(v-model="form.weight")
          span(slot="append") g
      FormItem(label="商品高度(可选):")
        Input(v-model="form.length")
          span(slot="append") mm
      FormItem(label="商品宽度(可选):")
        Input(v-model="form.width")
          span(slot="append") mm
      FormItem(label="商品厚度(可选):")
        Input(v-model="form.thickness")
          span(slot="append") mm
      FormItem
        Button(type="primary", @click="nextStepHandle") 下一步
    TradeMarkModal(ref="TradeMarkModalRef", @complete="tradeMarkSuccessHandle")
</template>

<script lang="ts">
import Component, { mixins } from 'vue-class-component';
import ValidFormMixin, { ValidFormOptions } from '@/mixins/validForm';
import { DefaultApiType } from '@/interface';
import { getTradeMarks$, ProposalData, UPLOAD_SKU_IMAGE } from '@/api/sku';
import { of } from 'rxjs';
import UploadImage from '@/view/sku/UploadImage.vue';
import TradeMarkModal from '@/view/sku-v2/components/TradeMarkModal.vue';
import {
  SkuStatus,
  SkuTypes,
  SkuBarcodeTypes,
  SkuPackageTypes,
  SkuTypeAndSkuPackageTypeRelation
} from '@/const/data/sku';
import { Form } from 'iview';
import { CocList } from '@/const/data/coc';
import { Prop, Watch } from 'vue-property-decorator';
import _ from 'lodash';

@Component({
  components: { TradeMarkModal, UploadImage },
  data() {
    return {
      rules: {
        sku_name: [{ required: true, message: '必填', trigger: 'blur' }],
        trade_mark: [{ required: true, message: '必填', trigger: 'change' }],
        coc: [{ required: true, message: '必填', trigger: 'change' }],
        sku_type: [{ required: true, message: '必填', trigger: 'change' }],
        package_type: [{ required: true, message: '必填', trigger: 'change' }],
        barcode_type: [{ required: true, message: '必填', trigger: 'change' }],
        sku_url: [{ required: true, message: '必填', trigger: 'change' }]
      }
    };
  }
})
export default class SkuForm extends mixins(ValidFormMixin)
  implements ValidFormOptions {
  @Prop() proposal!: ProposalData;
  formApi: DefaultApiType = () => of(true);
  formName: string = 'createSku';
  form: any = {
    barcode_type: undefined,
    coc: undefined,
    package_type: undefined,
    sku_name: undefined,
    sku_type: undefined,
    sku_url: undefined,
    trade_mark: undefined,
    weight: undefined,
    weight_deviation: undefined,
    comment: undefined,
    thickness: undefined,
    width: undefined,
    length: undefined
  };
  tradeMarkMap: any[] = [];
  trademarkLoading: boolean = true;
  cocMap: any = CocList;
  SkuTypes: any = SkuTypes;
  SkuPackageTypes: any = SkuPackageTypes;
  SkuBarcodeTypes: any = SkuBarcodeTypes;
  SkuStatus: any = SkuStatus;
  UPLOAD_SKU_IMAGE: string = UPLOAD_SKU_IMAGE;
  uploadLoading: boolean = false;
  proposalCoc = '';
  proposalTradeMark = '';

  @Watch('proposal')
  proposalChange(proposal: ProposalData) {
    if (proposal) {
      Object.keys(this.form).forEach((key: string) => {
        // trade_mark和coc 不能直接赋值
        if (key !== 'trade_mark' && key !== 'coc') {
          this.form[key] = (proposal as any)[key];
        }
      });
      this.form.sku_url = proposal.front_url || undefined;
      this.proposalCoc = proposal.coc;
      this.proposalTradeMark = proposal.trade_mark;
      // coc反选
      const coc_code = _.filter(this.cocMap, ['code', proposal.coc]);
      const coc_name = _.filter(this.cocMap, ['name', proposal.coc]);

      if (coc_code.length === 1) {
        this.form.coc = coc_code[0].code;
      }
      if (coc_name.length === 1) {
        this.form.coc = coc_name[0].code;
      }
    }
  }

  mounted() {
    this.getTradeMark();
  }

  getTradeMark() {
    getTradeMarks$().subscribe(({ isFulfill, payload }) => {
      if (isFulfill) {
        this.trademarkLoading = false;
        this.tradeMarkMap = payload!.data.trademarks;
        this.getProposalTradeMark();
      }
    });
  }

  getProposalTradeMark() {
    if (this.proposal && this.proposal.trade_mark) {
      const trade_marks = _.filter(this.tradeMarkMap, [
        'chinese',
        this.proposal.trade_mark
      ]);
      if (trade_marks.length === 1) {
        this.form.trade_mark = trade_marks[0].vendor_code;
      }
    }
  }

  transformFormParams() {
    return { ...this.form };
  }

  nextStepHandle() {
    this.validAndHandleForm$().subscribe(() => {
      if (this.proposal) {
        this.$emit('next', {
          approval_sku: {
            sku_info: {
              ...this.form,
              weight: this.form.weight ? Number(this.form.weight) : undefined,
              length: this.form.length ? Number(this.form.length) : undefined,
              thickness: this.form.thickness
                ? Number(this.form.thickness)
                : undefined,
              width: this.form.width ? Number(this.form.width) : undefined
            }
          }
        });
      } else {
        this.$emit('next', {
          sku: {
            ...this.form,
            weight: this.form.weight ? Number(this.form.weight) : undefined
          }
        });
      }

      this.$router.replace({
        name: 'v2-sku-create',
        query: { ...this.$route.query, step: '1' }
      });
    });
  }

  openTradeMarkModal() {
    const ref = <TradeMarkModal>this.$refs['TradeMarkModalRef'];
    ref.open();
  }

  tradeMarkSuccessHandle() {
    this.getTradeMark();
  }

  uploadedHandle({ status, imageId }: any) {
    if (status === 'success') {
      const formRef = this.$refs[this.formName] as Form;
      this.form.sku_url = imageId;
      formRef.validateField('sku_url');
    }
    this.uploadLoading = false;
  }

  skuTypeChange(value: any) {
    this.SkuPackageTypes = [...SkuTypeAndSkuPackageTypeRelation[value]];
    this.form.package_type = undefined;
  }

  handleChange(value: any) {
    this.form.trade_mark = value;
  }

  handleTradeMarkLabel(trade_mark: any) {
    if (trade_mark.chinese) {
      return trade_mark.chinese;
    } else {
      return trade_mark.english;
    }
  }
}
</script>
