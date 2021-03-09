import { Controller } from '@nestjs/common';
import { CodeTableController } from '../../../core/controllers/code.controller';
import { ResponseCodeService } from './response-code.service';
import { ResponseCode } from './entities/response-code.entity';
import { CreateResponseCodeDto } from './dto/create-response-code.dto';
import { UpdateResponseCodeDto } from './dto/update-response-code.dto';

@Controller('response-code')
export class ResponseCodeController extends CodeTableController<
  ResponseCode,
  CreateResponseCodeDto,
  UpdateResponseCodeDto
> {
  constructor(protected readonly service: ResponseCodeService) {
    super(service);
  }
}
