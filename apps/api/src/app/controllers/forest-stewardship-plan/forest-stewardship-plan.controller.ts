import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { BaseController } from '@controllers';
import { ForestStewardshipPlanService } from './forest-stewardship-plan.service';
import { ForestStewardshipPlan } from './entities/forest-stewardship-plan.entity';
import { CreateForestStewardshipPlanDto } from './dto/create-forest-stewardship-plan.dto';
import { UpdateForestStewardshipPlanDto } from './dto/update-forest-stewardship-plan.dto';

@ApiTags('forest-stewardship-plan')
@Controller('forest-stewardship-plan')
export class ForestStewardshipPlanController extends BaseController<
  ForestStewardshipPlan,
  CreateForestStewardshipPlanDto,
  UpdateForestStewardshipPlanDto
> {
  constructor(protected readonly service: ForestStewardshipPlanService) {
    super(service);
  }

  @Post()
  create(@Body() createDto: CreateForestStewardshipPlanDto) {
    return super.create(createDto);
  }

  @Get()
  findAll() {
    return super.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return super.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() updateDto: UpdateForestStewardshipPlanDto) {
    return super.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return super.remove(id);
  }
}
