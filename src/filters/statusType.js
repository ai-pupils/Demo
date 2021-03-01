import _ from 'lodash';
import {
  SkuPackageTypes,
  SkuBarcodeTypes,
  SkuTypes,
} from '@/const/data/sku.ts';
import { ModelServiceTypes } from '@/const/data/model';
import { AnomaliesStatus } from '@/const/data/anomalies';
import {
  CabinetRuntimeStatusTypes,
  CabinetStatusTypes,
  CabinetArchTypes,
  CabinetTemperatureTypes
} from '@/const/data/cabinet';
import { CrainingTaskStatusTypes } from '@/const/data/trainingTaskStatusTypes.ts';
import {
  CabinetFaultTypes,
  CabinetFaultResovedStatus,
  CabinetFaultSource,
  CabinetFaultStatus
} from '@/const/data/cabinetFault.ts';
import { getConstDataTypeLabel } from '@/utils/misc.ts';
import { booleanType } from '@/const/data/common.ts';
import {
  skuBundleReviewedStatus,
  skuBundleStatus,
  skuBundleOperationStatus
} from '@/const/data/sku-bundle.ts';
import { ExceptionPriorities } from '@/const/data/monitor.ts';
import {PatrolStatus} from '@/const/data/patrol';
import {taskStatus} from '@/const/data/skuIngression.js';

export const getSkuPackageTypes = value =>
  (_.find(SkuPackageTypes, { id: value }) || {}).label;

export const getSkuPackageTypeColors = value =>
  (_.find(SkuPackageTypes, { id: value }) || {}).color;

export const getSkuTypes = value =>
  (_.find(SkuTypes, { id: value }) || {}).label;

export const getSkuBarcodeTypes = value =>
  (_.find(SkuBarcodeTypes, { id: value }) || {}).label;

export const getModelServiceTypes = value =>
  (_.find(ModelServiceTypes, { id: value }) || {}).label;

export const getAnomalyStatusTypes = value =>
  (_.find(AnomaliesStatus, { id: value }) || {}).label;

export const getCabinetRuntimeStatusTypes = value =>
  (_.find(CabinetRuntimeStatusTypes, { id: value }) || {}).label;

export const getCabinetStatusTypes = value =>
  (_.find(CabinetStatusTypes, { id: value }) || {}).label;

export const getCabinetArchTypes = value =>
  (_.find(CabinetArchTypes, { id: value }) || {}).label;

export const getTrainingTaskStatusTypes = (value, field) =>
  (_.find(CrainingTaskStatusTypes, { id: value }) || {}).label[field];

export const getCabinetFaultTypes = value =>
  (_.find(CabinetFaultTypes, { id: value }) || {}).label;

export const getCabinetFaultResovedStatus = value =>
  (_.find(CabinetFaultResovedStatus, { id: value }) || {}).label;

export const getCabinetFaultSourceFilter = _.curry(getConstDataTypeLabel)(
  CabinetFaultSource
);

export const getBooleanTypeFilter = value =>
  (_.find(booleanType, { id: value }) || {}).label;

export const getCabinetFaultStatusFilter = value =>
  (_.find(CabinetFaultStatus, { id: value }) || {}).label;

export const getSkuBundleReviewedStatusFilter = value =>
  (_.find(skuBundleReviewedStatus, { id: value }) || {}).label;

export const getSkuBundleReviewedColorFilter = value =>
  (_.find(skuBundleReviewedStatus, { id: value }) || {}).color;

export const getCabinetTemperatureTypesFilter = value =>
  (_.find(CabinetTemperatureTypes, { id: value }) || {}).color;

export const getSkuBundleStatusTypesFilter = value =>
  (_.find(skuBundleStatus, { id: value }) || {}).label;

export const getSkuBundleStatusColorFilter = value =>
  (_.find(skuBundleStatus, { id: value }) || {}).color;

export const getSkuTaskStatusFilter = value =>
  (_.find(taskStatus, { value }) || {}).label;

export const getSkuBundleOperationStatusFilter = value =>
  (_.find(skuBundleOperationStatus, { id: value }) || {}).label;

export const getExceptionPrioritiesLabelFilter = value =>
  (_.find(ExceptionPriorities, { id: value }) || {}).label;

export const getExceptionPrioritiesColorFilter = value =>
  (_.find(ExceptionPriorities, { id: value }) || {}).color;

export const patrolStatusFilter = value =>
  (_.find(PatrolStatus, { id: value }) || {}).label;
