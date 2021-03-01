import _ from 'lodash';
import { parseQueryDate } from '@/utils/misc';

const exportCsv = (url, normalizer, target, params) => {
  const iframe = document.createElement('iframe');
  iframe.id = 'download-file-iframe';
  iframe.classList.add('hide');

  const form = document.createElement('form');
  form.target = iframe.id;
  form.method = 'POST';
  form.action = url;

  _.forIn(normalizer({...params, target}), (v, k) => {
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = k;
    input.value = v;

    form.appendChild(input);
  });

  iframe.appendChild(form);
  document.body.appendChild(iframe);
  form.submit();
  if (_.isFunction(iframe.remove)) {
    iframe.remove();
  } else {
    iframe.parentNode.removeChild(iframe);
  }
};

function commonNormalizeParams({from, to, keyword, isErrorOnly, verifyStatusChecked} = {}) {
  const parseDate = parseQueryDate(from, to);
  const startTime = parseDate.from;
  const endTime = parseDate.to;
  return {
    start_time: startTime,
    end_time: endTime,
    search_text: keyword ? String(keyword).trim() : keyword,
    is_error_only: isErrorOnly,
    verify_status: verifyStatusChecked
  };
}

const EXPORT_TRANSACTIONS_SKU = '/export/transactions/sku.csv';
export const exportTransactionsSku = _.curry(exportCsv)(EXPORT_TRANSACTIONS_SKU)(commonNormalizeParams)('');

const EXPORT_TRANSACTIONS = '/export/transactions.csv';
export const exportTransactions = _.curry(exportCsv)(EXPORT_TRANSACTIONS)(commonNormalizeParams)('');
