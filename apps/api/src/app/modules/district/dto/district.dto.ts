import { ApiProperty } from '@nestjs/swagger';

export class DistrictDto {
  @ApiProperty()
  public id: number;

  @ApiProperty()
  name: string;
}
