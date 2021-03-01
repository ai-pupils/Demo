<template>
  <div class="page-content">
    <GoBack></GoBack>
    <Card>
         <h6 slot="title">编辑商品</h6>
         <SkuForm type="update"></SkuForm>
    </Card>
  </div>
</template>

<script>
import GoBack from '../../components/shared/GoBack';
import SkuForm from './Form';

export default {
  components: { SkuForm, GoBack }
};
</script>

<style scoped>
</style>
