import { PartialType } from '@nestjs/mapped-types';
import { CreateAttachmentTypeCodeDto } from './create-attachment-type-code.dto';

export class UpdateAttachmentTypeCodeDto extends PartialType(CreateAttachmentTypeCodeDto) {}
