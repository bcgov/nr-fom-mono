import { OmitType } from '@nestjs/swagger';
import { CreateSubmissionDto } from './create-submission.dto';

export class UpdateSubmissionDto extends OmitType(CreateSubmissionDto, ['id']) {}
