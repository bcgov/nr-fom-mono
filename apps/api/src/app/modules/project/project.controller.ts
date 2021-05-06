import { Controller, Get, Post, Put, Delete, Body, Param, Logger, Query, HttpException, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiBody, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { BaseController } from '@controllers';
import { ProjectService, ProjectFindCriteria } from './project.service';
import { Project } from './entities/project.entity';
import { ProjectDto } from './dto/project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { DeleteResult, UpdateResult } from 'typeorm';
import { ProjectSpatialDetailService } from './project-spatial-detail.service'
import { ProjectSpatialDetail } from './entities/project-spatial-detail.entity';
import { ProjectPublicSummaryDto } from './dto/project-public.dto.';
import { WorkflowStateCode } from '../workflow-state-code/entities/workflow-state-code.entity';
import * as dayjs from 'dayjs';

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
    @Query('includeCommentOpen') includeCommentOpen: string = 'true',
    @Query('includePostCommentOpen') includePostCommentOpen: string = 'true',
    @Query('forestClientName') forestClientName?: string,
    @Query('openedOnOrAfter') openedOnOrAfter?: string,
    ): Promise<ProjectPublicSummaryDto[]> {

      const findCriteria: ProjectFindCriteria = new ProjectFindCriteria();

      if (forestClientName) {
        findCriteria.likeForestClientName = forestClientName;
      }

      if (includeCommentOpen == 'true') {
        findCriteria.includeWorkflowStateCodes.push(WorkflowStateCode.CODES.COMMENT_OPEN);
      } 
      if (includePostCommentOpen == 'true') {
        findCriteria.includeWorkflowStateCodes.push(WorkflowStateCode.CODES.COMMENT_CLOSED);
        findCriteria.includeWorkflowStateCodes.push(WorkflowStateCode.CODES.FINALIZED);
      }
      if (includeCommentOpen != 'true' && includePostCommentOpen != 'true') {
        throw new HttpException("Either includeCommentOpen or includePostCommentOpen must be true", HttpStatus.BAD_REQUEST);
      }

      const DATE_FORMAT='YYYY-MM-DD';
      if (openedOnOrAfter) {
        findCriteria.commentingOpenedOnOrAfter = dayjs(openedOnOrAfter).format(DATE_FORMAT);
        // TODO: Need to ensure this date is not in the future, not necessary if use a publish state
      } else {
        // TODO: This logic is wrong . Exclude records with workflow state = comment open and comment open date > today
        // Had to open for commenting no later than today or wouldn't be visible. 
        // TODO: Not necessary if use a Publish state
        // findCriteria.commentingOpenedOnOrAfter = dayjs().format(DATE_FORMAT);
      }

      return await this.service.findPublicSummaries(findCriteria);
  }

  @Get()
  @ApiQuery({ name: 'fspId', required: false})
  @ApiQuery({ name: 'districtId', required: false})
  @ApiQuery({ name: 'workflowStateCode', required: false})
  @ApiQuery({ name: 'forestClientName', required: false})
  @ApiResponse({ status: 200, type: [ProjectDto] })
  async find(
    @Query('fspId') fspId?: number,
    @Query('districtId') districtId?: number,
    @Query('workflowStateCode') workflowStateCode?: string,
    @Query('forestClientName') forestClientName?: string,
    ): Promise<ProjectDto[]> {

      const findCriteria: ProjectFindCriteria = new ProjectFindCriteria();

      if (fspId) {
        findCriteria.fspId = fspId;
      }
      if (districtId) {
        findCriteria.districtId = districtId;
      }
      if (workflowStateCode) {
        findCriteria.includeWorkflowStateCodes.push(workflowStateCode);
      }
      if (forestClientName) {
        findCriteria.likeForestClientName = forestClientName;
      }

      return await this.service.find(findCriteria);
  }


  // TODO: Replace with limited-criteria search
  @Post('/findAll')
  @ApiResponse({ status: 200, type: [ProjectDto] })
  async findAll(@Body() options = {}): Promise<ProjectDto[]> {
    return super.findAll(options);
  }


  // TODO: Replace with more generic limited-criteria search.
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
    // TODO: add buisiness logic (to service)
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
  @ApiResponse({ status: 200, type: DeleteResult })
  async remove(@Param('id') id: number): Promise<DeleteResult> {
    return super.remove(id);
  }
}
