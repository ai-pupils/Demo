const DL_HOST_REGEX = /^https?:\/\/(productai|oss)-downloader\.(productai\.cn|oss-cn-hangzhou\.aliyuncs\.com)(\/.+)/i;
const DL_HOST_REGEX2 = /^https?:\/\/oss-cn-hangzhou\.aliyuncs\.com\/(productai|oss)-downloader(\/.+)/i;
const PQ_HOST_REGEX = /^https?:\/\/oss-cn-hangzhou\.aliyuncs\.com\/productai-query(\/.+)/i;
const PQ_HOST_REGEX2 = /^https?:\/\/productai-query\.oss-cn-hangzhou\.aliyuncs\.com(\/.+)/i;

export const escapeImg = (url) => {
  let host = null;
  let path = null;

  switch (true) {
    case (DL_HOST_REGEX.test(url)):
      host = 'productai-downloader';
      path = DL_HOST_REGEX.exec(url)[3];
      break;
    case (DL_HOST_REGEX2.test(url)):
      host = 'productai-downloader';
      path = DL_HOST_REGEX2.exec(url)[2];
      break;
    case (PQ_HOST_REGEX.test(url)):
      host = 'productai-query';
      path = PQ_HOST_REGEX.exec(url)[1];
      break;
    case (PQ_HOST_REGEX2.test(url)):
      host = 'productai-query';
      path = PQ_HOST_REGEX2.exec(url)[1];
      break;
    default:
      return url;
  }

  const WEBAPP_HOST = 'https://webapp.productai.cn';
  // const WEBAPP_HOST = 'http://10.10.4.208:8800';
  return `${WEBAPP_HOST}/oss/${host}${path}`;
};

export default {
  install(Vue) {
    Vue.filter('escapeImg', escapeImg);
  }
};
