import { ApiProperty } from '@nestjs/swagger';
import { BaseDto } from '@dto';

export class DistrictDto extends BaseDto {
  @ApiProperty()
  name: string;
}
