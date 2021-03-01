export const GUIDE_STATUS_INITIAL = 'initial'
export const GUIDE_STATUS_CONFIRMED = 'confirmed'

export const GUIDE_STATUS = {
  [GUIDE_STATUS_INITIAL]: {
    label: '未确认',
    color: 'default'
  },
  [GUIDE_STATUS_CONFIRMED]: {
    label: '已确认',
    color: 'green'
  }
}
