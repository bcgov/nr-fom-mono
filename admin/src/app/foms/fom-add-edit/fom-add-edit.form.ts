import { DistrictResponse, ForestClientResponse, ProjectResponse, WorkflowStateCode } from '@api-client';
import { minLength, prop, required, minDate } from '@rxweb/reactive-form-validators';
import moment = require("moment");
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
  @required({message: 'FOM Name is required.'})
  @minLength({value: 5, message: 'Minimum length is 5'})
  name: string;

  @prop()
  @required({message: 'FOM Description is required.'})
  description: string;

  @prop()
  commentingOpenDate: string = null; 

  @prop({})
  commentingClosedDate: string = null; 

  @prop()
  @required({message: 'FSP ID is required.'})
  @minLength({value: 1})
  fspId: number;

  @prop()
  @required({message: 'District is required.'})
  @minLength({value: 1})
  district: DistrictResponse;

  @prop()
  @required({message: 'FOM Holder is required.'})
  @minLength({value: 1})
  forestClient: ForestClientResponse;

  @prop()
  workflowState: WorkflowStateCode;

  // Special case. It is at form control, but will be convert into request body for 'operationStartYear' (number).
  @required({message: 'Start of Operations Year is required.'})
  @prop()
  opStartDate: Date;

  // Special case. It is at form control, but will be convert into request body for 'operationEndYear' (number).
  @required({message: 'Operation End Year is required.'})
  @minDate({fieldName:'opStartDate', message: 'Must be equal to or later than the Start of Operations'})
  @prop()
  opEndDate: Date;

  constructor(project?: Partial<ProjectResponse>) {
    if (project) {

      Object.assign(this, R.pick(project, updateFields));
    }

    this.initProposedOperations(project);
  }

  initProposedOperations(project: Partial<ProjectResponse>) {
    // Extra conversion for form: 'opStartDate' and 'opEndDate'
    if (project?.operationStartYear) {
      this.opStartDate = moment().set('year', project.operationStartYear)
                                  .set('date', 1) // Does not matter for date, but set to first day for consistency later for comparison.
                                  .toDate();
    }
    // Setting default year 
    else {
      this.opStartDate = moment().set('date', 1)
                                  .toDate();
    }

    if (project?.operationEndYear) {
      this.opEndDate = moment().set('year', project.operationEndYear)
                                  .set('date', 1) // Does not matter for date, but set to first day for consistency later for comparison.
                                  .toDate();
    }
  }

}
