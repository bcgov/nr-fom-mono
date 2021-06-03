import { Controller, Get, Query, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOkResponse } from '@nestjs/swagger';

import { ProjectSpatialDetail } from '../spatial-feature/project-spatial-detail.entity';
import { SpatialFeatureBcgwResponse, SpatialFeaturePublicResponse } from './spatial-feature.dto';
import { SpatialFeatureService } from './spatial-feature.service';

@ApiTags('spatial-feature')
@Controller('spatial-feature')
export class SpatialFeatureController {
  constructor(
    private readonly spatialFeatureService: SpatialFeatureService) {
  }

  // Anonymous access allowed
  @Get() 
  @ApiOkResponse({ type: [SpatialFeaturePublicResponse] })
  async getForProject(
    @Query('projectId', ParseIntPipe) projectId: number): Promise<SpatialFeaturePublicResponse[]> {
    return this.spatialFeatureService.findByProjectId(projectId);
  }

  @Get('/bcgw-extract/v1') 
  @ApiOkResponse({ type: [SpatialFeatureBcgwResponse] })
  async getBcgwExtract(): Promise<any> {
    return this.spatialFeatureService.getBcgwExtract();
  }

}
