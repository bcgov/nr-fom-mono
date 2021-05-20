import { Controller, Get, Post, Put, Delete, Body, Param, Query, BadRequestException, ForbiddenException } from '@nestjs/common';
import { ApiTags, ApiBody, ApiResponse, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { BaseController } from '@controllers';
import { ProjectService, ProjectFindCriteria } from './project.service';
import { Project } from './entities/project.entity';
import { ProjectDto } from './dto/project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectSpatialDetailService } from './project-spatial-detail.service'
import { ProjectSpatialDetail } from './entities/project-spatial-detail.entity';
import { ProjectPublicSummaryDto } from './dto/project-public.dto.';
import { WorkflowStateCode } from '../workflow-state-code/entities/workflow-state-code.entity';
import * as dayjs from 'dayjs';
import { AuthService, UserHeader, UserRequiredHeader } from 'apps/api/src/core/security/auth.service';
import { User } from 'apps/api/src/core/security/user';


@ApiTags('project')
@Controller('project')
export class ProjectController extends BaseController<
  Project,
  ProjectDto,
  UpdateProjectDto
> {
  constructor(
    protected readonly service: ProjectService,
    private projectSpatialDetailService: ProjectSpatialDetailService,
    private authService: AuthService) {
    super(service);
  }

  // Anonymous access allowed
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
        // Deliberately exclude EXPIRED
      }
      if (includeCommentOpen != 'true' && includePostCommentOpen != 'true') {
        throw new BadRequestException("Either includeCommentOpen or includePostCommentOpen must be true");
      }

      const DATE_FORMAT='YYYY-MM-DD';
      if (openedOnOrAfter) {
        findCriteria.commentingOpenedOnOrAfter = dayjs(openedOnOrAfter).format(DATE_FORMAT);
      } 

      return this.service.findPublicSummaries(findCriteria);
  }

  // Anonymous access allowed
  @Get('/spatialDetails/:id') 
  @ApiResponse({ status: 200, type: [ProjectSpatialDetail] })
  async getSpatialDetails(@Param('id') id: number): Promise<ProjectSpatialDetail[]> {
    return this.projectSpatialDetailService.findByProjectId(id);
  }

  // Anonymous access allowed
  @Get(':id')
  @ApiBearerAuth()
  @ApiResponse({ status: 200, type: ProjectDto })
  async findOne(
    @UserHeader() user: User,
    @Param('id') id: number): Promise<ProjectDto> {
    return this.service.findOne(id, user, {
      relations: ['district', 'forest_client', 'workflow_state'],
    });
  }

  @Get()
  @ApiBearerAuth()
  @ApiQuery({ name: 'fspId', required: false})
  @ApiQuery({ name: 'districtId', required: false})
  @ApiQuery({ name: 'workflowStateCode', required: false})
  @ApiQuery({ name: 'forestClientName', required: false})
  @ApiResponse({ status: 200, type: [ProjectDto] })
  async find(
    @UserRequiredHeader() user: User,
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
      // Ministry users can access all projects, while forest client users can only access projects for forest clients they are authorized for.
      if (!user.isMinistry && user.isForestClient) {
        findCriteria.includeForestClientNumbers = user.clientIds;
      }
      if (!user.isAuthorizedForAdminSite()) {
        throw new ForbiddenException();
      }

      return this.service.find(findCriteria);
  }

  @Post()
  @ApiBearerAuth()
  @ApiResponse({ status: 201, type: ProjectDto })
  async create(
    @UserRequiredHeader() user: User,
    @Body() createDto: ProjectDto
    ): Promise<ProjectDto> {
    // TODO: add buisiness logic (to service)
    return this.service.create(createDto, user);
  }

  @Put(':id')
  @ApiBearerAuth()
  @ApiResponse({ status: 200, type: UpdateProjectDto })
  @ApiBody({ type: UpdateProjectDto })
  async update(
    @UserRequiredHeader() user: User,
    @Param('id') id: number,
    @Body() updateDto: UpdateProjectDto
  ): Promise<UpdateProjectDto> {
    return this.service.update(id, updateDto, user);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiResponse({ status: 200 })
  async remove(
    @UserRequiredHeader() user: User,
    @Param('id') id: number) {
    this.service.remove(id, user);
  }
}
