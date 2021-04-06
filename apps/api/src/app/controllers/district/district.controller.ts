import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { District } from './entities/district.entity';
import { BaseReadOnlyController } from '@controllers';
import { DistrictService } from './district.service';

@ApiTags('district')
@Controller('district')
export class DistrictController extends BaseReadOnlyController<District> {
  constructor(protected readonly service: DistrictService) {
    super(service);
  }
}
