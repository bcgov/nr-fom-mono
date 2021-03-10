import { OmitType } from '@nestjs/swagger';
import { CreateCutBlockDto } from './create-cut-block.dto';

export class UpdateCutBlockDto extends OmitType(CreateCutBlockDto, ['id']) {}
