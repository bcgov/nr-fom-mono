import { Controller } from '@nestjs/common';
import { BaseController } from '../../../core/controllers/base.controller';
import { PublicCommentService } from './public-comment.service';
import { PublicComment } from './entities/public-comment.entity';
import { CreatePublicCommentDto } from './dto/create-public-comment.dto';
import { UpdatePublicCommentDto } from './dto/update-public-comment.dto';

@Controller('public-comment')
export class PublicCommentController extends BaseController<
  PublicComment,
  CreatePublicCommentDto,
  UpdatePublicCommentDto
> {
  constructor(protected readonly service: PublicCommentService) {
    super(service);
  }
}
