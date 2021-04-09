import { OmitType } from '@nestjs/swagger';
import { CutBlockDto } from './cut-block.dto';

export class UpdateCutBlockDto extends OmitType(CutBlockDto, ['id']) {}
