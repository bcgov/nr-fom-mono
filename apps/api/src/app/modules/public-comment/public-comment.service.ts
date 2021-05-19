import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PublicComment } from './entities/public-comment.entity';
import { DataService } from 'apps/api/src/core/models/data-provider.model';
import { PinoLogger } from 'nestjs-pino';
import { User } from 'apps/api/src/core/security/user';
import { PublicCommentDto } from './dto/public-comment.dto';

@Injectable()
export class PublicCommentService extends DataService<PublicComment, Repository<PublicComment>> {
  constructor(
    @InjectRepository(PublicComment)
    repository: Repository<PublicComment>,
    logger: PinoLogger
  ) {
    super(repository, new PublicComment(), logger);
  }

  isCreateAuthorized(user: User, dto: Partial<PublicCommentDto>): boolean {
    return user == null; // Only anonymous user is allowed to create comments.
  }
  
  isUpdateAuthorized(user: User, dto: any, entity: Partial<PublicCommentDto>):boolean {
    if (!user || !user.isForestClient) {
      return false;
    }
    // TODO: Confirm that forest client is authorized for this project based on project's client id.
    //     const project: ProjectDto = await this.projectService.findOne(dto.projectId, user);

    // return user.clientIds.includes(project.forest_client_number));
    return true;
  }

  isDeleteAuthorized(user: User, id: number):boolean {
    return false; // Comments cannot be deleted.
  }

  isViewingAuthorized(user: User):boolean {
    // Public not allowed to view comments.
    return (user && user.isAuthorizedForAdminSite());
  }


}
