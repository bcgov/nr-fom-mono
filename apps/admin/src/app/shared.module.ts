import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';

import {OrderByPipe} from '../core/pipes/order-by.pipe';
import {NewlinesPipe} from '../core/pipes/newlines.pipe';
import {PublishedPipe} from '../core/pipes/published.pipe';
import {LinkifyPipe} from '../core/pipes/linkify.pipe';

import {FileUploadComponent} from './file-upload/file-upload.component';
import {DialogComponent} from '../core/components/dialog/dialog.component';
import {MatDialogModule} from '@angular/material/dialog';
import {ButtonComponent} from '../core/components/button/button.component';
import {AppFormControlDirective} from '../core/directives/form-control.directive';
import {FormGroupComponent} from '../core/components/form-group/form-group.component';
import {NgxDropzoneModule} from 'ngx-dropzone';
import {UploadBoxComponent} from '../core/components/file-upload-box/file-upload-box.component';
import {MatIconModule} from '@angular/material/icon'
import {FileRowComponent} from '../core/components/file-row/file-row.component';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
// import {LeafletModule} from '@asymmetrik/ngx-leaflet';

@NgModule({
  imports: [BrowserModule, MatSlideToggleModule, MatSnackBarModule, MatDialogModule, NgxDropzoneModule, MatIconModule, FontAwesomeModule],//LeafletModule

  declarations: [OrderByPipe, NewlinesPipe, PublishedPipe, LinkifyPipe, FileUploadComponent, DialogComponent, ButtonComponent,
    FileRowComponent, AppFormControlDirective, FormGroupComponent, UploadBoxComponent],

  exports: [
    MatSlideToggleModule,
    MatSnackBarModule,
    OrderByPipe,
    NewlinesPipe,
    PublishedPipe,
    LinkifyPipe,
    FileUploadComponent,
    DialogComponent,
    AppFormControlDirective,
    ButtonComponent,
    FormGroupComponent,
    FontAwesomeModule,
    FileRowComponent,
    UploadBoxComponent,
    // LeafletModule
  ]
})
export class SharedModule {
}
