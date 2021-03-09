import { BaseDto } from '../../../../core/dto/base.dto';

export class CreatePublicCommentDto extends BaseDto {
  feedback: string;
  name: string;
  location: string;
  email: string;
  phoneNumber: string;
  responseDetails: string;
  // Relationships
  projectId: number;
  responseCode: string;
}
