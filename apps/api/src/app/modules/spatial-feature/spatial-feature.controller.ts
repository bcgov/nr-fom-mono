import { Controller, Get, Query, ParseIntPipe, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOkResponse } from '@nestjs/swagger';

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

  @Get('/bcgw-extract') 
  @ApiOkResponse({ type: [SpatialFeatureBcgwResponse] })
  async getBcgwExtract(
    @Query('version') version: string): Promise<any> {

    // Version acts as an informal API key (to prevent casual exploration of an expensive operation) plus provides a versioning capability.
    if (version != '1.0-final') {
      throw new BadRequestException('Invalid version');
    }
    
    return this.spatialFeatureService.getBcgwExtract();
  }

}
