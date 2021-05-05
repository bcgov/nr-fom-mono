import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';

import { CodeTableController } from '@controllers';
import { CommentScopeCodeService } from './comment-scope-code.service';
import { CommentScopeCode } from './entities/comment-scope-code.entity';
import { CommentScopeCodeDto } from './dto/comment-scope-code.dto';
import { UpdateCommentScopeCodeDto } from './dto/update-comment-scope-code.dto';

@ApiTags('comment-scope-code')
@Controller('comment-scope-code')
export class CommentScopeCodeController extends CodeTableController<
  CommentScopeCode,
  CommentScopeCodeDto,
  UpdateCommentScopeCodeDto
> {
  constructor(protected readonly service: CommentScopeCodeService) {
    super(service);
  }

  @Get()
  @ApiResponse({ status: 200, type: [CommentScopeCodeDto] })
  async findAll(): Promise<CommentScopeCodeDto[]> {
    return super.findAll();
  }

  @Get(':id')
  @ApiResponse({ status: 200, type: CommentScopeCodeDto })
  async findOne(@Param('id') id: string): Promise<CommentScopeCodeDto> {
    return super.findOne(id);
  }
}
