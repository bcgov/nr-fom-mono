import { ApiProperty } from '@nestjs/swagger';
import { BaseDto } from '../../../../core/dto/base.dto';

export class CreateAttachmentDto extends BaseDto {
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
