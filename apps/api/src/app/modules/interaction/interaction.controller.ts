import { Controller, Get, Post, Put, Param, HttpStatus, Query, ParseIntPipe, UseInterceptors, BadRequestException, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiResponse, ApiTags } from '@nestjs/swagger';

import { InteractionService } from './interaction.service';
import { PinoLogger } from 'nestjs-pino';
import { InteractionCreateRequest, InteractionResponse, InteractionUpdateRequest } from './interaction.dto';
import { UserRequiredHeader } from 'apps/api/src/core/security/auth.service';
import { User } from 'apps/api/src/core/security/user';
import { FileInterceptor } from '@nestjs/platform-express';
import { maxFileSizeBytes } from '../attachment/attachment.controller';
import { validate } from 'class-validator';
import dayjs = require('dayjs');
import _ = require('lodash');

// From https://github.com/nestjs/swagger/issues/417#issuecomment-562869578 and https://swagger.io/docs/specification/describing-request-body/file-upload/
const AttachmentPostBody = (file: string = 'file'): MethodDecorator => (
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor,
) => {
  ApiBody({
    schema: {
      type: 'object',
      properties: {
        [file]: {
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
        },
        filename: {     // add extra 'filename' field for posted form's params
          type: 'string'
        }
      },
    },
  })(target, propertyKey, descriptor);
};

const AttachmentUpdateBody = (file: string = 'file'): MethodDecorator => (
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor,
) => {
  ApiBody({
    schema: {
      type: 'object',
      properties: {
        [file]: {
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
        },
        revisionCount: {
          type: 'number'
        },
        filename: {
          type: 'string'
        }
      },
    },
  })(target, propertyKey, descriptor);
};

@ApiTags('interaction')
@Controller('interaction')
export class InteractionController {

  readonly DATE_FORMAT='YYYY-MM-DD';

  constructor(
    private readonly service: InteractionService, 
    private logger: PinoLogger) {
  }

  @Post()
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: maxFileSizeBytes, files: 1} }))
  @ApiConsumes('multipart/form-data')
  @AttachmentPostBody() // This provides the OpenAPI documentation.
  @ApiResponse({ status: HttpStatus.CREATED })
  async create(
    @UserRequiredHeader() user: User,
    // @UploadedFile('file') file: Express.Multer.File,
    @Req() request: Request): Promise<InteractionResponse> {
      const reqDate = _.isEmpty(request.body['communicationDate'])
                      ? dayjs().format(this.DATE_FORMAT)
                      : dayjs(request.body['communicationDate']).format(this.DATE_FORMAT);
      const createRequest = new InteractionCreateRequest(
        await new ParseIntPipe().transform(request.body['projectId'], null),
        request.body['stakeholder'],
        reqDate,
        request.body['communicationDetails'],
        request.body['filename'],
        request.body['file']    // note, using formData posted, we can obtain fileContent/filename directly from post body.
      );

      // Validate fields.
      const vErrors = await validate(createRequest, { validationError: { target: false } });
      if (vErrors && vErrors.length >=1) {
        const errMsgs = vErrors.map(oErr => Object.values(oErr.constraints)[0]);
        this.logger.debug('Create Interaction validation errors: %o', errMsgs);
        throw new BadRequestException(`Validation failed (${errMsgs})`);
      }
      return this.service.create(createRequest, user);
  }

  @Get()
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.OK, type: [InteractionResponse] })
  async find(
    @UserRequiredHeader() user: User,
    @Query('projectId', ParseIntPipe) projectId: number): Promise<InteractionResponse[]> {
      return this.service.findByProjectId(projectId, user);
  }

  @Put(':id')
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: maxFileSizeBytes, files: 1} }))
  @ApiConsumes('multipart/form-data')
  @AttachmentUpdateBody()
  @ApiResponse({ status: HttpStatus.OK, type: InteractionResponse })
  async update(
    @UserRequiredHeader() user: User,
    @Param('id', ParseIntPipe) id: number,
    // @UploadedFile('file') file: Express.Multer.File,
    @Req() request: Request): Promise<InteractionResponse> {
      const reqDate = _.isEmpty(request.body['communicationDate'])
                      ? dayjs().format(this.DATE_FORMAT)
                      : dayjs(request.body['communicationDate']).format(this.DATE_FORMAT);
      const updateRequest = new InteractionUpdateRequest(
        await new ParseIntPipe().transform(request.body['projectId'], null),
        request.body['stakeholder'],
        reqDate,
        request.body['communicationDetails'],
        request.body['filename'],
        request.body['file'],
        id,
        await new ParseIntPipe().transform(request.body['revisionCount'], null)
      );

      // Validate fields.
      const vErrors = await validate(updateRequest, { validationError: { target: false } });
      if (vErrors && vErrors.length >=1) {
        const errMsgs = vErrors.map(oErr => Object.values(oErr.constraints)[0]);
        this.logger.debug('Update Interaction validation errors: %o', errMsgs);
        throw new BadRequestException(`Validation failed (${errMsgs})`);
      }
      return this.service.update(id, updateRequest, user);
  }

}