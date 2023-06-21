import { PublicNoticeResponse } from "@api-client";
import { email, minDate, notEmpty, prop, required } from "@rxweb/reactive-form-validators";
import moment = require("moment");
import * as R from 'remeda';
export class PublicNoticeForm {

  projectId: number;

  publicNoticeId: number;

  @required({message: 'Address to Review FOM is required.'})
  @notEmpty({message: 'Address to Review FOM can not be empty.'})
  @prop()
  reviewAddress: string;

  @required({message: 'Business Hours to Review FOM is required.'})
  @notEmpty({message: 'Business Hours to Review FOM can not be empty.'})
  @prop()
  reviewBusinessHours: string;

  @required({message: 'Receive Comments Same as Review Checkbox is required.'})
  @prop()
  isReceiveCommentsSameAsReview: boolean = false;
  
  @required({
    conditionalExpression:x => x.isReceiveCommentsSameAsReview === false,
    message: 'Address to Receive Comments is required.'
  })
  @notEmpty({
    conditionalExpression:x => x.isReceiveCommentsSameAsReview === false,
    message: 'Address to Receive Comments can not be empty.'
  })
  @prop()
  receiveCommentsAddress: string;

  @required({
    conditionalExpression:x => x.isReceiveCommentsSameAsReview === false,
    message: 'Business Hours to Receive Comments is required.'
  })
  @notEmpty({
    conditionalExpression:x => x.isReceiveCommentsSameAsReview === false,
    message: 'Business Hours to Receive Comments can not be empty.'
  })
  @prop()
  receiveCommentsBusinessHours: string;

  @required({message: 'Mailing Address is required.'})
  @notEmpty({message: 'Mailing Address can not be empty.'})
  @prop()
  mailingAddress: string;

  @required({message: 'Email is required.'})
  @email({message: 'Email format is invalid.'})
  @prop()
  email: string;

  // Special case. It is at form control, but will be convert into request body for 'operationStartYear' (number).
  @required({message: 'Start of Operations Year is required.'})
  @prop()
  opStartDate: Date;

  // Special case. It is at form control, but will be convert into request body for 'operationEndYear' (number).
  @required({message: 'Operation End Year is required.'})
  @minDate({fieldName:'opStartDate', message: 'Must be equal to or later than the Start of Operations'})
  @prop()
  opEndDate: Date;

  @prop()
  postDate: string = null; 

  constructor(publicNoticeResponse?: PublicNoticeResponse) {
    const pn = publicNoticeResponse;
    if (pn) {
      // Pick the field to instantiate.
      Object.assign(this, R.pick(pn, 
        [
          'projectId',
          'id',
          'reviewAddress',
          'reviewBusinessHours',
          'isReceiveCommentsSameAsReview',
          'receiveCommentsAddress',
          'receiveCommentsBusinessHours',
          'mailingAddress',
          'email',
          'postDate'
        ]
      ));
    }

    this.initProposedOperations(pn);
  }

  initProposedOperations(pn: PublicNoticeResponse) {
    // Extra conversion for form: 'opStartDate' and 'opEndDate'
    if (pn?.operationStartYear) {
      this.opStartDate = moment().set('year', pn.operationStartYear)
                                  .set('date', 1) // Does not matter for date, but set to first day for consistency later for comparison.
                                  .toDate();
    }
    // Setting default year 
    else {
      this.opStartDate = moment().set('date', 1)
                                  .toDate();
    }

    if (pn?.operationEndYear) {
      this.opEndDate = moment().set('year', pn.operationEndYear)
                                  .set('date', 1) // Does not matter for date, but set to first day for consistency later for comparison.
                                  .toDate();
    }
  }
}
