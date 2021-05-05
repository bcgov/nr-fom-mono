import { OmitType } from '@nestjs/swagger';
import { RoadSectionDto } from './road-section.dto';

export class UpdateRoadSectionDto extends OmitType(RoadSectionDto, ['id']) {}
