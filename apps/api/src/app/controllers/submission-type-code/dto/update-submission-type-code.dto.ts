import { OmitType } from '@nestjs/swagger';
import { CreateSubmissionTypeCodeDto } from './create-submission-type-code.dto';

export class UpdateSubmissionTypeCodeDto extends OmitType(CreateSubmissionTypeCodeDto, ['code']) {}
