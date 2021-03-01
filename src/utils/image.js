import _ from 'lodash';
import StandardError from 'standard-error';
import {BASE64_FEATURE} from '@/const/regex';
import {adjustImgOrientation} from '@/store/api/image';
import EXIF from './exif';

/* eslint-disable import/prefer-default-export */
/* eslint-disable no-mixed-operators */
/* eslint-disable default-case */

const REGEX_IMG = /image\/\w+/;

function getImgData(img, dir) {
  let degree = 0;
  let drawWidth;
  let drawHeight;
  let width;
  let height;

  drawWidth = img.width;
  drawHeight = img.height;
  // 以下改变一下图片大小
  let maxSide = Math.max(drawWidth, drawHeight);
  if (maxSide > 1024) {
    let minSide = Math.min(drawWidth, drawHeight);
    minSide = minSide / maxSide * 1024;
    maxSide = 1024;
    if (drawWidth > drawHeight) {
      drawWidth = maxSide;
      drawHeight = minSide;
    } else {
      drawWidth = minSide;
      drawHeight = maxSide;
    }
  }
  const canvas = document.createElement('canvas');
  canvas.width = width = drawWidth;
  canvas.height = height = drawHeight;
  const context = canvas.getContext('2d');
  // 判断图片方向，重置canvas大小，确定旋转角度，iphone默认的是home键在右方的横屏拍摄方式
  switch (dir) {
    // iphone横屏拍摄，此时home键在左侧
    case 3:
      degree = 180;
      drawWidth = -width;
      drawHeight = -height;
      break;
    // iphone竖屏拍摄，此时home键在下方(正常拿手机的方向)
    case 6:
      canvas.width = height;
      canvas.height = width;
      degree = 90;
      drawWidth = width;
      drawHeight = -height;
      break;
    // iphone竖屏拍摄，此时home键在上方
    case 8:
      canvas.width = height;
      canvas.height = width;
      degree = 270;
      drawWidth = -width;
      drawHeight = height;
      break;
  }
  // 使用canvas旋转校正
  context.rotate(degree * Math.PI / 180);
  context.drawImage(img, 0, 0, drawWidth, drawHeight);
  return canvas;
}

/* eslint-disable consistent-return */
const loadUrl = (url, serviceId) => new Promise((resolve, reject) => {
  if (BASE64_FEATURE.test(url)) {
    resolve(url);
    return undefined;
  }

  const img = new Image();

  img.onload = () => {
    resolve(
      adjustImgOrientation(url, serviceId).then(res => res.data.rotated ? res.data.image_url : url)
    );
  };
  img.onerror = () => {
    reject(new StandardError({status: 400, message: '无法加载图片'}));
  };
  img.src = url;
});

const loadLocalImage = file => new Promise((resolve, reject) => {
  if (!_.isNil(file) && (file instanceof File) && REGEX_IMG.test(file.type)) {
    EXIF.getData(file, function parseData() {
      const orientation = EXIF.getTag(this, 'Orientation');

      const reader = new FileReader();
      reader.addEventListener('load', (e) => {
        const image = new Image();
        image.src = e.target.result;
        image.onload = () => {
          const canvas = getImgData(image, orientation);
          const imageData = canvas.toDataURL('image/jpeg', 1);
          resolve(imageData);
        };
      }, false);
      reader.readAsDataURL(file);
    });
  } else {
    reject(new StandardError({
      status: '403',
      msg: 'File could not be convert to IMAGE data.'
    }));
  }
});

export const loadImage = _.memoize((target, serviceId) =>
  (target instanceof File ? loadLocalImage : loadUrl)(target, serviceId)
);
