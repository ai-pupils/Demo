<template lang="pug">
  div
    Form(:model="formData", ref="form", :rules="rules").editor
      div.editor-text
        slot(name="layer")
          FormItem(label="拍摄层板" prop="layer_index")
            InputNumber(:max="10" :min="1" v-model.number='formData.layer_index')
        FormItem(label="指令名称" prop="name")
          Input(v-model='formData.name', placeholder='请填写指令名称', style='width: 300px;margin-right: 5px;')
        FormItem(label="指令内容" prop="hints")
          Input(v-model='formData.hints', type="textarea", :rows="22", placeholder='请填写指令内容', style='width: 300px;margin-right: 5px;')
      div.preview.editor-imgs
        FormItem(prop="imgs", label="指令示例图")
          ul.preview-list
            li(v-for="(url, i) in formData.imgs", :key="url").preview-list-item
              | 第{{i+1}}张
              a(v-if="url", :href="url", target="__blank").preview-list-item-link
                img(:src="url", alt="示例图").preview-list-item-img
              div(style="display: flex; flex-direction: column; justify-content: space-between; height: 100%; position: relative;")
                UploadImage(:action="UPLOAD_SKU_IMAGE" text="更换图片" :showImg="false"
                  @on-uploaded="uploaded($event, i)" ref="uploadBox")
                Poptip(title="确定要删除该图片位吗？" width="200" placement="top-end" transfer
                  content="content" confirm @on-ok="deleteImg(i)")
                  Button(type="text")
                    | 删除图片位
            li.preview-list-item
              UploadImage(:action="UPLOAD_SKU_IMAGE" text="更换图片" :showImg="false"
                @on-uploaded="newImageAdded" ref="uploadBox").upload-add
                  div(style="padding: 10px 6px")
                    Icon(type="md-cloud-upload" size="52")
                    p
                      | 如果要增加新的图片位，请点击或将图片拖拽到这里
    div.text-right
      Button(type="primary", @click="submitData")
        | 确定
</template>
<script lang="ts">
import Vue from 'vue';
import { Prop } from 'vue-property-decorator';
import Component from 'vue-class-component';
import UploadImage from '@/view/sku/UploadImage.vue'
import { UPLOAD_SKU_IMAGE_V2 } from '@/api/v2/skus'

function checkImgs(rule: any, imgs: Array<string>, callback) {
  if (imgs.length <= 0) {
    callback(new Error('图片数量不能为空'));
  } else {
    callback();
  }
}

@Component({
  components: {UploadImage}
})
export default class InstructionForm extends Vue {
  @Prop({ type: Object, required: true })
  info!: object;
  formData: {name: any, hints: any, imgs: any} = {
    name: this.info.name,
    hints: this.info.hints,
    layer_index: this.info.layer_index,
    imgs: [...this.info.image_urls]
  };
  get rules() {
    return {
      imgs: [{ required: true, validator: checkImgs, trigger: 'blur'}],
      name: [{ required: true, trigger: 'blur', message: '指令名称不能为空',}],
      hints: [{ required: true, trigger: 'blur', message: '指令内容不能为空',}],
      layer_index: [
        {
          required: true,
          trigger: 'blur',
          message: '拍摄层板不能为空',
          transform(value) {
            return value ? String(value) : value
          }
        }
      ],
    }
  }
  get UPLOAD_SKU_IMAGE() {
    return UPLOAD_SKU_IMAGE_V2
  }
  deleteImg(index: number) {
    this.formData.imgs.splice(index, 1)
    this.$refs['form'].validateField('imgs')
  }
  uploaded({resource}: any, index: number) {
    this.$set(this.formData.imgs, index, resource)
  }
  newImageAdded({resource}: any) {
    this.formData.imgs.push(resource)
    this.$refs['form'].validateField('imgs')
  }
  submitData() {
    (this.$refs.form as any).validate((isValid: boolean) => {
      if(isValid) {
        this.$emit('submit-form', this.formData)
      }
    })
  }
}
</script>
<style lang="less" scoped>
@import (less) '~@/css/vars.less';

.editor {
  display: flex;
  &-text {
    flex-basis: 400px;
    flex-shrink: 0;
  }
  &-imgs {
    flex-grow: 1;
    /deep/ .ivu-form-item-content {
      padding-left: 10px;
    }
    /deep/ .ivu-form-item-label {
      float: none;
    }
  }
}
.preview {
  &-list {
    &-item {
      display: inline-flex;
      align-items: flex-start;
      height: 120px;
      margin: 10px 0;
      width: 50%;
      vertical-align: top;
      color: #515a6e;
      &-link {
        max-width: 200px;
        height: 100%;
        margin: 0 10px;
      }
      &-img {
        max-width: 100%;
        max-height: 100%;
      }
      &.active {
        border-color: @color-success;
      }
    }
  }
  &-upload {
    height: 40px;
    border: none;
    &-item {
      // 除去上下边框的高度
      line-height: 40px;
    }
  }
  &-edit {
    margin-top: 10px;
    &-item {
      max-width: 90%;
      position: relative;
      &-delete {
        position: absolute;
        bottom: 0;
        right: 0;
        border-radius: 0;
      }
      &-img {
        width: 100%;
      }
    }
  }
}
.upload {
  &-text {
    margin: 0px 2px;
    font-size: 12px;
  }
  &-add {
    text-align: center;
    color: @color-disabled;
    cursor: pointer;
    border: 1px dashed #bbbec4;
    border-radius: 5px;
    &-icon {
      margin-left: 110px;
    }
  }
}
</style>
