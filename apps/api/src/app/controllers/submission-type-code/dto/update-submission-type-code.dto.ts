import { PartialType } from '@nestjs/mapped-types';
import { CreateSubmissionTypeCodeDto } from './create-submission-type-code.dto';

export class UpdateSubmissionTypeCodeDto extends PartialType(CreateSubmissionTypeCodeDto) {}
