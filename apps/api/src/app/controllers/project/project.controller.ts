import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiTags, ApiBody } from '@nestjs/swagger';

import { BaseController } from '@controllers';
import { ProjectService } from './project.service';
import { DistrictService } from '../district/district.service';
import { ForestClientService } from '../forest-client/forest-client.service';
import { WorkflowStateCodeService } from '../workflow-state-code/workflow-state-code.service';
import { Project } from './entities/project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { District } from '../district/entities/district.entity';
import { ForestClient } from '../forest-client/entities/forest-client.entity';
import { WorkflowStateCode } from '../workflow-state-code/entities/workflow-state-code.entity';

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
    protected readonly forestClientService: ForestClientService,
    protected readonly workflowStateCodeService: WorkflowStateCodeService
  ) {
    super(service);
  }

  async mapEntitiesFromIds(dto): Promise<CreateProjectDto> {
    if (dto.forestClientNumber) {
      const forestClient: ForestClient = await this.forestClientService.findOne(dto.forestClientNumber);
      dto.forestClient = forestClient;
    }

    if (dto.districtId) {
      const district: District = await this.districtService.findOne(dto.districtId);
      dto.district = district;
    }

    if (dto.workflowStateCode) {
      const workflowState: WorkflowStateCode = await this.workflowStateCodeService.findOne(dto.workflowStateCode);
      dto.workflowState = workflowState;
    }

    return dto;
  }

  @Post()
  async create(@Body() createDto: CreateProjectDto) {
    createDto = await this.mapEntitiesFromIds(createDto);

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
  async update(@Param('id') id: number, @Body() updateDto: UpdateProjectDto): Promise<CreateProjectDto> {
    updateDto = await this.mapEntitiesFromIds(updateDto);

    const result = await super.update(id, updateDto) as CreateProjectDto;
    result.forestClientNumber = result.forestClient.id;
    result.districtId = result.district.id;
    result.workflowStateCode = result.workflowState.code;
    return result;
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return super.remove(id);
  }
}
