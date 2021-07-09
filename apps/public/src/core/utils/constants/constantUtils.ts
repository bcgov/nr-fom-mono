import { SpatialObjectCodeEnum } from '@api-client';

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
 * Util methods for fetching codes and their various pieces of related information.
 *
 * @export
 * @class ConstantUtils
 */
export class ConstantUtils {
 
}
