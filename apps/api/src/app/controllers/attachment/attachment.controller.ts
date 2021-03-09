import { Controller } from '@nestjs/common';
import { BaseController } from '../../../core/controllers/base.controller';
import { AttachmentService } from './attachment.service';
import { Attachment } from './entities/attachment.entity';
import { CreateAttachmentDto } from './dto/create-attachment.dto';
import { UpdateAttachmentDto } from './dto/update-attachment.dto';

@Controller('attachment')
export class AttachmentController extends BaseController<
  Attachment,
  CreateAttachmentDto,
  UpdateAttachmentDto
> {
  constructor(protected readonly service: AttachmentService) {
    super(service);
  }
}
