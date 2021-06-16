import { Controller, Get, Post, Put, Delete, Body, Param, HttpStatus, ValidationPipe, UsePipes, Query, ParseIntPipe, UseInterceptors, UploadedFile, BadRequestException, HttpException, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiResponse, ApiTags } from '@nestjs/swagger';

import { InteractionService } from './interaction.service';
import { PinoLogger } from 'nestjs-pino';
import { InteractionCreateRequest, InteractionResponse } from './interaction.dto';
import { UserRequiredHeader } from 'apps/api/src/core/security/auth.service';
import { User } from 'apps/api/src/core/security/user';
import { FileInterceptor } from '@nestjs/platform-express';
import { maxFileSizeBytes } from '../attachment/attachment.controller';
import { validate } from 'class-validator';
import dayjs = require('dayjs');
import _ = require('lodash');

// From https://github.com/nestjs/swagger/issues/417#issuecomment-562869578 and https://swagger.io/docs/specification/describing-request-body/file-upload/
const AttachmentPostBody = (fileName: string = 'file'): MethodDecorator => (
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor,
) => {
  ApiBody({
    schema: {
      type: 'object',
      properties: {
        [fileName]: {
          type: 'string',
          format: 'binary',
        },
        projectId: {
          type: 'number'
        },
        stakeholder: {
          type: 'string'
        },
        communicationDate: {
          type: 'string'
        },
        communicationDetails: {
          type: 'string'
        }
      },
    },
  })(target, propertyKey, descriptor);
};

@ApiTags('interaction')
@Controller('interaction')
export class InteractionController {

  constructor(
    private readonly service: InteractionService, 
    private logger: PinoLogger) {
  }

  @Post()
  // @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: maxFileSizeBytes, files: 1} }))
  @ApiConsumes('multipart/form-data')
  @AttachmentPostBody() // This provides the OpenAPI documentation.
  @ApiResponse({ status: HttpStatus.CREATED })
  async create(
    // @UserRequiredHeader() user: User,
    @UploadedFile('file') file: Express.Multer.File,
    @Req() request: Request): Promise<void> {
      const reqDate = _.isEmpty(request.body['communicationDate'])
                      ? dayjs().format('YYYY-MM-DD')
                      : dayjs(request.body['communicationDate']).format('YYYY-MM-DD');
      const createRequest = new InteractionCreateRequest(
        await new ParseIntPipe().transform(request.body['projectId'], null),
        request.body['stakeholder'],
        reqDate,
        request.body['communicationDetails'],
        file? file.originalname: null,
        file? file.buffer: null
      );

      // Validate fields.
      const vErrors = await validate(createRequest, { validationError: { target: false } });
      if (vErrors && vErrors.length >=1) {
        const errMsgs = vErrors.map(oErr => Object.values(oErr.constraints)[0]);
        console.log("validate errors: ", errMsgs);
        throw new BadRequestException(`Validation failed (${errMsgs})`);
      }
      // const created = await this.service.create(request, user); // TODO
  }

  @Get()
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.OK, type: [InteractionResponse] })
  async find(
    @UserRequiredHeader() user: User,
    @Query('projectId', ParseIntPipe) projectId: number): Promise<InteractionResponse[]> {
      // return this.service.findByProjectId(projectId, user); // TODO
      return null;
  }
}