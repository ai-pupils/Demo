<template lang="pug">
  div
    dropdown(trigger='click', @on-click='selectLang')
      a(href='javascript:void(0)')
        | {{ title }}
        icon(:size='18', type='md-arrow-dropdown')
      dropdownmenu(slot='list')
        dropdownitem(v-for='(value, key) in localList', :name='key', :key='`lang-${key}`') {{ value }}
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';

@Component({})
export default class Language extends Vue {
  @Prop({ type: String })
  lang!: string;

  langList: any = {
    'zh-CN': '语言',
    'zh-TW': '語言',
    'en-US': 'Lang'
  };
  localList: any = {
    'zh-CN': '中文简体',
    'zh-TW': '中文繁体',
    'en-US': 'English'
  };

  @Watch('lang')
  langChange(lang: any) {
    this.$i18n.locale = lang;
  }

  get title(): any {
    return this.langList[this.lang];
  }

  selectLang(name: any) {
    this.$emit('on-lang-change', name);
  }
}
</script>
