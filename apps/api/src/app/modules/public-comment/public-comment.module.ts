import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PublicComment } from './entities/public-comment.entity';
import { PublicCommentService } from './public-comment.service';
import {
  PublicCommentController,
  PublicCommentsController,
} from './public-comment.controller';
import { ProjectModule } from '../project/project.module';
import { ResponseCodeModule } from '../response-code/response-code.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PublicComment]),
    ProjectModule,
    ResponseCodeModule,
  ],
  controllers: [PublicCommentController, PublicCommentsController],
  providers: [PublicCommentService],
  exports: [],
})
export class PublicCommentModule {}
