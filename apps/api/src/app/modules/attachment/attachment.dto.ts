import { ApiProperty, OmitType } from '@nestjs/swagger';

export class AttachmentDto {
  @ApiProperty()
  fileName: string;
  @ApiProperty()
  fileContents: string; // This is actually a bytearray
  @ApiProperty()
  projectId: number;
  @ApiProperty()
  attachmentTypeCode: string;
}

export class UpdateAttachmentDto extends AttachmentDto {}