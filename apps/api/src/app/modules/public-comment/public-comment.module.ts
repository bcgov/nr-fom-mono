import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PublicComment } from './public-comment.entity';
import { PublicCommentService } from './public-comment.service';
import { PublicCommentController } from './public-comment.controller';
import { ProjectModule } from '../project/project.module';
import { SecurityModule } from 'apps/api/src/core/security/security.module';
import { CommentScopeCodeController } from './comment-scope-code.controller';
import { CommentScopeCodeService } from './comment-scope-code.service';
import { CommentScopeCode } from './comment-scope-code.entity';
import { ResponseCode } from './response-code.entity';
import { ResponseCodeController } from './response-code.controller';
import { ResponseCodeService } from './response-code.service';
import { ProjectAuthModule } from '../project/project-auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PublicComment, CommentScopeCode, ResponseCode]),
    ProjectAuthModule,
    SecurityModule,
  ],
  controllers: [PublicCommentController, CommentScopeCodeController, ResponseCodeController],
  providers: [PublicCommentService, CommentScopeCodeService, ResponseCodeService],
  exports: [PublicCommentService],
})
export class PublicCommentModule {}
