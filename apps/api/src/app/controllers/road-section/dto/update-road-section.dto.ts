import { OmitType } from '@nestjs/swagger';
import { CreateRoadSectionDto } from './create-road-section.dto';

export class UpdateRoadSectionDto extends OmitType(CreateRoadSectionDto, ['id']) {}
