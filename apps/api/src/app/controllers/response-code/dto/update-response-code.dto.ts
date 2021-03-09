import { PartialType } from '@nestjs/mapped-types';
import { CreateResponseCodeDto } from './create-response-code.dto';

export class UpdateResponseCodeDto extends PartialType(CreateResponseCodeDto) {}
