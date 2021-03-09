import { Controller } from '@nestjs/common';
import { BaseController } from '../../../core/controllers/base.controller';
import { RoadSectionService } from './road-section.service';
import { RoadSection } from './entities/road-section.entity';
import { CreateRoadSectionDto } from './dto/create-road-section.dto';
import { UpdateRoadSectionDto } from './dto/update-road-section.dto';

@Controller('road-section')
export class RoadSectionController extends BaseController<
  RoadSection,
  CreateRoadSectionDto,
  UpdateRoadSectionDto
> {
  constructor(protected readonly service: RoadSectionService) {
    super(service);
  }
}
