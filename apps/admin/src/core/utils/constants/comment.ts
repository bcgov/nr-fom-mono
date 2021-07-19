import {ICodeGroup} from './interfaces';

/**
 * Comment Status codes.
 *
 * @export
 * @class CommentCodes
 * @implements {ICodeSet}
 */
export class CommentCodes {
  // Comment period does not exist
  public static readonly NOT_OPEN: ICodeGroup = {
    code: 'NOT_OPEN',
    param: 'NO',
    text: {long: 'Not Open For Commenting', short: 'Not Open'},
    mappedCodes: []
  };

  // Comment period will open in the future
  public static readonly NOT_STARTED: ICodeGroup = {
    code: 'NOT_STARTED',
    param: 'NS',
    text: {long: 'Commenting Not Started', short: 'Not Started'},
    mappedCodes: []
  };

  // Comment period is closed
  public static readonly CLOSED: ICodeGroup = {
    code: 'CLOSED',
    param: 'CL',
    text: {long: 'Commenting Closed', short: 'Closed'},
    mappedCodes: []
  };

  // Comment period is currently open
  public static readonly OPEN: ICodeGroup = {
    code: 'OPEN',
    param: 'OP',
    text: {long: 'Commenting Open', short: 'Open'},
    mappedCodes: []
  };

  /**
   * @inheritdoc
   * @memberof CommentCodes
   */
  public getCodeGroups = () => [
    CommentCodes.NOT_OPEN,
    CommentCodes.NOT_STARTED,
    CommentCodes.CLOSED,
    CommentCodes.OPEN
  ];
}
