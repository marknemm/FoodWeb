import { ModalDialogOptions } from '@nativescript/angular';
import { FeedbackShowOptions } from 'nativescript-feedback';
import { AlertLevel, SimpleAlert } from '~web/alert/interfaces/simple-alert';
export * from '~web/alert/interfaces/simple-alert';

export type AppAlertConfig = FeedbackShowOptions & ModalDialogOptions;

export interface AppAlert<T = any> extends SimpleAlert {
  title?: string;
  message: string;
  level: AlertLevel;
  blocking?: boolean;
  actions?: AppAlertAction<T>[];
}

export interface AppAlertAction<T = any> {
  text?: string;
  value: T;
  color?: string;
  focusPrimary?: boolean;
}
