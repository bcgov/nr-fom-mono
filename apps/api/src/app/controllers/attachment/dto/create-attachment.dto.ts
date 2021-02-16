import { BaseDto } from '../../../../core/dto/base.dto';

export class CreateAttachmentDto extends BaseDto {
  fileName: string;
  fileContents: string; // bytearray
  // Relationships
  projectId: number;
  attachmentTypeCode: string;
}
