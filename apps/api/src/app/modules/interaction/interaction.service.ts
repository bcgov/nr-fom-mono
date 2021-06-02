import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Interaction } from './interaction.entity';
import { DataService } from 'apps/api/src/core/models/data.service';
import { PinoLogger } from 'nestjs-pino';
import { User } from 'apps/api/src/core/security/user';
import { ProjectAuthService } from '../project/project-auth.service';
import { WorkflowStateEnum } from '../project/workflow-state-code.entity';

@Injectable()
export class InteractionService extends DataService<Interaction, Repository<Interaction>, Interaction> {
  constructor(
    @InjectRepository(Interaction)
    repository: Repository<Interaction>,
    logger: PinoLogger,
    private projectAuthService: ProjectAuthService,
  ) {
    super(repository, new Interaction(), logger);
  }

  async isCreateAuthorized(dto: any, user?: User): Promise<boolean> {
    return this.projectAuthService.isForestClientUserAllowedStateAccess(dto.projectId, [WorkflowStateEnum.COMMENT_CLOSED], user);
  }
  
  async isUpdateAuthorized(dto: unknown, entity: Interaction, user?: User): Promise<boolean> {
    return this.projectAuthService.isForestClientUserAllowedStateAccess(entity.projectId, [WorkflowStateEnum.COMMENT_CLOSED], user);
  }

  async isDeleteAuthorized(entity: Interaction, user?: User): Promise<boolean> {
    return this.projectAuthService.isForestClientUserAllowedStateAccess(entity.projectId, [WorkflowStateEnum.COMMENT_CLOSED], user);
  }

  async isViewAuthorized(entity: Interaction, user?: User): Promise<boolean> {
    if (!user) {
      return false;
    }

    if (user.isMinistry) {
      return true;
    }

    // We ignore workflow state for viewing.
    return this.projectAuthService.isForestClientUserAccess(entity.projectId, user);
  }


}
