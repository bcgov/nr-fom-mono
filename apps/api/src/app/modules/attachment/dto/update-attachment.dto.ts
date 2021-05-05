import { OmitType } from '@nestjs/swagger';
import { AttachmentDto } from './attachment.dto';

export class UpdateAttachmentDto extends OmitType(AttachmentDto, ['id']) {}
