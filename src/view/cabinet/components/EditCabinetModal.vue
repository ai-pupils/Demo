<template lang="pug">
    section
        Modal(v-model='visible', @on-ok='confirmHandle')
            div(slot='header') 编辑货柜
            Form(:label-width='75')
                FormItem(label='货柜名称')
                    Input(v-model='putData.name')
                FormItem(label='货柜描述')
                    Input(v-model='putData.desc')
                FormItem(label='货柜位置')
                    Input(v-model='putData.location')
                FormItem(label='是否启用Hybrid')
                    i-switch(v-model='putData.hybridEnable')
                        span(slot='open') 是
                        span(slot='close') 否
</template>

<script lang="ts">
    import Vue from 'vue';
    import {updateCabinet$, UpdateCabinetParams} from '@/api/cabinet';
    import {Component, Prop, Provide} from "vue-property-decorator";

    @Component({})
    export default class CabinetList extends Vue {
        @Prop() state!: any;
        @Prop() sortChange!: any;
        @Prop() defaultSort!: any;
        @Prop() params_id!: number;
        visible: boolean = false;
        rowData: any = undefined;
        putData: UpdateCabinetParams = {
            id: this.params_id,
            name: undefined,
            location: undefined,
            hybridEnable: undefined
        };

        load(row: any, data: any) {
            this.visible = true;
            this.rowData = row;
            this.putData = data;
        }

        close() {
            this.visible = false;
        }

        confirmHandle() {
            updateCabinet$({...this.putData}).subscribe({
                next: () => {
                    this.rowData.name = this.putData.name;
                    this.rowData.desc = this.putData.desc;
                    this.rowData.location = this.putData.location;
                    this.rowData.hybrid_enable = Number(this.putData.hybridEnable);
                    this.$Message.success('更新成功');
                    this.close();
                }
            });
        }
    }
</script>

<style scoped>
</style>
