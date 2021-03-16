import { ApiBaseEntity } from '@entities';
import { Entity, PrimaryColumn, PrimaryGeneratedColumn, JoinColumn, Column } from 'typeorm';

@Entity('public_comment')
export class PublicComment extends ApiBaseEntity<PublicComment> {
  constructor(project?: Partial<PublicComment>) {
    super(project);
  }

  @PrimaryGeneratedColumn('increment')
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

  @JoinColumn({ name: 'project_id' })
  projectId: number;

  @JoinColumn({ name: 'response_code' })
  responseCode: string;
}
