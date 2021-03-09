import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PublicComment } from './entities/public-comment.entity';
import { PublicCommentService } from './public-comment.service';
import { PublicCommentController } from './public-comment.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PublicComment])],
  controllers: [PublicCommentController],
  providers: [PublicCommentService],
  exports: []
})
export class PublicCommentModule {}
