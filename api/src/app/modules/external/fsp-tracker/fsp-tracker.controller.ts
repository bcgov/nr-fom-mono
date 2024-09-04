import { ProjectFindCriteria } from '@api-modules/project/project.service';
import { ArgumentMetadata, BadRequestException, Controller, Get, HttpStatus, Injectable, PipeTransform, Query } from '@nestjs/common';
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FomFspTrackerResponse } from '@src/app/modules/external/fsp-tracker/fsp-tracker.dto';
import { FspTrackerService } from '@src/app/modules/external/fsp-tracker/fsp-tracker.service';
import { PinoLogger } from 'nestjs-pino';

// Custom pipe transformer for controller parameter conversion.
@Injectable()
export class PositiveIntPipe implements PipeTransform<number, number> {
    transform(value: any, metadata: ArgumentMetadata) {

        if(/^\d+$/.test(value)) {
            const intValue = parseInt(value);
            if ( intValue > 0) {
                return value;
            }
        }

        throw new BadRequestException('Value must be positive integer.');
    }
}

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
    @Query('fspId', PositiveIntPipe) fspId: number
  ): Promise<FomFspTrackerResponse[]> {
    const findCriteria: ProjectFindCriteria = new ProjectFindCriteria();
    findCriteria.fspId = fspId
    return this.service.find(findCriteria);
  }
}