import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';

import * as R from 'remeda';

const fileTypes = ['pdf', 'img', 'text', 'word', 'excel'] as const;
export type FileType = typeof fileTypes[number];
export type FileRecord = Record<FileType, IconDefinition>;
import {
  faFilePdf,
  faImage,
  faFileWord,
  faFileExcel,
  faFileAlt,
  IconDefinition,
} from '@fortawesome/free-solid-svg-icons';

export const FILE_TYPES: FileRecord = {
  pdf: faFilePdf,
  img: faImage,
  word: faFileWord,
  excel: faFileExcel,
  text: faFileAlt,
} as const;
const fileMap: FileRecord = R.clone(FILE_TYPES);
export class FileTypeFns {
  static fileExt(fileName: string) {
    if (!fileName.includes('.')) return 'file format not set';
    const fileExt = fileName.split('.');
    return fileExt[fileExt.length - 1];
  }
  static fileType(fileTypeStr: string) {
    if (
      [
        'jpg',
        'jpeg',
        'bmp',
        'gif',
        'png',
        'image/tiff',
        'image/x-tiff',
        'image/x-windows-bmp',
        'gif',
        'tiff',
        'tff',
      ].includes(fileTypeStr)
    ) {
      return fileMap.img;
    }
    if (fileTypeStr === 'txt') {
      return fileMap.text;
    }

    if (['doc', 'docx'].includes(fileTypeStr)) {
      return fileMap.word;
    }
    if (['xls', 'xlsx'].includes(fileTypeStr)) {
      return fileMap.excel;
    }
    if (['pdf'].includes(fileTypeStr)) {
      return fileMap.pdf;
    }
    console.log('no file type set');

    return fileMap.text;
  }

  static IsDeleteLocked(createdDate: Date): boolean {
    const datetimeNow = new Date(Date.now());
    //Greater that 24 hours in milliseconds
    return datetimeNow.getTime() - createdDate.getTime() > 86400000;
  }
}


@Component({
  selector: 'app-file-row',
  template: `
    <div class="col-md-12">
      <div class="row">
        <div class="col-md-1">
      <fa-icon [icon]="icon" class="file-icon"> </fa-icon>
</div>

        <div class="col-md-2">
          <!-- client display name -->
          {{ displayName }}
        </div>
        <div class="col-md-2">
          <!-- doc type -->
          {{ docType }}
</div>
         <div class="col-md-2">{{ this.date }}</div
        >.{{ fileExt }}
      <div class="col-md-2">{{ fileSizeCalc }}</div>

          <div class="col-md-2">
      <mat-icon class="cancel-icon">
          cancel
        </mat-icon>
</div>
      </div>
      <!-- file size -->
      <!-- remove item -->
      <!-- <button mat-icon-button (click)="remove.emit(index)"> -->

      <!-- </button> -->
    </div>
  `,
  styleUrls: ['./file-row.component.scss'],
})
export class FileRowComponent implements OnInit {
  get fileSizeCalc() {
    return `${(this.fileSize / 10).toString()} kb`;
  }

  fileMap: FileRecord = R.clone(FILE_TYPES);

  @Input() index: number;
  @Input() fileTypeStr: string;
  @Input() displayName = 'No client selected';
  @Input() docType: string;
  @Input() date: string;
  @Input() fileSize: number;
  @Input() fileName: string;

  @Output() remove = new EventEmitter<number>();

  fileType: IconDefinition;
  fileExt: string;

  get icon() {
    const fileExt = FileTypeFns.fileExt(this.fileName);
    const icon = FileTypeFns.fileType(fileExt);
    return icon;
  }

  ngOnInit(): void {
    if (!this.fileTypeStr) {
      throw new Error('no file type string set');
    }

    this.setFileType(this.fileTypeStr);
    this.setFileExt();
  }

  setFileExt() {
    const fileExt = this.fileName.split('.');
    this.fileExt = fileExt[fileExt.length - 1];
  }

  setFileType(fileTypeStr: string) {
    if (
      [
        'image/png',
        'image/jpeg',
        'image/tiff',
        'image/x-tiff',
        'image/bmp',
        'image/x-windows-bmp',
        'image/gif',
      ].includes(fileTypeStr)
    ) {
      const fileType = this.fileMap.img;
      return (this.fileType = fileType);
    }
    if (fileTypeStr === 'text/plain') {
      return (this.fileType = this.fileMap.text);
    }
    if (fileTypeStr === 'application/pdf') {
      return (this.fileType = this.fileMap.pdf);
    }

    if (
      ['application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'].includes(
        fileTypeStr
      )
    ) {
      return (this.fileType = this.fileMap.word);
    }

    if (
      ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'].includes(
        fileTypeStr
      )
    ) {
      return (this.fileType = this.fileMap.excel);
    }

    return (this.fileType = this.fileMap.text);
  }
}
