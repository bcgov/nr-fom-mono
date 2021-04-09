import { OmitType } from '@nestjs/swagger';
import { AttachmentTypeCodeDto } from './attachment-type-code.dto';

export class UpdateAttachmentTypeCodeDto extends OmitType(AttachmentTypeCodeDto, ['code']) {}
