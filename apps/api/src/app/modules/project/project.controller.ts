import { Controller, Get, Post, Put, Delete, Body, Param, Logger, Query } from '@nestjs/common';
import { ApiTags, ApiBody, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { BaseController, BaseCollectionController } from '@controllers';
import { ProjectService } from './project.service';
import { Project } from './entities/project.entity';
import { ProjectDto } from './dto/project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { UpdateResult } from 'typeorm';
import { ProjectSpatialDetailService } from './project-spatial-detail.service'
import { ProjectSpatialDetail } from './entities/project-spatial-detail.entity';
import { ProjectPublicSummaryDto } from './dto/project-public.dto.';

@ApiTags('projects')
@Controller('projects')
export class ProjectsController extends BaseCollectionController<
  Project,
  ProjectDto,
  UpdateProjectDto
> {
  constructor(protected readonly service: ProjectService) {
    super(service);
  }

  // TODO: REMOVE THIS + SubmissionWithGeoDetailsDto might be useful for Admin?
  // @Get('/byIdWithGeoDetails/:id')
  // @ApiResponse({ status: 200, type: [ProjectDto] })
  // async findByIdWithGeoDetails(@Param('id') id: number): Promise<ProjectDto[]> {
  //   return super.findAll({
  //     where: { id: id },
  //     relations: ['district', 'forest_client', 'workflow_state', 'submissions', 'submissions.submission_type', 'submissions.cut_blocks', 'submissions.retention_areas', 'submissions.road_sections'],
  //   });
  // }

  @Post()
  @ApiResponse({ status: 200, type: [ProjectDto] })
  async findAll(@Body() options = {}): Promise<ProjectDto[]> {
    return super.findAll(options);
  }
}

@ApiTags('project')
@Controller('project')
export class ProjectController extends BaseController<
  Project,
  ProjectDto,
  UpdateProjectDto
> {
  constructor(
    protected readonly service: ProjectService,
    private projectSpatialDetailService: ProjectSpatialDetailService) {
    super(service);
  }

  @Get('/publicSummary')
  @ApiQuery({ name: 'includeCommentOpen', required: false})
  @ApiQuery({ name: 'includePostCommentOpen', required: false})
  @ApiQuery({ name: 'forestClientName', required: false})
  @ApiQuery({ name: 'openedOnOrAfter', required: false})
  @ApiResponse({ status: 200, type: [ProjectPublicSummaryDto] })
  async findPublicSummary(
    @Query('includeCommentOpen') includeCommentOpen: boolean = false, 
    @Query('includePostCommentOpen') includePostCommentOpen: boolean = false, 
    @Query('forestClientName') forestClientName?: string,
    @Query('openedOnOrAfter') openedOnOrAfter?: string,
    ): Promise<ProjectPublicSummaryDto[]> {
      // console.log(`includeCommentOpen ${includeCommentOpen}, includeNotCommentOpen ${includePostCommentOpen}, fomHolderName ${clientName}, openedAfter ${openedOnOrAfter}`);

      return await this.service.findPublicSummaries();
  }

  // TODO: Replace with more generic search.
  @Get('/byFspId/:id')
  @ApiResponse({ status: 200, type: [ProjectDto] })
  async findByFspId(@Param('id') id: number): Promise<ProjectDto[]> {
    return super.findAll({
      where: { fsp_id: id },
      relations: ['district', 'forest_client', 'workflow_state'],
    });
  }


  @Get('/spatialDetails/:id') 
  @ApiResponse({ status: 200, type: [ProjectSpatialDetail] })
  async getSpatialDetails(@Param('id') id: number): Promise<ProjectSpatialDetail[]> {
    return this.projectSpatialDetailService.findByProjectId(id);

  }

  @Post()
  @ApiResponse({ status: 201, type: ProjectDto })
  async create(@Body() createDto: ProjectDto): Promise<ProjectDto> {
    // add buisiness logic here
    return super.create(createDto);
  }

  @Get(':id')
  @ApiResponse({ status: 200, type: ProjectDto })
  async findOne(@Param('id') id: number): Promise<ProjectDto> {
    return super.findOne(id, {
      relations: ['district', 'forest_client', 'workflow_state'],
    });
  }

  @Put(':id')
  @ApiResponse({ status: 200, type: UpdateProjectDto })
  @ApiBody({ type: UpdateProjectDto })
  async update(
    @Param('id') id: number,
    @Body() updateDto: UpdateProjectDto
  ): Promise<UpdateProjectDto> {
    return super.update(id, updateDto);
  }

  @Delete(':id')
  @ApiResponse({ status: 200, type: UpdateResult })
  async remove(@Param('id') id: number): Promise<UpdateResult> {
    return super.remove(id);
  }
}
