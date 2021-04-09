import { OmitType } from '@nestjs/swagger';
import { SubmissionTypeCodeDto } from './submission-type-code.dto';

export class UpdateSubmissionTypeCodeDto extends OmitType(SubmissionTypeCodeDto, ['code']) {}
