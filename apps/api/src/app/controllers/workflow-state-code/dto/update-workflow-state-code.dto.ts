import { PartialType } from '@nestjs/mapped-types';
import { CreateWorkflowStateCodeDto } from './create-workflow-state-code.dto';

export class UpdateWorkflowStateCodeDto extends PartialType(CreateWorkflowStateCodeDto) {}
