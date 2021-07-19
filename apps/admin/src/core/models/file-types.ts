import {
  faFilePdf,
  faImage,
  faFileWord,
  faFileExcel,
  faFileAlt,
  IconDefinition,
} from '@fortawesome/free-solid-svg-icons';

import * as R from 'remeda';

const fileTypes = ['pdf', 'img', 'text', 'word', 'excel'] as const;
export type FileType = typeof fileTypes[number];
export type FileRecord = Record<FileType, IconDefinition>;

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


}
