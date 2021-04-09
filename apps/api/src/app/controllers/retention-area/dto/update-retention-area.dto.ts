import { OmitType } from '@nestjs/swagger';
import { RetentionAreaDto } from './retention-area.dto';

export class UpdateRetentionAreaDto extends OmitType(RetentionAreaDto, ['id']) {}
