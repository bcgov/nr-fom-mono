import { Controller, Get, Post, Put, Delete, Body, Param, Query, BadRequestException, ForbiddenException, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiBody, ApiResponse, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import * as dayjs from 'dayjs';
import { BaseController } from '@controllers';
import { ProjectService, ProjectFindCriteria } from './project.service';
import { Project } from './project.entity';
import { ProjectPublicSummaryResponse, ProjectResponse, ProjectCreateRequest, ProjectUpdateRequest } from './project.dto';
import { ProjectSpatialDetailService } from './project-spatial-detail.service'
import { ProjectSpatialDetail } from './project-spatial-detail.entity';
import { WorkflowStateEnum } from './workflow-state-code.entity';
import { UserHeader, UserRequiredHeader } from 'apps/api/src/core/security/auth.service';
import { User } from 'apps/api/src/core/security/user';


@ApiTags('project')
@Controller('project')
export class ProjectController extends BaseController<Project> {
  constructor(
    protected readonly service: ProjectService,
    private projectSpatialDetailService: ProjectSpatialDetailService) {
    super(service);
  }

  // Anonymous access allowed
  @Get('/publicSummary')
  @ApiQuery({ name: 'includeCommentOpen', required: false})
  @ApiQuery({ name: 'includePostCommentOpen', required: false})
  @ApiQuery({ name: 'forestClientName', required: false})
  @ApiQuery({ name: 'openedOnOrAfter', required: false})
  @ApiResponse({ status: HttpStatus.OK, type: [ProjectPublicSummaryResponse] })
  async findPublicSummary(
    @Query('includeCommentOpen') includeCommentOpen: string = 'true',
    @Query('includePostCommentOpen') includePostCommentOpen: string = 'true',
    @Query('forestClientName') forestClientName?: string,
    @Query('openedOnOrAfter') openedOnOrAfter?: string,
    ): Promise<ProjectPublicSummaryResponse[]> {

      const findCriteria: ProjectFindCriteria = new ProjectFindCriteria();

      if (forestClientName) {
        findCriteria.likeForestClientName = forestClientName;
      }

      if (includeCommentOpen == 'true') {
        findCriteria.includeWorkflowStateCodes.push(WorkflowStateEnum.COMMENT_OPEN);
      } 
      if (includePostCommentOpen == 'true') {
        findCriteria.includeWorkflowStateCodes.push(WorkflowStateEnum.COMMENT_CLOSED);
        findCriteria.includeWorkflowStateCodes.push(WorkflowStateEnum.FINALIZED);
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
  @ApiResponse({ status: HttpStatus.OK, type: [ProjectSpatialDetail] })
  async getSpatialDetails(@Param('id') id: number): Promise<ProjectSpatialDetail[]> {
    return this.projectSpatialDetailService.findByProjectId(id);
  }

  // Anonymous access allowed
  @Get(':id')
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.OK, type: ProjectResponse })
  async findOne(
    @UserHeader() user: User,
    @Param('id') id: number): Promise<ProjectResponse> {
    return this.service.findOne(id, user, {
      relations: ['district', 'forestClient', 'workflowState'],
    });
  }

  @Get()
  @ApiBearerAuth()
  @ApiQuery({ name: 'fspId', required: false})
  @ApiQuery({ name: 'districtId', required: false})
  @ApiQuery({ name: 'workflowStateCode', required: false})
  @ApiQuery({ name: 'forestClientName', required: false})
  @ApiResponse({ status: HttpStatus.OK, type: [ProjectResponse] })
  async find(
    @UserRequiredHeader() user: User,
    @Query('fspId') fspId?: number,
    @Query('districtId') districtId?: number,
    @Query('workflowStateCode') workflowStateCode?: string,
    @Query('forestClientName') forestClientName?: string,
    ): Promise<ProjectResponse[]> {

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
  @ApiResponse({ status: HttpStatus.CREATED, type: ProjectResponse })
  async create(
    @UserRequiredHeader() user: User,
    @Body() request: ProjectCreateRequest
    ): Promise<ProjectResponse> {
    return this.service.create(request, user);
  }

  @Put(':id')
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.OK, type: ProjectResponse })
  @ApiBody({ type: ProjectUpdateRequest })
  async update(
    @UserRequiredHeader() user: User,
    @Param('id') id: number,
    @Body() request: ProjectUpdateRequest
  ): Promise<ProjectResponse> {
    return this.service.update(id, request, user);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.OK })
  async remove(
    @UserRequiredHeader() user: User,
    @Param('id') id: number) {
    this.service.delete(id, user);
  }
}
