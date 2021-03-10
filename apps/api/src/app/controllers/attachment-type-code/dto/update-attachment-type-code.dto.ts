import { OmitType } from '@nestjs/swagger';
import { CreateAttachmentTypeCodeDto } from './create-attachment-type-code.dto';

export class UpdateAttachmentTypeCodeDto extends OmitType(CreateAttachmentTypeCodeDto, ['code']) {}
