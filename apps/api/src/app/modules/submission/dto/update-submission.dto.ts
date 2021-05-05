import { OmitType } from '@nestjs/swagger';
import { SubmissionDto } from './submission.dto';

export class UpdateSubmissionDto extends OmitType(SubmissionDto, ['id']) {}
