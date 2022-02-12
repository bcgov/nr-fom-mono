import { SpatialObjectCodeEnum } from '@api-client';
import { SpatialFeaturePublicResponse } from 'libs/client/typescript-ng/model/spatialFeaturePublicResponse';
import { CommentScopeOpt, COMMENT_SCOPE_CODE, ConstantUtils, SpatialTypeMap } from './constantUtils';

export class CommentScope {
  // Comment Scope select options
  static buildCommentScopeOptions(spatialDetails: SpatialFeaturePublicResponse[]): Array<CommentScopeOpt> {
    const commentScopeOpts = [];
    const allOpt = {commentScopeCode: null, desc: 'All', name: null, scopeId: null} as CommentScopeOpt;
    const overallOpt = {
      commentScopeCode: ConstantUtils.getCommentScopeCodeOrDesc(null, true), 
      desc: ConstantUtils.getCommentScopeCodeOrDesc(null, false), 
      name: null, 
      scopeId: null} as CommentScopeOpt;     
    commentScopeOpts.push(allOpt);
    commentScopeOpts.push(overallOpt);

    if (spatialDetails) {
      spatialDetails
        .filter((detail) => {
          return ConstantUtils.getCommentScopeCodeOrDesc(detail.featureType.code, true);// filter out rention_area.
        })
        .forEach((detail) => {
        commentScopeOpts.push({commentScopeCode: ConstantUtils.getCommentScopeCodeOrDesc(detail.featureType.code, true), 
                                desc: ConstantUtils.getCommentScopeCodeOrDesc(detail.featureType.code, false),
                                name: detail.name, 
                                scopeId: detail.featureId} as CommentScopeOpt);
      });
    }
    return commentScopeOpts;
  };
  
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
