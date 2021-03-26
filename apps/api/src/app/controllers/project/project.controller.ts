import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiTags, ApiBody } from '@nestjs/swagger';

import { BaseController } from '@controllers';
import { ProjectService } from './project.service';
import { DistrictService } from '../district/district.service';
import { ForestClientService } from '../forest-client/forest-client.service';
import { Project } from './entities/project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { District } from '../district/entities/district.entity';
import { ForestClient } from '../forest-client/entities/forest-client.entity';

@ApiTags('project')
@Controller('project')
export class ProjectController extends BaseController<
  Project,
  CreateProjectDto,
  UpdateProjectDto
> {
  constructor(
    protected readonly service: ProjectService,
    protected readonly districtService: DistrictService,
    protected readonly forestClientService: ForestClientService
  ) {
    super(service);
  }

  @Post()
  async create(@Body() createDto: CreateProjectDto) {
    if (createDto.forestClientNumber) {
      const forestClient: ForestClient = await this.forestClientService.findOne(createDto.forestClientNumber);
      createDto.forestClient = forestClient;
    }
    return super.create(createDto);
  }

  @Get('/byFspId/:id')
  async findByFspId(@Param('id') id: number) {
    // Don't need to specify loading of workflowStateCode because it is eager loaded.
    // return super.findAll({ where: {fspId: id}, relations: ["workflowStateCode"] });
    return super.findAll({ where: {fspId: id}});
  }

  @Get()
  async findAll(options) {
    return super.findAll(options);
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return super.findOne(id);
  }

  @Put(':id')
  @ApiBody({ type: UpdateProjectDto })
  async update(@Param('id') id: number, @Body() updateDto: UpdateProjectDto) {
    if (updateDto.forestClientNumber) {
      const forestClient: ForestClient = await this.forestClientService.findOne(updateDto.forestClientNumber);
      updateDto.forestClient = forestClient;
    }

    if (updateDto.districtId) {
      const district: District = await this.districtService.findOne(updateDto.districtId);
      updateDto.district = district;
    }

    return super.update(id, updateDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return super.remove(id);
  }
}
