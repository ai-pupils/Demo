<template>
    <div class="page-content">
        <GoBack></GoBack>
        <Card>
            <h6 slot="title">创建商品组</h6>
            <BundleForm type="create"></BundleForm>
        </Card>
    </div>
</template>
<script>
import GoBack from '../../components/shared/GoBack';
import BundleForm from './components/BundleForm';

export default {
  components: { BundleForm, GoBack }
};
</script>
