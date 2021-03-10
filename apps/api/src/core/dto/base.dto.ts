import { ApiProperty } from '@nestjs/swagger';

export class BaseDto {
  @ApiProperty()
  public id: number;
  // Metadata fields
  @ApiProperty()
  public revisionCount: number;
  @ApiProperty()
  public createTimestamp: string;
  @ApiProperty()
  public createUser: string;
  @ApiProperty()
  public updateTimestamp: string;
  @ApiProperty()
  public updateUser: string
}
