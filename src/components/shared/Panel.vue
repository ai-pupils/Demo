<style lang="less" type="text/less">
  .panel {
    position: relative;
    min-height: 200px;

    .overlay {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      background: #fff;
      opacity: 0.9;

      table {
        width: 100%;
        height: 100%;

        td {
          text-align: center;
          vertical-align: middle;
          .inner {
            display: inline-block;
          }
        }
      }

    }
  }
</style>
<template>
  <div class="panel">
    <div v-if="isOk">
      <slot></slot>
    </div>
    <div v-else class="overlay">
      <table>
        <tr>
          <td>
            <div class="inner">
              <slot name="loading" v-if="isFetching">
                <Spin></Spin>
              </slot>
              <slot name="empty" v-else-if="isGenericEmpty">
                <p class="empty-text">
                  <span class="text-muted"><i class="fa fa-trash-o"></i></span>
                  {{emptyMsg}}
                </p>
              </slot>
              <slot name="error" v-else-if="isError">
                <p class="empty-text">
                  <span class="text-danger"><i class="fa fa-remove"></i></span>
                  {{errorMsg}}
                </p>
              </slot>
            </div>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import _ from 'lodash';
  import Spin from 'iview/src/components/spin';

  export default {
    props: {
      loader: {},
      isEmpty: {default: false},
      emptyMsg: {type: String, default: '无数据'},
      errorMsg: {type: String, default: '加载错误'}
    },
    computed: {
      isFetching() {
        return (this.loader && this.loader.isFetching) || this.promise.loading;
      },
      isError() {
        return (this.loader && this.loader.isError) || this.promise.rejected;
      },
      isGenericEmpty() {
        return _.isArray(this.isEmpty) ? this.isEmpty.length === 0 : this.isEmpty;
      },
      isOk() {
        return !(this.isFetching || this.isGenericEmpty || this.isError);
      }
    },
    data() {
      return {
        promise: {}
      };
    },
    watch: {
      loader(val) {
        this.promise = {};
        if (val.then) {
          this.promise = {loading: true};
          val.then(r => {
            this.promise = {resolved: true};
            return r;
          }, e => {
            this.promise = {rejected: true};
            throw e;
          });
        }
      }
    },
    components: {Spin},
  };
</script>
