import { OmitType } from '@nestjs/swagger';
import { CreateWorkflowStateCodeDto } from './create-workflow-state-code.dto';

export class UpdateWorkflowStateCodeDto extends OmitType(CreateWorkflowStateCodeDto, ['code']) {}
