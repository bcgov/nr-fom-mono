import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CutBlock } from './entities/cut-block.entity';
import { CutBlockService } from './cut-block.service';

@Module({
  imports: [TypeOrmModule.forFeature([CutBlock])],
  providers: [CutBlockService],
  exports: [],
})
export class CutBlockModule {}
