import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ResponseCode } from './entities/response-code.entity';
import { ResponseCodeService } from './response-code.service';
import { ResponseCodeController } from './response-code.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ResponseCode])],
  controllers: [ResponseCodeController],
  providers: [ResponseCodeService],
  exports: [ResponseCodeService]
})
export class ResponseCodeModule {}
