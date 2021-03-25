import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CodeTableController } from '@controllers';
import { ResponseCodeService } from './response-code.service';
import { ResponseCode } from './entities/response-code.entity';
import { CreateResponseCodeDto } from './dto/create-response-code.dto';
import { UpdateResponseCodeDto } from './dto/update-response-code.dto';

@ApiTags('response-code')
@Controller('response-code')
export class ResponseCodeController extends CodeTableController<
  ResponseCode,
  CreateResponseCodeDto,
  UpdateResponseCodeDto
> {
  constructor(protected readonly service: ResponseCodeService) {
    super(service);
  }

  /* @Post()
  create(@Body() createDto: CreateResponseCodeDto) {
    return super.create(createDto);
  } */

  @Get()
  findAll() {
    return super.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return super.findOne(id);
  }

  /* @Put(':id')
  update(@Param('id') id: number, @Body() updateDto: UpdateResponseCodeDto) {
    return super.update(id, updateDto);
  } */

  /* @Delete(':id')
  remove(@Param('id') id: number) {
    return super.remove(id);
  } */
}
