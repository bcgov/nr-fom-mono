import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Interaction } from './interaction.entity';
import { DataService } from 'apps/api/src/core/models/data.service';
import { PinoLogger } from 'nestjs-pino';
import { User } from 'apps/api/src/core/security/user';

@Injectable()
export class InteractionService extends DataService<Interaction, Repository<Interaction>, Interaction> {
  constructor(
    @InjectRepository(Interaction)
    repository: Repository<Interaction>,
    logger: PinoLogger
  ) {
    super(repository, new Interaction(), logger);
  }

  isCreateAuthorized(user: User, dto: unknown): boolean {
    // TODO: Verify client ID
    return user.isForestClient;
  }
  
  isUpdateAuthorized(user: User, dto: any, entity: Interaction): boolean {
    // TODO: Verify client ID
    return user.isForestClient;
  }

  isDeleteAuthorized(user: User, id: number | string): boolean {
    // TODO: Verify client ID
    return user.isForestClient;
  }

  isViewAuthorized(entity: Interaction, user?: User): boolean {
    // TODO: Verify client ID
    return false;
  }


}
