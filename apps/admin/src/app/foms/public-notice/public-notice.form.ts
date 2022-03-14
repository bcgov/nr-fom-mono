import { email, prop, required } from "@rxweb/reactive-form-validators";
import * as R from 'remeda';
export class PublicNoticeForm {

  projectId: number;

  publicNoticeId: number;

  @required()
  @prop()
  reviewFOMAddress: string;

  @required()
  @prop()
  reviewFOMBusinessHours: string;

  @required()
  @prop()
  sameAsReviewInd: boolean;

  @prop()
  receiveCommentsAddress: string;

  @prop()
  receiveCommentsBusinessHours: string;

  @required()
  @prop()
  mailingAddress: string;

  @required()
  @email()
  @prop()
  email: string;

  constructor(publicNoticeResponse?: any) {
    if (publicNoticeResponse) {
      // Pick the field to instantiate.
      Object.assign(this, R.pick(publicNoticeResponse, 
        [
          'projectId',
          'publicNoticeId',
          'reviewFOMAddress',
          'reviewFOMBusinessHours',
          'sameAsReviewInd',
          'receiveCommentsAddress',
          'receiveCommentsBusinessHours',
          'mailingAddress',
          'email'
        ]
      ));
    }
  }
}
