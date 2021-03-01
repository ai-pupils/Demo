import buildRequest from '@/utils/buildRequest';
import { DataResponse, PageType, SortType } from '@/interface';
import rxios from '@http';
import { apiPrefix } from '@/api/v2/apiVersion';
import { map } from 'rxjs/operators';
import Qs from 'qs';

export interface GetSkuIngressionTypesParams {}

export interface GetSkuIngressionTypesData {
  ingression_types: SkuIngressionTypes[];
}

export interface SkuIngressionTypes {
  id: number;
  image_example: string;
  name: string;
  vision_types: SkuVisionTypes[];
}

export interface SkuVisionTypes {
  detector_model_type: string;
  id: number;
  image_example: string;
  name: string;
  sku_ingression_type_id: number;
}

// 获取商品IngressionType信息
export const getSkuIngressionTypes$ = buildRequest<
  GetSkuIngressionTypesParams,
  DataResponse<GetSkuIngressionTypesData>
>(() => {
  return rxios
    .request({
      url: `${apiPrefix}/skus/ingression-types.fl`,
      method: 'GET'
    })
    .pipe(
      map((state: any) => {
        if (state.data && state.data.ingression_types) {
          state.data.ingression_types.forEach((type: any) => {
            type.selected = false;
            if (type.vision_types) {
              type.vision_types.forEach((type: any) => {
                type.selected = false;
              });
            }
          });
        }
        return state;
      })
    );
});

export interface GetSkuIngressionTasksParams extends PageType, SortType{
  visionId?: string,
  status?: string,
  keyword?: string
}
export interface GetSkuTasksData {}

// 获取Sku上新任务
export const getSkuIngressionTasks$ = buildRequest<
  GetSkuIngressionTasksParams,
  DataResponse<GetSkuTasksData>
>((params: GetSkuIngressionTasksParams) => {
  const { pageIndex, pageSize, visionId, status, keyword, order_by} = params;
  return rxios.request({
    url: `${apiPrefix}/skus/ingression/tasks.fl`,
    method: 'GET',
    params: {
      page: pageIndex && Number(pageIndex),
      page_size: pageSize ? Number(pageSize) : undefined,
      vision_id: visionId,
      order_by,
      keyword,
      status,
      sort_by: 'min_unreviewed_review_deadline',
      sort_direction: 'asc'
    }
  });
});


export interface GetSkuIngressionJobsParams {
  taskId?: string
}


export const getSkuIngressionJobs$ = buildRequest<GetSkuIngressionJobsParams, DataResponse>((params: GetSkuIngressionJobsParams) => {
  const {taskId} = params;
  return rxios.request({
    url: `${apiPrefix}/skus/ingression/tasks/${taskId}/jobs.fl`,
    method: 'GET'
  })
})

export interface getSkuIngressionPhotosParams {
  jobId : number
}

export const getSkuIngressionPhotos$ = buildRequest<getSkuIngressionPhotosParams, DataResponse>((params) => {
  const {jobId} = params;
  return rxios.request({
    url: `${apiPrefix}/skus/ingression/jobs/${jobId}/photos.fl`,
    method: 'GET'
  })
})

export interface reviewIngressionPhotoParams {
  photoId : number,
  reviewed_status: string,
  reviewed_comment: string,
  detected_result: any,
  hybrid: boolean,
  reviewer: string
}


export const reviewIngressionPhoto$ = buildRequest<reviewIngressionPhotoParams, DataResponse>((params) => {
  const {photoId,...others} = params;
  return rxios.request({
    url: `${apiPrefix}/skus/ingression/jobs/photos/${photoId}.fl`,
    method: 'POST',
    data: others
  })
})

export interface GetOneIngressionInstructionParams {
  id : number
}

export const getOneIngressionInstruction$ = buildRequest<GetOneIngressionInstructionParams, DataResponse>((params) => {
  const {id} = params;
  return rxios.request({
    url: `${apiPrefix}/skus/ingression/instructions/${id}.fl`,
    method: 'GET'
  })
})

export interface GetIngressionGuidesParams extends PageType {
  // 用于过滤某一个指令所关联的所有指南
  instructionId?: number
}

export const getIngressionGuides$ = buildRequest<GetIngressionGuidesParams, DataResponse>(params => {
  const {pageIndex, pageSize, instructionId} = params;
  return rxios.request({
    url: `${apiPrefix}/skus/ingression/guides.fl`,
    method: 'GET',
    params: {
      instruction_id: instructionId,
      page: pageIndex && Number(pageIndex),
      page_size: pageSize ? Number(pageSize) : undefined,
    }
  })
})

export interface PostNewIngressionGuideParams {
  name: string,
  creator: string
}
export const postNewIngressionGuide$ = buildRequest<PostNewIngressionGuideParams, DataResponse>(params => {
  return rxios.request({
    url: `${apiPrefix}/skus/ingression/guides.fl`,
    method: 'POST',
    data: params
  })
})


export interface GetOneIngressionGuideParams {
  guideId: number,
}

