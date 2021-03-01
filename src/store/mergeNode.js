import _ from 'lodash';

export default function mergeNode(...arg) {
  const validNodes = _.filter(...arg, node => _.isObject(node) && node.isFulfill)
    .map(node => node.payload);
  if (validNodes.length > 0) {
    const result = _.reduce(validNodes, (node, res) => _.merge(res, _.clone(node)), {});
    return {payload: result, isFulfill: true};
  }

  return {isFulfill: false};
}
