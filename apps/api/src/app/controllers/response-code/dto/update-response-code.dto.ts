import { OmitType } from '@nestjs/swagger';
import { ResponseCodeDto } from './response-code.dto';

export class UpdateResponseCodeDto extends OmitType(ResponseCodeDto, ['code']) {}