export const getOneGuide$ = buildRequest<GetOneInstructionParams, DataResponse>(params => {
  const {guideId} = params;
  return rxios.request({
    url: `${apiPrefix}/skus/ingression/guides/${guideId}.fl`,
    method: 'GET'
  })
})


export interface GetIngressionGuideDispatchParams {}

export const getIngressionGuideDispatch$ = buildRequest<GetIngressionGuideDispatchParams, DataResponse>(params => {
  return rxios.request({
    url: `${apiPrefix}/skus/ingression/guides/activate.fl`,
    method: 'GET'
  })
})

export interface NewIngressionGuideDispatchParams {
  guideId: number,
  ingressionType: number,
  visionId: string
}

export const newIngressionGuideDispatch$ = buildRequest<NewIngressionGuideDispatchParams, DataResponse>(params => {
  const {ingressionType, visionId, guideId} = params;
  return rxios.request({
    url: `${apiPrefix}/skus/ingression/guides/activate.fl`,
    method: 'PUT',
    data: {
      guide_id: guideId,
      ingression_type_id: ingressionType,
      vision_id: visionId
    }
  })
})


export interface GetExperimentalGuideDispatchParams {}

export const getExperimentalGuideDispatch$ = buildRequest<GetExperimentalGuideDispatchParams, DataResponse>(params => {
  return rxios.request({
    url: `${apiPrefix}/skus/ingression/experimental/guides/activate.fl`,
    method: 'GET'
  })
})

export interface NewExperimentalGuideDispatchParams {
  guideId: number,
  ingressionType: number,
  visionId: string
}

export const newExperimentalGuideDispatch$ = buildRequest<NewExperimentalGuideDispatchParams, DataResponse>(params => {
  const {ingressionType, visionId, guideId} = params;
  return rxios.request({
    url: `${apiPrefix}/skus/ingression/experimental/guides/activate.fl`,
    method: 'PUT',
    data: {
      guide_id: guideId,
      ingression_type_id: ingressionType,
      vision_id: visionId
    }
  })
})


export interface GetIngressionInstructionsParams extends PageType{
  layerIndex?: number
  keyword?: string
}

export const getIngressionInstructions$ = buildRequest<GetIngressionInstructionsParams, DataResponse>(params => {
  const {pageIndex, pageSize, layerIndex, keyword} = params;
  return rxios.request({
    url: `${apiPrefix}/skus/ingression/instructions.fl`,
    method: 'GET',
    params: {
      page: pageIndex && Number(pageIndex),
      page_size: pageSize ? Number(pageSize) : undefined,
      keyword,
      layer_index: layerIndex
    }
  })
})


export interface UpdateGuideParams {
  guideId: number,
  instructionIds?: Array<number>,
  name?: string,
  updater: string
}

export const updateGuide$ = buildRequest<UpdateGuideParams, DataResponse>(params => {
  const {guideId, instructionIds, updater, name} = params
  return rxios.request({
    url: `${apiPrefix}/skus/ingression/guides/${guideId}.fl`,
    method: 'PUT',
    data: {
      instruction_ids: instructionIds,
      updater,
      name
    }
  })
})

export interface GetOneInstructionParams {
  instructionId: number,
}

export const getOneInstruction$ = buildRequest<GetOneInstructionParams, DataResponse>(params => {
  const {instructionId} = params;
  return rxios.request({
    url: `${apiPrefix}/skus/ingression/instructions/${instructionId}.fl`,
    method: 'GET'
  })
})

export const UPLOAD_SKU_IMAGE_V2 = '/v2/skus/images/upload.fl';

export interface UpdateOneInstructionParams {
  instructionId: number,
  hints: string,
  imgs: Array<string>,
  name: string,
  updater: string
}
export const updateOneInstruction$ = buildRequest<UpdateOneInstructionParams, DataResponse>(params => {
  const {instructionId, imgs, ...others} = params;
  return rxios.request({
    url: `${apiPrefix}/skus/ingression/instructions/${instructionId}.fl`,
    method: 'PUT',
    data: {
      image_urls: imgs,
      ...others
    }
  })
})

export interface PostOneInstructionParams {
  hints: string,
  imgs: Array<string>,
  name: string,
  layerIndex: number,
  creator: string
}
export const postOneInstruction$ = buildRequest<PostOneInstructionParams, DataResponse>(params => {
  const {instructionId, imgs, layerIndex, ...others} = params;
  return rxios.request({
    url: `${apiPrefix}/skus/ingression/instructions.fl`,
    method: 'POST',
    data: {
      image_urls: imgs,
      layer_index: layerIndex,
      ...others
    }
  })
})

export interface ConfirmGuideParams {
  guideId: number,
  updater: string
}
export const confirmGuide$ = buildRequest<ConfirmGuideParams, DataResponse>(params => {
  const {guideId, updater} = params
  return rxios.request({
    url: `${apiPrefix}/skus/ingression/guides/${guideId}/confirm.fl`,
    method: 'POST',
    data: {
      updater
    }
  })
})
