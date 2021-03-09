import { PartialType } from '@nestjs/mapped-types';
import { CreateCutBlockDto } from './create-cut-block.dto';

export class UpdateCutBlockDto extends PartialType(CreateCutBlockDto) {}
