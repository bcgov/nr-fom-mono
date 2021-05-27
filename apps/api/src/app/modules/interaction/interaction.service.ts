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

  async isCreateAuthorized(dto: unknown, user?: User): Promise<boolean> {
    // TODO: Verify client ID
    return user.isForestClient;
  }
  
  async isUpdateAuthorized(dto: unknown, entity: Interaction, user?: User): Promise<boolean> {
    // TODO: Verify client ID
    return user.isForestClient;
  }

  async isDeleteAuthorized(entity: Interaction, user?: User): Promise<boolean> {
    // TODO: Verify client ID
    return user.isForestClient;
  }

  async isViewAuthorized(entity: Interaction, user?: User): Promise<boolean> {
    // TODO: Verify client ID
    return false;
  }


}
