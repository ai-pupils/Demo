import _ from 'lodash';
import {
  CabinetRuntimeStatusTypes,
  CabinetStatusTypes,
  CabinetArchTypes
} from '@/const/data/v2/cabinet.ts';
import { getConstDataTypeLabel } from '@/utils/misc.ts';
import { CocList } from '../../const/data/coc.ts';

export const getCabinetArchTypesv2 = value =>
  (_.find(CabinetArchTypes, { id: value }) || {}).label;

export const getCabinetStatusTypesv2 = _.curry(getConstDataTypeLabel)(
  CabinetStatusTypes
);

export const getCabinetRuntimeStatusTypesv2 = _.curry(getConstDataTypeLabel)(
  CabinetRuntimeStatusTypes
);

export const CocFilter = val =>
  (_.find(CocList, { code: val }) || {}).name || val;
