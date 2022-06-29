import { DistrictResponse, ResponseCode, WorkflowStateCode } from '../../../../libs/client/typescript-ng';

export interface CodeTables {
  responseCode: ResponseCode[],
  district: DistrictResponse[],
  workflowStateCode: WorkflowStateCode[]
}
