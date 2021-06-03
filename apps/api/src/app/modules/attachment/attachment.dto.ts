import { ApiProperty } from '@nestjs/swagger';

import { AttachmentTypeCode, AttachmentTypeEnum } from './attachment-type-code.entity';

// See AttachmentController.create for why these are not annotated with @ApiProperty.
export class AttachmentCreateRequest {
  projectId: number;

  fileName: string; 

  fileContents: Buffer; 

  attachmentTypeCode: string;
}

export class AttachmentResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  projectId: number;

  @ApiProperty()
  fileName: string; 

  @ApiProperty({ enum: AttachmentTypeEnum, enumName: 'AttachmentTypeEnum'})
  attachmentType: AttachmentTypeCode;

  // Don't need revisionCount because updates are not allowed.
}

export class AttachmentFileResponse extends AttachmentResponse {

  @ApiProperty()
  fileContents: Buffer; 

}
