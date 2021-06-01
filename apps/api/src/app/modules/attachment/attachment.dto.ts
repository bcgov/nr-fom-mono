import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsEnum } from 'class-validator';

import { AttachmentTypeCode, AttachmentTypeEnum } from './attachment-type-code.entity';

export class AttachmentCreateRequest {
  @ApiProperty()
  @IsDefined()
  projectId: number;

  @ApiProperty()
  @IsDefined()
  fileName: string; 

  @ApiProperty()
  @IsDefined()
  fileContents: string; // This is actually a bytearray

  @ApiProperty()
  @IsEnum(AttachmentTypeEnum)
  attachmentTypeCode: string;

}

export class AttachmentResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  projectId: number;

  @ApiProperty()
  fileName: string; 

  @ApiProperty()
  attachmentType: AttachmentTypeCode;

  // Don't need revisionCount because updates are not allowed.
}
