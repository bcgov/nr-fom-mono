import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { BaseController, BaseCollectionController } from '@controllers';
import { ForestStewardshipPlanService } from './forest-stewardship-plan.service';
import { ForestStewardshipPlan } from './entities/forest-stewardship-plan.entity';
import { ForestStewardshipPlanDto } from './dto/forest-stewardship-plan.dto';
import { UpdateForestStewardshipPlanDto } from './dto/update-forest-stewardship-plan.dto';

@ApiTags('forest-stewardship-plans')
@Controller('forest-stewardship-plans')
export class ForestStewardshipPlansController extends BaseCollectionController<
  ForestStewardshipPlan,
  ForestStewardshipPlanDto,
  UpdateForestStewardshipPlanDto
> {
  constructor(protected readonly service: ForestStewardshipPlanService) {
    super(service);
  }

  @Post()
  async findAll(@Body() options) {
    return super.findAll(options);
  }
}

@ApiTags('forest-stewardship-plan')
@Controller('forest-stewardship-plan')
export class ForestStewardshipPlanController extends BaseController<
  ForestStewardshipPlan,
  ForestStewardshipPlanDto,
  UpdateForestStewardshipPlanDto
> {
  constructor(protected readonly service: ForestStewardshipPlanService) {
    super(service);
  }

  @Post()
  async create(@Body() createDto: ForestStewardshipPlanDto) {
    return super.create(createDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return super.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateDto: UpdateForestStewardshipPlanDto
  ) {
    return super.update(id, updateDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return super.remove(id);
  }
}
