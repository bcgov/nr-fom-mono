import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';

import { CodeTableController } from '@controllers';
import { WorkflowStateCodeService } from './workflow-state-code.service';
import { WorkflowStateCode } from './entities/workflow-state-code.entity';
import { WorkflowStateCodeDto } from './dto/workflow-state-code.dto';
import { UpdateWorkflowStateCodeDto } from './dto/update-workflow-state-code.dto';

@ApiTags('workflow-state-code')
@Controller('workflow-state-code')
export class WorkflowStateCodeController extends CodeTableController<
  WorkflowStateCode,
  WorkflowStateCodeDto,
  UpdateWorkflowStateCodeDto
> {
  constructor(protected readonly service: WorkflowStateCodeService) {
    super(service);
  }

  @Get()
  @ApiResponse({ status: 200, type: [WorkflowStateCodeDto] })
  async findAll(): Promise<WorkflowStateCodeDto[]> {
    return super.findAll();
  }

  @Get(':id')
  @ApiResponse({ status: 200, type: WorkflowStateCodeDto })
  async findOne(@Param('id') id: string): Promise<WorkflowStateCodeDto> {
    return super.findOne(id);
  }
}
