
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

