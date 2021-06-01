import { Controller, Get, Post, Delete, Body, Param, HttpStatus, Query, UseInterceptors, UploadedFile, Res, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Express } from 'express';
import { Multer } from 'multer';

import { BaseController } from '@controllers';
import { AttachmentService } from './attachment.service';
import { Attachment } from './attachment.entity';
import { AttachmentCreateRequest, AttachmentFileResponse, AttachmentResponse } from './attachment.dto';
import { UserHeader, UserRequiredHeader } from 'apps/api/src/core/security/auth.service';
import { User } from 'apps/api/src/core/security/user';
import { FileInterceptor } from '@nestjs/platform-express';

// TODO: Need to decide if using binary or base64
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
        attachmentTypeCode: {
          type: 'string'
        }
      },
    },
  })(target, propertyKey, descriptor);
};

@ApiTags('attachment')
@Controller('attachment')
export class AttachmentController extends BaseController<Attachment> {
  
  constructor(protected readonly service: AttachmentService) {
    super(service);
  }

  // Need to use syntax that deviates considerably from other controllers in order to get post working with multipart/form-data that includes both a file and additional properties.
  // The normal @Body annotation didn't work in combination because the payload is form data, not a JSON document.
  @Post()
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: 100, files: 1} }))  // TODO: Adjust file size. On failure returns HTTP 413 - payload too large.
  @ApiConsumes('multipart/form-data')
  @AttachmentPostBody() // This provides the OpenAPI documentation.
  async create(
    @UserRequiredHeader() user: User,
    @UploadedFile('file') file: Express.Multer.File,
    @Req() request: Request
    ): Promise<AttachmentResponse> {

    const createRequest = new AttachmentCreateRequest();

    // 'Manually' extract form properties from the request and from the file.
    createRequest.projectId = request.body['projectId'];
    createRequest.attachmentTypeCode = request.body['attachmentTypeCode'];
    createRequest.fileName = file.originalname;
    createRequest.fileContents = file.buffer;

    return this.service.create(createRequest, user);
  }

  // Accessible by public (if attachment type not interaction) and by authenticated users.
  @Get(':id')
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.OK, type: AttachmentResponse})
  async findOne(
    @UserHeader() user: User,
    @Param('id') id: number) {
    return this.service.findOne(id, user);
  }

  @Get('/file/:id')
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.OK, type: AttachmentFileResponse }) 
  async getFileContents(
    @UserHeader() user: User,
    @Param('id') id: number): Promise<AttachmentFileResponse> {
    const attachmentFileResponse = await this.service.getFileContent(id, user);

    // TODO
    // var fileData = Buffer.from(result_find.data, 'base64');
    // res.writeHead(200, {
    // 'Content-Type': result_find.mimeType,
    // 'Content-Disposition': 'attachment; filename=' + result_find.name,
    // 'Content-Length': fileData.length
    // });
    // res.write(fileData);

    return attachmentFileResponse;
  }

  @Get()
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.OK, type: [AttachmentResponse] }) 
  async find(
    @UserHeader() user: User,
    @Query('projectId') projectId: number): Promise<AttachmentResponse[]> {
      return this.service.findByProjectId(projectId, user);
  }


  @Delete(':id')
  @ApiBearerAuth()
  async remove(
    @UserRequiredHeader() user: User,
    @Param('id') id: number) {
    return this.service.delete(id);
  }

}
