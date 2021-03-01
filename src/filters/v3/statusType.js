import _ from 'lodash';
import {
  CabinetRuntimeStatusTypes,
  CabinetStatusTypes,
  CabinetArchTypes
} from '@/const/data/v3/cabinet.ts';
import { CabinetKeyStatus } from '@/const/data/v3/license.ts';
import { getConstDataTypeLabel } from '@/utils/misc.ts';
import { CocList } from '@/const/data/coc.ts';

export const getCabinetArchTypesV3 = value =>
  (_.find(CabinetArchTypes, { id: value }) || {}).label;

export const getCabinetStatusTypesV3 = _.curry(getConstDataTypeLabel)(
  CabinetStatusTypes
);

export const getCabinetRuntimeStatusTypesV3 = _.curry(getConstDataTypeLabel)(
  CabinetRuntimeStatusTypes
);

export const CocFilterV3 = val =>
  (_.find(CocList, { code: val }) || {}).name || val;

export const getCabinetKeyStatus = _.curry(getConstDataTypeLabel)(
  CabinetKeyStatus
);

export const getCabinetKeyStatusColor = value =>
  (_.find(CabinetKeyStatus, { id: value }) || {}).color;
