import { SpatialObjectCodeEnum } from '../../../../../libs/client/typescript-ng';

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
