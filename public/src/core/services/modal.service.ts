import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { ComponentType } from '@angular/cdk/portal';
import { DialogComponent, DialogData } from '../../core/components/dialog/dialog.component';
export const dialogTypes = ['cancel'] as const;

@Injectable({
  providedIn: 'root',
})
export class ModalService {

  constructor(public dialog: MatDialog) {
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

  showFOMinitFailure() {
    this.openDialog({ data: {
      message: `Please try again later.`,
      title: `Error: FOM initialization failed.`,
      buttons: { cancel: { text: 'OK' } },
    }});
  }

}
