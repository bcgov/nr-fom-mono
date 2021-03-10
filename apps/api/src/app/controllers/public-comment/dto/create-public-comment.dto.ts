import { ApiProperty } from '@nestjs/swagger';
import { BaseDto } from '../../../../core/dto/base.dto';

export class CreatePublicCommentDto extends BaseDto {
  @ApiProperty()
  feedback: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  location: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  phoneNumber: string;
  @ApiProperty()
  responseDetails: string;
  // Relationships
  @ApiProperty()
  projectId: number;
  @ApiProperty()
  responseCode: string;
}
