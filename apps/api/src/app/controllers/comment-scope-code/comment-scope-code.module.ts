import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CommentScopeCode } from './entities/comment-scope-code.entity';
import { CommentScopeCodeService } from './comment-scope-code.service';
import { CommentScopeCodeController } from './comment-scope-code.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CommentScopeCode])],
  controllers: [CommentScopeCodeController],
  providers: [CommentScopeCodeService],
  exports: [CommentScopeCodeService]
})
export class CommentScopeCodeModule {}
