import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { BaseController } from '../../../core/controllers/base.controller';
import { SubmissionService } from './submission.service';
import { Submission } from './entities/submission.entity';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { UpdateSubmissionDto } from './dto/update-submission.dto';

@ApiTags('submission')
@Controller('submission')
export class SubmissionController extends BaseController<
  Submission,
  CreateSubmissionDto,
  UpdateSubmissionDto
> {
  constructor(protected readonly service: SubmissionService) {
    super(service);
  }
}
