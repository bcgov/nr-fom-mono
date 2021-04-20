import { OmitType } from '@nestjs/swagger';
import { CommentScopeCodeDto } from './comment-scope-code.dto';

export class UpdateCommentScopeCodeDto extends OmitType(
  CommentScopeCodeDto,
  ['code']
) {}
