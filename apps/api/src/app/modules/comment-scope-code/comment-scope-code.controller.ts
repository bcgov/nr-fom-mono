import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';

import { CodeTableController } from '@controllers';
import { CommentScopeCodeService } from './comment-scope-code.service';
import { CommentScopeCode } from './entities/comment-scope-code.entity';

@ApiTags('comment-scope-code')
@Controller('comment-scope-code')
export class CommentScopeCodeController extends CodeTableController<CommentScopeCode> {
  constructor(protected readonly service: CommentScopeCodeService) {
    super(service);
  }

  @Get()
  @ApiResponse({ status: 200, type: [CommentScopeCode] })
  async findAll(): Promise<CommentScopeCode[]> {
    return super.findAll();
  }

}
