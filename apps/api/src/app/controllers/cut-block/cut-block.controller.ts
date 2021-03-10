import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { BaseController } from '../../../core/controllers/base.controller';
import { CutBlockService } from './cut-block.service';
import { CutBlock } from './entities/cut-block.entity';
import { CreateCutBlockDto } from './dto/create-cut-block.dto';
import { UpdateCutBlockDto } from './dto/update-cut-block.dto';

@ApiTags('cut-block')
@Controller('cut-block')
export class CutBlockController extends BaseController<
  CutBlock,
  CreateCutBlockDto,
  UpdateCutBlockDto
> {
  constructor(protected readonly service: CutBlockService) {
    super(service);
  }
}
