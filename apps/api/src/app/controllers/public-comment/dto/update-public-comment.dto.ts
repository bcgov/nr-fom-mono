import { OmitType } from '@nestjs/swagger';
import { CreatePublicCommentDto } from './create-public-comment.dto';

export class UpdatePublicCommentDto extends OmitType(CreatePublicCommentDto, ['id']) {}
