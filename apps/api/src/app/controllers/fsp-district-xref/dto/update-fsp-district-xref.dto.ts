import { OmitType } from '@nestjs/swagger';
import { FspDistrictXrefDto } from './fsp-district-xref.dto';

export class UpdateFspDistrictXrefDto extends OmitType(FspDistrictXrefDto, [
  'id',
]) {}
