import Mock from 'mockjs';
// import { getSkuBundleReviewedResults } from './sku-bundle';
// import { getAnomalies } from './anomalies';
// import { postSnapshot, getSnapshot } from './snapshots';

if (process.env.NODE_ENV !== 'production') {
  Mock.setup({
    timeout: 800
  });

  // Mock.mock(/\/skus.fl/, 'get', getSkus);
  // Mock.mock(/\/anomalies.fl/, 'get', getAnomalies);
  // Mock.mock(/\/snapshots\/cabinets\/\w+.fl/, 'post', postSnapshot);
  // Mock.mock(/\/snapshots.fl/, 'get', getSnapshot);
  // Mock.mock(/\/bundle\/[0-9]*\/review.fl/, 'get', getSkuBundleReviewedResults);
}
