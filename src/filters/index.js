import _ from 'lodash';

export * from './statusType';
export * from './v2/statusType';
export * from './v3/statusType';
export { getModelVersion } from './modelVersion';

export const emptyText = (value, placeholder) => {
  if (_.isNil(value) && _.isNil(placeholder)) {
    return '--';
  }
  if (!_.isNil(placeholder)) {
    return placeholder;
  }
  return value;
};

export const empty = (value, placeholder) => {
  if (_.isNil(value) || value === '' || _.isNaN(value)) {
    return placeholder || '--';
  }

  return value;
};

export const fmtPrice = (
  price,
  type // 0把元变成分, 1把分变成元
) => {
  if (typeof price === 'string') {
    if (_.isNaN(Number(price))) {
      return empty('');
    }
    price = Number(price);
  } else if (_.isNil(price)) {
    return empty('');
  }

  return _.ceil(_[type === 1 ? 'divide' : 'multiply'](price, 100), 2);
};
