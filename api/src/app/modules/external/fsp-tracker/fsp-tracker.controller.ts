import { ProjectFindCriteria } from '@api-modules/project/project.service';
import { Controller, Get, HttpStatus, ParseIntPipe, Query } from '@nestjs/common';
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FomFspTrackerResponse } from '@src/app/modules/external/fsp-tracker/fsp-tracker.dto';
import { FspTrackerService } from '@src/app/modules/external/fsp-tracker/fsp-tracker.service';
import { PinoLogger } from 'nestjs-pino';

@ApiTags("external")
@Controller("external")
export class FspTrackerController {
  constructor(
    private readonly service: FspTrackerService,
    private readonly _logger: PinoLogger) {
  }

  @Get("fsp-tracker")
  @ApiQuery({ name: 'fspId', required: true})
  @ApiResponse({ status: HttpStatus.OK, type: [FomFspTrackerResponse] })
  async fspTracker(
    @Query('fspId') fspId: string
  ): Promise<FomFspTrackerResponse[]> {
    const findCriteria: ProjectFindCriteria = new ProjectFindCriteria();
    findCriteria.fspId = await new ParseIntPipe().transform(fspId, null);
    return this.service.find(findCriteria);
  }

}
