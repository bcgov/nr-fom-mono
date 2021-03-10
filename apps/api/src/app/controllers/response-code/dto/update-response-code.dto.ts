import { OmitType } from '@nestjs/swagger';
import { CreateResponseCodeDto } from './create-response-code.dto';

export class UpdateResponseCodeDto extends OmitType(CreateResponseCodeDto, ['code']) {}
