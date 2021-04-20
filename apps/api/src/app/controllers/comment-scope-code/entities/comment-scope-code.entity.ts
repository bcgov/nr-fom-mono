import { ApiCodeTableEntity } from '@entities';
import { Entity } from 'typeorm';

@Entity('comment_scope_code', {schema: 'app_fom'})
export class CommentScopeCode extends ApiCodeTableEntity<CommentScopeCode> {
  constructor(commentScopeCode?: Partial<CommentScopeCode>) {
    super(commentScopeCode);
  }
}
