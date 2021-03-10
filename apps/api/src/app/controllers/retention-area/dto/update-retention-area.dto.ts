import { OmitType } from '@nestjs/swagger';
import { CreateRetentionAreaDto } from './create-retention-area.dto';

export class UpdateRetentionAreaDto extends OmitType(CreateRetentionAreaDto, ['id']) {}
