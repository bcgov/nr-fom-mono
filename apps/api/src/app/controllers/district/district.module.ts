import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { District } from './entities/district.entity';
import { DistrictService } from './district.service';
import { DistrictController } from './district.controller';

@Module({
  imports: [TypeOrmModule.forFeature([District])],
  controllers: [DistrictController],
  providers: [DistrictService],
  exports: []
})
export class DistrictModule {}
