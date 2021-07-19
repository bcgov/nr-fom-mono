import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { ComponentType } from '@angular/cdk/portal';
import { DialogData } from '../models/dialog';

import * as R from 'remeda';
import { DialogComponent } from '../components/dialog/dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

export const dialogTypes = ['cancel'] as const;

export const ERROR_DIALOG = {
  title: '',
  message: 'Something went wrong with the request. Please try again.',
  width: '340px',
  height: '200px',
  buttons: {
    cancel: {
      text: 'Close',
    },
  },
};

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  modalOpen = false;
  dialogRefClose$: Observable<MatDialogRef<any>>;

  private _errorDialog: DialogData;

  get errorDialog() {
    return this._errorDialog;
  }

  constructor(public dialog: MatDialog, public snackBar: MatSnackBar) {
    this._errorDialog = R.clone(ERROR_DIALOG);
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

  updateDialogRefSubject(ref: MatDialogRef<any>): void {
    this.dialogRefClose$ = ref.afterClosed();
  }
}
