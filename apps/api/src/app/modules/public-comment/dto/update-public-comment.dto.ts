import { OmitType } from '@nestjs/swagger';
import { PublicCommentDto } from './public-comment.dto';

export class UpdatePublicCommentDto extends OmitType(PublicCommentDto, [
  'id',
]) {}
