import { SpatialObjectCodeEnum } from '@api-client';
import moment = require('moment');

export const DELIMITER = {
  PIPE: '|'
}

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