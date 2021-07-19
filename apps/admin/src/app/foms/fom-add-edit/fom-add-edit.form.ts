import {minLength, prop, required} from '@rxweb/reactive-form-validators';
import {ProjectResponse, DistrictResponse, ForestClientResponse, WorkflowStateCode} from '@api-client';
import * as R from 'remeda';

const updateFields = [
  'name',
  'description',
  'commentingOpenDate',
  'commentingClosedDate',
  'fspId',
  'district',
  'forestClient',
  'workflowState'
] as const;

export class FomAddEditForm implements Pick<ProjectResponse,
  typeof updateFields[number]> {

  @prop()
  @required()
  @minLength({value: 5})
  name: string;


  @prop()
  description: string;

  @prop()
  commentingOpenDate: string = null; //new Date().toISOString();

  @prop({})
  commentingClosedDate: string = null; //new Date().toISOString();

  @prop()
  @required()
  @minLength({value: 1})

  fspId: number;

  @prop()
  @required()
  @minLength({value: 1})
  district: DistrictResponse;

  @prop()
  @required()
  @minLength({value: 1})
  forestClient: ForestClientResponse;

  @prop()
  workflowState: WorkflowStateCode;

  constructor(project?: Partial<ProjectResponse>) {
    if (project) {

      Object.assign(this, R.pick(project, updateFields));
    }
  }

}
