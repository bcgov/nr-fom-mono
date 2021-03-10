import { OmitType } from '@nestjs/swagger';
import { CreateInteractionDto } from './create-interaction.dto';

export class UpdateInteractionDto extends OmitType(CreateInteractionDto, ['id']) {}
