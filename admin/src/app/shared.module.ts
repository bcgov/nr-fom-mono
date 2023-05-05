import { NgModule } from '@angular/core';
import { MatLegacyProgressBarModule as MatProgressBarModule } from '@angular/material/legacy-progress-bar';
import { MatLegacySlideToggleModule as MatSlideToggleModule } from '@angular/material/legacy-slide-toggle';
import { MatLegacySnackBarModule as MatSnackBarModule } from '@angular/material/legacy-snack-bar';
import { BrowserModule } from '@angular/platform-browser';

import { NewlinesPipe } from '../core/pipes/newlines.pipe';
import { OrderByPipe } from '../core/pipes/order-by.pipe';
import { PublishedPipe } from '../core/pipes/published.pipe';

import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatIconModule } from '@angular/material/icon';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { ButtonComponent } from '../core/components/button/button.component';
import { DialogComponent } from '../core/components/dialog/dialog.component';
import { UploadBoxComponent } from '../core/components/file-upload-box/file-upload-box.component';
import { FormGroupComponent } from '../core/components/form-group/form-group.component';
import { AppFormControlDirective } from '../core/directives/form-control.directive';
import { FileUploadComponent } from './file-upload/file-upload.component';

@NgModule({
  imports: [BrowserModule, MatSlideToggleModule, MatSnackBarModule, MatDialogModule, MatProgressBarModule, NgxDropzoneModule, MatIconModule, FontAwesomeModule],//LeafletModule

  declarations: [OrderByPipe, NewlinesPipe, PublishedPipe, FileUploadComponent, DialogComponent, ButtonComponent,
    AppFormControlDirective, FormGroupComponent, UploadBoxComponent],

  exports: [
    MatSlideToggleModule,
    MatSnackBarModule,
    MatProgressBarModule,
    OrderByPipe,
    NewlinesPipe,
    PublishedPipe,
    FileUploadComponent,
    DialogComponent,
    AppFormControlDirective,
    ButtonComponent,
    FormGroupComponent,
    FontAwesomeModule,
    UploadBoxComponent,
  ]
})
export class SharedModule {
}
