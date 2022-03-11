import { prop } from "@rxweb/reactive-form-validators";
import * as R from 'remeda';
export class PublicNoticeForm {

  projectId: number;

  publicNoticeId: number;

  @prop()
  reviewFOMAddress: string;

  @prop()
  reviewFOMBusinessHours: string;

  @prop()
  sameAsReviewInd: boolean;

  @prop()
  receiveCommentsAddress: string;

  @prop()
  receiveCommentsBusinessHours: string;

  @prop()
  mailingAddress: string;

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
