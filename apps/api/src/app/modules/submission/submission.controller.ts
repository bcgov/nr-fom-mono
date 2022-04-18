import { User } from "@api-core/security/user";
import { Body, Controller, Delete, Get, HttpStatus, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserHeader, UserRequiredHeader } from 'apps/api/src/core/security/auth.service';
import { SubmissionTypeCodeEnum } from "./submission-type-code.entity";
import { SpatialObjectCodeEnum, SubmissionMetricsResponse, SubmissionRequest } from './submission.dto';
import { SubmissionService } from './submission.service';


@ApiTags('submission')
@Controller('submission')
export class SubmissionController {
 
  constructor(private readonly service: SubmissionService) {}

  @Post()
  @ApiBearerAuth()
  @ApiBody({ type: SubmissionRequest })
  @ApiResponse({ status: HttpStatus.OK })
  async processSpatialSubmission(
    @UserRequiredHeader() user: User,
    @Body() dto: SubmissionRequest) {
    await this.service.processSpatialSubmission(dto, user);
  }

  @Get('/metrics/:projectId')
  @ApiBearerAuth()
  @ApiQuery({name: 'submissionTypeCode', type: 'string', enum: SubmissionTypeCodeEnum})
  @ApiResponse({ status: HttpStatus.OK, type: SubmissionMetricsResponse })
  async findSpatialSubmissionMetrics(
    @UserHeader() user: User,
    @Param('projectId', ParseIntPipe) projectId: number,
    @Query('submissionTypeCode') submissionTypeCode: SubmissionTypeCodeEnum): Promise<SubmissionMetricsResponse> {
    return this.service.findSpatialSubmissionMetrics(projectId, submissionTypeCode, user);
  }

  @Delete(':submissionId')
  @ApiBearerAuth()
  @ApiQuery({name: 'spatialObjectCode', type: 'string', enum: SpatialObjectCodeEnum})
  @ApiResponse({ status: HttpStatus.OK })
  async removeSpatialSubmissionByType(
    @UserRequiredHeader() user: User,
    @Param('submissionId', ParseIntPipe) submissionId: number,
    @Query('spatialObjectCode') spatialObjectCode: SpatialObjectCodeEnum) {
      console.log("submissionId: ", submissionId)
      console.log("spatialObjectCode: ", spatialObjectCode)
    return this.service.removeSpatialSubmissionByType(submissionId, spatialObjectCode, user);
  }

}
