import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CutBlock } from './entities/cut-block.entity';
import { CutBlockService } from './cut-block.service';
import {
  CutBlockController,
  CutBlocksController,
} from './cut-block.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CutBlock])],
  controllers: [CutBlockController, CutBlocksController],
  providers: [CutBlockService],
  exports: [],
})
export class CutBlockModule {}
