<template>
  <div>
    <template v-if="hasBreadcrumb">
      <Breadcrumb :replace="true">
        <template v-for="item in breadcrumb">
          <BreadcrumbItem :href="item.href">
            <i :class="`fa fa-${item.icon}`" v-if="item.hasIcon"></i>
            <span>{{item.title}}</span>
          </BreadcrumbItem>
        </template>
      </Breadcrumb>
    </template>
  </div>
</template>

<script type="text/ecmascript-6">
  import _ from 'lodash';

  export default {
    computed: {
      hasBreadcrumb() {
        return false;
      },
      breadcrumb() {
        const {$route} = this;
        return _($route.matched)
          .filter(item => _.isNil(item.redirect) || item.redirect.name !== $route.name)
          .map(item => ({
            title: item.meta.title,
            icon: item.meta.icon,
            hasIcon: _.isString(item.meta.icon),
            href: this.$router.resolve(item.name).path
          }))
          .value();
      }
    }
  };
</script>
