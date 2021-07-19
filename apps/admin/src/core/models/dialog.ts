import * as R from 'remeda';

/*TODO: move to dialogs component */
export interface DialogData {
  title: string;
  message: string;
  width?: string;
  height?: string;
  isWarning?: boolean;
  buttons: {
    cancel?: {
      text: string;
    };
    confirm?: {
      text: string;
    };
  };
}

const defaultDialog = {
  title: null,
  message: 'Discard current inquiry?',
  width: '400',
  height: '400',
  buttons: {
    cancel: {
      text: 'Cancel'
    },
    confirm: {
      text: 'Discard'
    }
  }
};

function baseDialogBuilder(data: DialogData) {
  const obj = R.clone(data);

  return (config: Partial<DialogData>) => {
    return R.merge(obj, config);
  };
}

export const customDialogData = baseDialogBuilder(defaultDialog);

export const DIALOGS = {
  defaultDialog
} as const;
