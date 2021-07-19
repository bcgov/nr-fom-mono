import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { faLock } from '@fortawesome/free-solid-svg-icons';

import * as R from 'remeda';

@Component({
  selector: 'app-upload-box',
  template: `
    <div class="upload-group">
      <div class="upload-control">
        <ngx-dropzone
          (change)="onSelect($event)"
          #uploader
          [multiple]="multipleFiles"
          [accept]="allowedFileTypes"
          [maxFileSize]="maxFileSize"
          [class.no-files-border]="noFiles"
        >
          <ngx-dropzone-label>
            <span class="material-icons">
              cloud_upload
            </span>
            <div>{{ multipleFiles ? dragMultipleFileMessage : dragSingleFileMessage }} or  <a href="javascript:void(0)">Browse</a> </div>
          </ngx-dropzone-label>
          <ng-container *ngFor="let f of files">
            <ngx-dropzone-image-preview ngx-dropzone-image-preview   ngProjectAs="ngx-dropzone-preview"   [removable]="true" (removed)="onRemove(f)" [file]="f" *ngIf="isImageType(f.type)">
              <ngx-dropzone-label>{{ f.name }}</ngx-dropzone-label>
            </ngx-dropzone-image-preview>
            <ngx-dropzone-preview *ngIf="!isImageType(f.type)" (removed)="onRemove(f)" [removable]="true" >
              <ngx-dropzone-label>{{ f.name }}</ngx-dropzone-label>
            </ngx-dropzone-preview>
          </ng-container>
        </ngx-dropzone>
        <ng-container *ngIf="invalidTypeText">
          <span class="invalid-type-msg">{{ invalidTypeText }}</span>
        </ng-container>
      </div>
    </div>
  `,
  styleUrls: ['./file-upload-box.component.scss'],
})
export class UploadBoxComponent implements OnInit {
  isImageType( type: string ) {
    const imageTypes = [
      'image/png',
    'image/jpeg',
    'image/tiff',
    'image/x-tiff',
    'image/bmp',
    'image/x-windows-bmp',
    'image/gif',

    ]
    return imageTypes.includes(type)
  }
  @Input() multipleFiles = false;
  @Input() title = 'No client set';
  @Input() noFiles = false;
  @Input() fileType: string;
  @Input() fileDate: string;
  @Input() date: string;
  @Input() maxFileSizeMB: number;
  @Input() isBlob: boolean = false;
  dragMultipleFileMessage: string ='Drag files to upload';
  dragSingleFileMessage: string = 'Drag file to upload';

  @Output() fileUploaded = new EventEmitter<File[]>();
  @Output() outputFileContent = new EventEmitter<string>();
  monthVal = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  faLock = faLock;

  @Input() fileTypes: string[] = [
    'image/png',
    'image/jpeg',
    'image/tiff',
    'image/x-tiff',
    'image/bmp',
    'image/x-windows-bmp',
    'image/gif',

    'text/plain',

    'application/pdf',

    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword',

    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel',
  ];

  // browse Link opens the file prompt
  @Input() files: File[] = [];

  @Input() publicNoticeDocument: File = null;

  // limit for file types (set from global config)
  allowedFileTypes: string;

  // bytes - default to max 10mb (set from global config)
  maxFileSize = 0;
  invalidTypeText: string;
  fileContent: string;
  fileContentArrayBuffer: any;

  constructor() { }
  ngOnInit(): void {

    /* file size multiplied by 1024 for conversion */
    this.maxFileSize = (this.maxFileSizeMB ? this.maxFileSizeMB : 10) * 1048576;
    this.allowedFileTypes = this.fileTypes.join(', ');
  }

  onSelect(event) {
    this.files = R.concat(event.addedFiles, this.files);
    this.invalidTypeText = null;

    //This will be logged if you attempt to upload multiple files at a time
    if (event.rejectedFiles.some((r) => r.reason === 'type')) {
      this.invalidTypeText = 'The file type is not accepted';
    } else if (event.rejectedFiles.some((r) => r.reason === 'size')) {
      this.invalidTypeText = 'The file size cannot exceed ' + this.maxFileSize / 1048576 + ' MB.';
    } else if (event.rejectedFiles.some((r) => r.reason === 'no_multiple')) {
      this.invalidTypeText = 'Only one file can be uploaded';
    }

    if (this.files.length > 1 && !this.multipleFiles){
      this.invalidTypeText = 'Only one document is allowed';
      this.onRemove(event);
    }
    if (event.addedFiles.length > 0 ) {
      if( this.isBlob){
        this.readFileContentAsBlob(this.files[0])
      } else {
        this.readFileContent(this.files[0]);
      }
    }
  }

  readFileContent(file: File) {
    let reader = new FileReader();
    reader.addEventListener('load', (event) => {
      this.fileContent = event.target.result.toString();
      this.fileUploaded.emit(this.files);
      this.outputFileContent.emit(this.fileContent);
    })
    reader.readAsText(file);
  }

  readFileContentAsBlob(file: Blob) {
    let reader = new FileReader();
    reader.addEventListener('load', (event) => {
      this.fileContentArrayBuffer = event.target.result;
      this.fileUploaded.emit(this.files);
      this.outputFileContent.emit(this.fileContentArrayBuffer);
    })
    reader.readAsArrayBuffer(file);
  }

  onRemove(event) {
    this.files.splice(this.files.indexOf(event), 1);
    this.fileUploaded.emit(this.files);
  }
}
