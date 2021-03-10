import { OmitType } from '@nestjs/swagger';
import { CreateAttachmentDto } from './create-attachment.dto';

export class UpdateAttachmentDto extends OmitType(CreateAttachmentDto, ['id']) {}
