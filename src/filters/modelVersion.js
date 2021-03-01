import _ from 'lodash';
import { ModelVersion } from '@/const/data/model';

export const getModelVersion = value =>
  (_.find(ModelVersion, { isDefault: value }) || {}).label;
