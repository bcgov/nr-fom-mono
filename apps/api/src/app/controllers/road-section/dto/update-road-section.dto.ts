import { PartialType } from '@nestjs/mapped-types';
import { CreateRoadSectionDto } from './create-road-section.dto';

export class UpdateRoadSectionDto extends PartialType(CreateRoadSectionDto) {}
