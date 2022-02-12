import {LandUseTypeCodes, ReasonCodes, RegionCodes, StatusCodes} from './application';
import {ICodeGroup, ICodeSet} from './interfaces';
import { SpatialObjectCodeEnum } from '@api-client';

export const MAX_FILEUPLOAD_SIZE = { // as MB
  SPATIAL: 30,
  DOCUMENT: 30
};

/**
 * Enum of supported code sets.
 *
 * @export
 * @enum {number}
 */
export enum CodeType {
  STATUS,
  REASON,
  REGION,
  LANDUSETYPE,
  COMMENT
}

export enum COMMENT_SCOPE_CODE {
  OVERALL = 'OVERALL',
  CUT_BLOCK = 'CUT_BLOCK',
  ROAD_SECTION = 'ROAD_SECTION'
}

export type CommentScopeOpt = {
  commentScopeCode: COMMENT_SCOPE_CODE,
  desc: string,
  name: string, 
  scopeId: number
};

export const SpatialTypeMap = new Map<SpatialObjectCodeEnum, object>([
  [SpatialObjectCodeEnum.CutBlock, {
    source: 'cut_block',
    type: 'Polygon',
    desc: 'Cut Block'
  }],
  [SpatialObjectCodeEnum.RoadSection, {
    source: 'road_section',
    type: 'LineString',
    desc: 'Road Section'
  }],
  [SpatialObjectCodeEnum.Wtra, {
    source: 'retention_area',
    type: 'Polygon',
    desc: 'Retention Area'
  }],
]);

/**
 * Util methods for fetching codes and their various pieces of related information.
 *
 * @export
 * @class ConstantUtils
 */
export class ConstantUtils {

  public static PROJECT_ID_PARAM_KEY: string = 'appId';

  /**
   * Returns the code set that matches the given code type, or null if no match found.
   *
   * @static
   * @param {CodeType} codeType which group of codes to return.
   * @returns {ICodeSet}
   * @memberof ConstantUtils
   */
  public static getCodeSet(codeType: CodeType): ICodeSet {
    switch (codeType) {
      case CodeType.STATUS:
        return new StatusCodes();
      case CodeType.REASON:
        return new ReasonCodes();
      case CodeType.REGION:
        return new RegionCodes();
      case CodeType.LANDUSETYPE:
        return new LandUseTypeCodes();
      case CodeType.COMMENT:
        return new CommentCodes();
      default:
        return null;
    }
  }

  /**
   * Returns the code group for the given code type and search string, or null if none found.
   *
   * This should only be used if you need to handle dynamic codes.
   * If you know exactly what code you need, reference it directly.
   *
   * @static
   * @param {CodeType} codeType which group of codes to search for a possible match.
   * @param {string} searchString either a group, code, long, short, or mapped status string. (case insensitive)
   * @returns {ICodeGroup}
   * @memberof ConstantUtils
   */
  public static getCodeGroup(codeType: CodeType, searchString: string): ICodeGroup {
    if (!searchString) {
      return null;
    }

    const codeSet: ICodeSet = this.getCodeSet(codeType);

    if (!codeSet) {
      return null;
    }

    const codeGroups = codeSet.getCodeGroups();

    for (const codeGroup of codeGroups) {
      searchString = searchString.toUpperCase();
      if (
        codeGroup.code.toUpperCase() === searchString ||
        codeGroup.param.toUpperCase() === searchString ||
        codeGroup.text.long.toUpperCase() === searchString ||
        codeGroup.text.short.toUpperCase() === searchString ||
        codeGroup.mappedCodes.map(code => code.toUpperCase()).includes(searchString)
      ) {
        return codeGroup;
      }
    }

    return null;
  }

  /**
   * Returns the code groups code value.
   *
   * @static
   * @param {CodeType} codeType which group of codes to search for a possible match.
   * @param {string} searchString either a group, code, long, short, or mapped status string.
   * @returns {string}
   * @memberof ConstantUtils
   */
  static getCode(codeType: CodeType, searchString: string): string {
    if (!searchString) {
      return null;
    }

    const codeGroup: ICodeGroup = this.getCodeGroup(codeType, searchString);

    if (!codeGroup) {
      return null;
    }

    return codeGroup.code;
  }

  /**
   * Returns the code groups param value.
   *
   * @static
   * @param {CodeType} codeType which group of codes to search for a possible match.
   * @param {string} searchString either a group, code, long, short, or mapped status string.
   * @returns {string}
   * @memberof ConstantUtils
   */
  static getParam(codeType: CodeType, searchString: string): string {
    if (!searchString) {
      return null;
    }

    const codeGroup: ICodeGroup = this.getCodeGroup(codeType, searchString);

    if (!codeGroup) {
      return null;
    }

    return codeGroup.param;
  }

  /**
   * Returns the code groups short string.
   *
   * @static
   * @param {CodeType} codeType which group of codes to search for a possible match.
   * @param {string} searchString either a group, code, long, short, or mapped status string.
   * @returns {string}
   * @memberof ConstantUtils
   */
  static getTextShort(codeType: CodeType, searchString: string): string {
    if (!searchString) {
      return null;
    }

    const codeGroup: ICodeGroup = this.getCodeGroup(codeType, searchString);

    if (!codeGroup) {
      return null;
    }

    return codeGroup.text.short;
  }

  /**
   * Returns teh code groups long string.
   *
   * @static
   * @param {CodeType} codeType which group of codes to search for a possible match.
   * @param {string} searchString either a group, code, long, short, or mapped status string.
   * @returns {string}
   * @memberof ConstantUtils
   */
  static getTextLong(codeType: CodeType, searchString: string): string {
    if (!searchString) {
      return null;
    }

    const codeGroup: ICodeGroup = this.getCodeGroup(codeType, searchString);

    if (!codeGroup) {
      return null;
    }

    return codeGroup.text.long;
  }

  /**
   * Returns an array of mapped strings associated with the code.
   *
   * @static
   * @param {CodeType} codeType which group of codes to search for a possible match.
   * @param {string} searchString either a group, code, long, short, or mapped status string.
   * @returns {string[]}
   * @memberof ConstantUtils
   */
  static getMappedCodes(codeType: CodeType, searchString: string): string[] {
    if (!searchString) {
      return null;
    }

    const codeGroup: ICodeGroup = this.getCodeGroup(codeType, searchString);

    if (!codeGroup) {
      return null;
    }

    return codeGroup.mappedCodes;
  }

  static getCommentScopeCodeOrDesc(source: string, forCode: boolean): COMMENT_SCOPE_CODE | string {
    switch(source) {
      case SpatialTypeMap.get(SpatialObjectCodeEnum.CutBlock)['source'].toLowerCase():
        return forCode? COMMENT_SCOPE_CODE.CUT_BLOCK: SpatialTypeMap.get(SpatialObjectCodeEnum.CutBlock)['desc'];

      case SpatialTypeMap.get(SpatialObjectCodeEnum.RoadSection)['source'].toLowerCase():
        return forCode? COMMENT_SCOPE_CODE.ROAD_SECTION: SpatialTypeMap.get(SpatialObjectCodeEnum.RoadSection)['desc'];

      case SpatialTypeMap.get(SpatialObjectCodeEnum.Wtra)['source'].toLowerCase():
        return null; // only can comment on CutBlock or RoadSection

      default:
        return forCode? COMMENT_SCOPE_CODE.OVERALL: 'Overall FOM';
    }
  }
}

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