import { OmitType } from '@nestjs/swagger';
import { InteractionDto } from './interaction.dto';

export class UpdateInteractionDto extends OmitType(InteractionDto, ['id']) {}
