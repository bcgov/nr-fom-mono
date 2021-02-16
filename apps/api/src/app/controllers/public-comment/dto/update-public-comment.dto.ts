import { PartialType } from '@nestjs/mapped-types';
import { CreatePublicCommentDto } from './create-public-comment.dto';

export class UpdatePublicCommentDto extends PartialType(CreatePublicCommentDto) {}
