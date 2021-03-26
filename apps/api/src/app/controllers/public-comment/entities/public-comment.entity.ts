import { ApiBaseEntity } from '@entities';
import { Entity, PrimaryGeneratedColumn, JoinColumn, Column, ManyToOne } from 'typeorm';
import { ResponseCode } from '../../response-code/entities/response-code.entity';
import { Project } from '../../project/entities/project.entity';

@Entity('public_comment', {schema: 'app_fom'})
export class PublicComment extends ApiBaseEntity<PublicComment> {
  constructor(project?: Partial<PublicComment>) {
    super(project);
  }

  @PrimaryGeneratedColumn('increment', {name: 'public_comment_id'})
  public id: number;

  @Column()
  feedback: string;

  @Column()
  name: string;

  @Column()
  location: string;

  @Column()
  email: string;

  @Column({ name: 'phone_number' })
  phoneNumber: string;

  @Column({ name: 'response_details' })
  responseDetails: string;

  @ManyToOne(() => Project, { eager: true })
  @JoinColumn({ name: 'project_id', referencedColumnName: 'id' })
  project: Project;

  @Column({ name: 'response_code' })
  @ManyToOne(() => ResponseCode, { eager: true})
  @JoinColumn({ name: 'response_code', referencedColumnName: 'code' })
  responseCode: ResponseCode;
}
