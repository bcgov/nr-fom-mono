import { email, notEmpty, prop, required } from "@rxweb/reactive-form-validators";
import * as R from 'remeda';
export class PublicNoticeForm {

  projectId: number;

  publicNoticeId: number;

  @required({message: 'Address for Review FOM is required.'})
  @notEmpty({message: 'Address for Review FOM can not be empty'})
  @prop()
  reviewFOMAddress: string;

  @required({message: 'Business Hours for Review FOM is required.'})
  @notEmpty({message: 'Business Hours for Review FOM can not be empty'})
  @prop()
  reviewFOMBusinessHours: string;

  @required({message: 'Receive Comments Same as Review Checkbox is required.'})
  @prop()
  sameAsReviewInd: boolean;
  
  @required({
    conditionalExpression:x => x.sameAsReviewInd === false,
    message: 'Comments Address for Receive FOM is required.'
  })
  @notEmpty({
    conditionalExpression:x => x.sameAsReviewInd === false,
    message: 'Comments Address for Receive FOM can not be empty.'
  })
  @prop()
  receiveCommentsAddress: string;

  @required({
    conditionalExpression:x => x.sameAsReviewInd === false,
    message: 'Business Hours for Receive FOM is required.'
  })
  @notEmpty({
    conditionalExpression:x => x.sameAsReviewInd === false,
    message: 'Business Hours for Receive FOM can not be empty'
  })
  @prop()
  receiveCommentsBusinessHours: string;

  @required({message: 'Mailing Address is required.'})
  @notEmpty({message: 'Mailing Address can not be empty'})
  @prop()
  mailingAddress: string;

  @required({message: 'Email is required.'})
  @email({message: 'Email format is invalid.'})
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
