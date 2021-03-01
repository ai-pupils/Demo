export const SkuPackageTypes: any[] = [
  {
    id: 'CAN',
    label: '罐装',
    color: 'rgba(102, 205, 0, 0.8)'
  },
  {
    id: 'BOTTLE',
    label: '瓶装',
    color: 'rgba(244, 164, 96, 0.9)'
  },
  {
    id: 'BOX',
    label: '盒装',
    color: 'rgba(123, 104, 238, 0.8)'
  },
  {
    id: 'BAG',
    label: '袋装',
    color: 'rgba(145, 213, 255, 1)'
  },
  {
    id: 'BOWL',
    label: '碗装',
    color: 'rgba(255, 69, 0, 0.8)'
  },
  {
    id: 'DRUM',
    label: '桶装',
    color: 'rgba(0, 139, 139, 0.8)'
  },
  {
    id: 'CUP',
    label: '杯装',
    color: 'rgba(218, 165, 32,1)'
  },
  {
    id: 'OTHERS',
    label: '其他',
    color: 'rgba(105, 105, 105, 0.8)'
  }
];

export const SkuTypes: any[] = [
  {
    id: 'DRINK',
    label: '饮料类'
  },
  {
    id: 'SNACK',
    label: '零食类'
  },
  {
    id: 'CONDIMENT',
    label: '调味品'
  },
  {
    id: 'OTHERS',
    label: '其他'
  }
];

export const SkuBarcodeTypes: any[] = [
  {
    id: 'customized',
    label: '散装/自定义商品'
  },
  {
    id: 'standard',
    label: '标准包装商品'
  }
];

export const SkuStatus: any[] = [
  {
    id: 'available',
    label: '可用'
  },
  {
    id: 'offline',
    label: '已暂停'
  }
];

export const reviewedStatus: any[] = [
  {
    id: 'unreviewed',
    label: '待审核'
  },
  {
    id: 'accepted',
    label: '审核通过'
  },
  {
    id: 'rejected',
    label: '审核未通过'
  }
];

export const skuRefusedReason: any = {
  sku_info_error: {
    value: 'sku_info_error',
    label: '商品信息有误'
  },
  sku_appearance_error: {
    value: 'sku_appearance_error',
    label: '图片模糊不清'
  },
  mismatch: {
    value: 'mismatch',
    label: '商品信息与图片不一致'
  }
};

export const proposalHdImageMap: string[] = [
  'front_url',
  'back_url',
  'left_url',
  'right_url',
  'top_url',
  'bottom_url'
];

export const SkuTypeAndSkuPackageTypeRelation: any = {
  SNACK: [
    {
      id: 'CAN',
      label: '罐装'
    },
    {
      id: 'BOX',
      label: '盒装'
    },
    {
      id: 'BAG',
      label: '袋装'
    },
    {
      id: 'BOWL',
      label: '碗装'
    },
    {
      id: 'DRUM',
      label: '桶装'
    },
    {
      id: 'CUP',
      label: '杯装'
    },
    {
      id: 'OTHERS',
      label: '其他'
    }
  ],
  DRINK: [
    {
      id: 'CAN',
      label: '罐装'
    },
    {
      id: 'BOTTLE',
      label: '瓶装'
    },
    {
      id: 'BOX',
      label: '盒装'
    },
    {
      id: 'OTHERS',
      label: '其他'
    }
  ],
  CONDIMENT: [
    {
      id: 'CAN',
      label: '罐装'
    },
    {
      id: 'BOTTLE',
      label: '瓶装'
    },
    {
      id: 'BOX',
      label: '盒装'
    },
    {
      id: 'OTHERS',
      label: '其他'
    }
  ],
  OTHERS: [
    {
      id: 'OTHERS',
      label: '其他'
    }
  ]
};
