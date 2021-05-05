import { ApiProperty } from '@nestjs/swagger';
import { BaseDto } from '@dto';

export class AttachmentDto extends BaseDto {
  @ApiProperty()
  fileName: string;
  @ApiProperty()
  fileContents: string; // bytearray
  // Relationships
  @ApiProperty()
  projectId: number;
  @ApiProperty()
  attachmentTypeCode: string;
}
