import { OmitType } from '@nestjs/swagger';
import { WorkflowStateCodeDto } from './workflow-state-code.dto';

export class UpdateWorkflowStateCodeDto extends OmitType(WorkflowStateCodeDto, ['code']) {}
