import { OmitType } from '@nestjs/swagger';
import { CreateFspDistrictXrefDto } from './create-fsp-district-xref.dto';

export class UpdateFspDistrictXrefDto extends OmitType(CreateFspDistrictXrefDto, ['id']) {}
