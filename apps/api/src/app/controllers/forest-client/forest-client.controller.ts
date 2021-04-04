import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { BaseReadOnlyController } from '@controllers';
import { ForestClientService } from './forest-client.service';
import { ForestClient } from './entities/forest-client.entity';

@ApiTags('ForestClient')
@Controller('ForestClient')
export class ForestClientController extends BaseReadOnlyController<ForestClient> {
  constructor(protected readonly service: ForestClientService) {
    super(service);
  }
}
