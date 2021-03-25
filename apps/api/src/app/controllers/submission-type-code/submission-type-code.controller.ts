import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { CodeTableController } from '@controllers';
import { SubmissionTypeCodeService } from './submission-type-code.service';
import { SubmissionTypeCode } from './entities/submission-type-code.entity';
import { CreateSubmissionTypeCodeDto } from './dto/create-submission-type-code.dto';
import { UpdateSubmissionTypeCodeDto } from './dto/update-submission-type-code.dto';

@ApiTags('submission-type-code')
@Controller('submission-type-code')
export class SubmissionTypeCodeController extends CodeTableController<
  SubmissionTypeCode,
  CreateSubmissionTypeCodeDto,
  UpdateSubmissionTypeCodeDto
> {
  constructor(protected readonly service: SubmissionTypeCodeService) {
    super(service);
  }

  /* @Post()
  create(@Body() createDto: CreateSubmissionTypeCodeDto) {
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
  update(@Param('id') id: number, @Body() updateDto: UpdateSubmissionTypeCodeDto) {
    return super.update(id, updateDto);
  } */

  /* @Delete(':id')
  remove(@Param('id') id: number) {
    return super.remove(id);
  } */
}
