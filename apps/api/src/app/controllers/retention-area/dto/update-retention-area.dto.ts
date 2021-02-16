import { PartialType } from '@nestjs/mapped-types';
import { CreateRetentionAreaDto } from './create-retention-area.dto';

export class UpdateRetentionAreaDto extends PartialType(CreateRetentionAreaDto) {}
