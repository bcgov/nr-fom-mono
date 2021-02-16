import { PartialType } from '@nestjs/mapped-types';
import { CreateFspDistrictXrefDto } from './create-fsp-district-xref.dto';

export class UpdateFspDistrictXrefDto extends PartialType(CreateFspDistrictXrefDto) {}
