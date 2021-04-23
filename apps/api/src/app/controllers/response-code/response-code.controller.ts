import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';

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
  @ApiResponse({ status: 200, type: [ResponseCodeDto] })
  async findAll(): Promise<ResponseCodeDto[]> {
    return super.findAll();
  }

  @Get(':id')
  @ApiResponse({ status: 200, type: ResponseCodeDto })
  async findOne(@Param('id') id: string): Promise<ResponseCodeDto> {
    return super.findOne(id);
  }
}
