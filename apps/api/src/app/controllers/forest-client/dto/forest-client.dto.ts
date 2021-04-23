import { ApiProperty } from '@nestjs/swagger';
import { BaseDto } from '@dto';

export class ForestClientDto extends BaseDto {
  @ApiProperty()
  name: string;
}
