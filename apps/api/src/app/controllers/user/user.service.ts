import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { DataService } from 'apps/api/src/core/models/data-provider.model';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class UserService extends DataService<User, Repository<User>> {
  constructor(
    @InjectRepository(User)
    userRepository: Repository<User>,
    logger: PinoLogger
  ) {
    super(userRepository, new User(), logger);
  }

  async checkIfUserExists(username: string) {
    // const user = await super.findByQuery({ username });
    const user = {};
    return user;
  }
}
