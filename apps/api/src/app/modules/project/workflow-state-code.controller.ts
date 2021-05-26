import { Controller, Get, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';

import { CodeTableController } from '@controllers';
import { WorkflowStateCodeService } from './workflow-state-code.service';
import { WorkflowStateCode } from './workflow-state-code.entity';

@ApiTags('workflow-state-code')
@Controller('workflow-state-code')
export class WorkflowStateCodeController extends CodeTableController<WorkflowStateCode> {
  constructor(protected readonly service: WorkflowStateCodeService) {
    super(service);
  }

  @Get()
  @ApiResponse({ status: HttpStatus.OK, type: [WorkflowStateCode] })
  async findAll(): Promise<WorkflowStateCode[]> {
    return super.findAll();
  }

}
