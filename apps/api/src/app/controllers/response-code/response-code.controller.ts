import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CodeTableController } from '@controllers';
import { ResponseCodeService } from './response-code.service';
import { ResponseCode } from './entities/response-code.entity';
import { ResponseCodeDto } from './dto/response-code.dto';
import { UpdateResponseCodeDto } from './dto/update-response-code.dto';

@ApiTags('response-code')
@Controller('response-code')
export class ResponseCodeController extends CodeTableController<
  ResponseCode,
  ResponseCodeDto,
  UpdateResponseCodeDto
> {
  constructor(protected readonly service: ResponseCodeService) {
    super(service);
  }

  @Get()
  async findAll() {
    return super.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return super.findOne(id);
  }
}
