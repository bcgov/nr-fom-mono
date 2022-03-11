import { prop } from "@rxweb/reactive-form-validators";

export class PublicNoticeForm {

  projectId: number;

  publicNoticeId: number;

  @prop()
  reviewAddress: string;

  @prop()
  reviewBusinessHours: string;

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
}
