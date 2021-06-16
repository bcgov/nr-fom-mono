import { ApiProperty, OmitType } from '@nestjs/swagger';
import { IsDateString, IsInt, IsOptional, MaxLength, MinLength, ValidateIf } from 'class-validator';

export class InteractionCreateRequest {
  constructor(projectId = null, 
              stakeholder = null, 
              communicationDate = null, 
              communicationDetails = null,
              fileName = null,
              file = null) {
    this.projectId = projectId;
    this.stakeholder = stakeholder;
    this.communicationDate = communicationDate;
    this.communicationDetails = communicationDetails;
    this.fileName = fileName;
    this.file = file;
  }

  @ApiProperty()
  @IsInt({message: '"$property" must be a number.'})
  projectId: number;
  
  @ApiProperty({ required: false })
  @IsOptional()
  stakeholder: string;

  @ApiProperty({ required: false })
  @IsDateString(null, {message: '"$property" must be ISO-formatted date.'})
  communicationDate?: string;

  @ApiProperty()
  @MaxLength(4000)
  @MinLength(1, {message: '"$property" must have at least 1 character.'}) 
  communicationDetails: string;
  
  fileName: string; 

  file: Buffer;
}

export class InteractionResponse extends OmitType(InteractionCreateRequest, ['file', 'fileName']) {
  @ApiProperty()
  id: number;

  @ApiProperty()
  revisionCount: number;

  @ApiProperty({ description: 'ISO-formatted timestamp'})
  createTimestamp: string;

  @ApiProperty()
  attachmentId: number;
}