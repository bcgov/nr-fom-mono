import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { ComponentType } from '@angular/cdk/portal';
import { DialogData } from '../models/dialog';
import { DialogComponent } from '../components/dialog/dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

export const dialogTypes = ['cancel'] as const;

@Injectable({
  providedIn: 'root',
})
export class ModalService {

  modalOpen = false;
  dialogRefClose$: Observable<MatDialogRef<any>>;

  constructor(public dialog: MatDialog, public snackBar: MatSnackBar) {
  }

  openSnackBar( { message, button }: { message: string, button?: string; } ) {
    return this.snackBar.open( message, button ?? button, { verticalPosition: 'top', panelClass: 'snackbar'} )
  }

  /**
   * open custom dialog
   *
   * @param dialogComponent  accetps a component Class
   * @param params
   */
  openCustomDialog<T>(dialogComponent: ComponentType<T>, params: MatDialogConfig): MatDialogRef<any> {
    const { data = null, disableClose = false } = params;

    return this.dialog.open(dialogComponent, {
      ...params,
      data,
      width: '90%',
      disableClose,
    });
  }

  openDialog(config: { data: DialogData }): MatDialogRef<any> {
    const { data } = config;
    const { width = null } = data;
    return this.dialog.open(DialogComponent, {
      data,
      width,
    });
  }

  openErrorDialog(message?: string, title: string = 'Error') {
    this.openDialog({
      data: {
        message: message || 'There was an error with the request, please try again.',
        title: title,
        width: '340px',
        height: '200px',
        buttons: {confirm: {text: 'OK'}}
      }
    });
  }

  openWarningDialog(message: string) {
    this.openDialog({
      data: {
        message: message,
        title: 'Warning',
        width: '340px',
        height: '200px',
        buttons: {confirm: {text: 'OK'}}
      }
    });
  }

  openConfirmationDialog(message: string, title: string): MatDialogRef<any> {
    const dialogRef = this.openDialog({
      data: {
        message: message,
        title: title,
        width: '340px',
        height: '200px',
        buttons: {confirm: {text: 'OK'}, cancel: { text: 'Cancel' }}
      }
    });
    return dialogRef;
  }

  updateDialogRefSubject(ref: MatDialogRef<any>): void {
    this.dialogRefClose$ = ref.afterClosed();
  }
}
