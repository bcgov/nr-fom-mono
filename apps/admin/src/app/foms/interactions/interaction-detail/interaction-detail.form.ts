import { minLength, prop, required } from "@rxweb/reactive-form-validators"
import { InteractionResponse } from '@api-client';
import * as R from 'remeda';

const UPDATE_FIELDS = ['stakeholder', 'communicationDate', 'communicationDetails'] as const;

export class InteractionDetailForm implements Pick<InteractionRequest, typeof UPDATE_FIELDS[number]> {
  @prop()
  stakeholder: string = '';

  @prop()
  communicationDate: string = new Date().toISOString();

  @required()
  @minLength({value: 1})
  @prop()
  communicationDetails: string = '';

  @prop()
  filename: string = null;

  @prop()
  fileContent: any = null;

  constructor(interaction: InteractionResponse) {
    if (interaction) {
      Object.assign(this, R.pick(interaction, UPDATE_FIELDS));
    }
  }

}

export interface InteractionRequest { 
  projectId: number;
  stakeholder: string;
  communicationDate: string;
  communicationDetails: string;
  revisionCount: number;

  filename: string;
  fileContent: any;
}
