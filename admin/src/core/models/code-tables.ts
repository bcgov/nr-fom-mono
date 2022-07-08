import { CommentScopeCode, DistrictResponse, ResponseCode, WorkflowStateCode } from '@api-client';

export interface CodeTables {
  responseCode: ResponseCode[],
  district: DistrictResponse[],
  workflowResponseCode: WorkflowStateCode[],
  commentScopeCode: CommentScopeCode[]
}
