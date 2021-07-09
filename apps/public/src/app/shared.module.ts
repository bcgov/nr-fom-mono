import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { OrderByPipe } from '../core/pipes/order-by.pipe';
import { NewlinesPipe } from '../core/pipes/newlines.pipe';
import { ObjectFilterPipe } from '../core/pipes/object-filter.pipe';
import { LinkifyPipe } from '../core/pipes/linkify.pipe';
import { MatDialogModule } from '@angular/material/dialog';
import { DialogComponent } from '../core/components/dialog/dialog.component';

@NgModule({
  imports: [BrowserModule, MatProgressBarModule, MatSnackBarModule, MatDialogModule],
  declarations: [OrderByPipe, NewlinesPipe, ObjectFilterPipe, LinkifyPipe, DialogComponent],
  exports: [
    MatProgressBarModule,
    MatSnackBarModule,
    OrderByPipe,
    NewlinesPipe,
    ObjectFilterPipe,
    LinkifyPipe,
    DialogComponent
  ]
})
export class SharedModule { }
