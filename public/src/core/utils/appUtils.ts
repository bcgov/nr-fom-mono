import * as moment from 'moment';

/**
 * @class AppUtils
 */
export class AppUtils {
  static copy(obj: any) {
    // deep object copy
    return JSON.parse(JSON.stringify(obj));
  } 
}

export const getCommentingClosingDate = (commentingClosedDate: string) => {
    // Note: commenting_closingDate (inclusive) = commenting_closedDate (exclusive) - 1 day
    // The value should only be used for display, not to pass to backend.
    const commentingClosingDate = moment(commentingClosedDate).add(-1, 'd');
    return commentingClosingDate.format('YYYY-MM-DD')
}