import { ApiBaseEntity } from '@entities';
import {
  Entity,
  PrimaryGeneratedColumn,
  JoinColumn,
  Column,
  ManyToOne,
  RelationId,
} from 'typeorm';
import { ResponseCode } from '../../response-code/entities/response-code.entity';
import { CommentScopeCode } from '../../comment-scope-code/entities/comment-scope-code.entity';
import { Project } from '../../project/entities/project.entity';
import { CutBlock } from '../../cut-block/entities/cut-block.entity';

@Entity('public_comment', { schema: 'app_fom' })
export class PublicComment extends ApiBaseEntity<PublicComment> {
  constructor(project?: Partial<PublicComment>) {
    super(project);
  }

  @PrimaryGeneratedColumn('increment', { name: 'public_comment_id' })
  public id: number;

  @Column()
  feedback: string;

  @Column()
  name: string;

  @Column()
  location: string;

  @Column()
  email: string;

  @Column()
  phone_number: string;

  @Column()
  response_details: string;

  @ManyToOne(() => Project)
  @JoinColumn({ name: 'project_id', referencedColumnName: 'id' })
  project: Project;

  @Column()
  @RelationId((comment: PublicComment) => comment.project)
  project_id: number;

  @ManyToOne(() => ResponseCode)
  @JoinColumn({ name: 'response_code', referencedColumnName: 'code' })
  response: ResponseCode;

  @Column()
  @RelationId((comment: PublicComment) => comment.response)
  response_code: string;

  @ManyToOne(() => CommentScopeCode)
  @JoinColumn({ name: 'comment_scope_code', referencedColumnName: 'code' })
  commentScope: CommentScopeCode;

  @Column()
  @RelationId((comment: PublicComment) => comment.commentScope)
  comment_scope_code: string;

  @Column()
  scope_cut_block_id: number;

  @Column()
  scope_road_section_id: number;
}
