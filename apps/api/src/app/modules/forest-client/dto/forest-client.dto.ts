import { ApiProperty } from '@nestjs/swagger';

export class ForestClientDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;
}
