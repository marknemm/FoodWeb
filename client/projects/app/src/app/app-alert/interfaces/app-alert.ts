import { AlertLevel, SimpleAlert } from '~web/alert/interfaces/simple-alert';
import { FeedbackShowOptions } from 'nativescript-feedback';
export * from '~web/alert/interfaces/simple-alert';

export type AppAlertConfig = FeedbackShowOptions;

export interface AppAlert<T = any> extends SimpleAlert {
  title?: string;
  message: string;
  level: AlertLevel;
  blocking?: boolean;
  actions?: AppAlertAction<T>[];
  primaryAction?: AppAlertAction<T>;
}

export interface AppAlertAction<T = any> {
  text?: string;
  value: T;
  color?: string;
}
