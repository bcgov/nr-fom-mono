import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { BaseController } from '../../../core/controllers/base.controller';
import { RetentionAreaService } from './retention-area.service';
import { RetentionArea } from './entities/retention-area.entity';
import { CreateRetentionAreaDto } from './dto/create-retention-area.dto';
import { UpdateRetentionAreaDto } from './dto/update-retention-area.dto';

@ApiTags('retention-area')
@Controller('retention-area')
export class RetentionAreaController extends BaseController<
  RetentionArea,
  CreateRetentionAreaDto,
  UpdateRetentionAreaDto
> {
  constructor(protected readonly service: RetentionAreaService) {
    super(service);
  }
}
