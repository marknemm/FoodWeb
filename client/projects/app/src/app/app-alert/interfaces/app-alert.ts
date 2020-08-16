import { AlertBody, AlertLevel, AlertMessage } from '~web/alert/interfaces/alert-message';
export * from '~web/alert/interfaces/alert-message';

export type AppAlertConfig<T = any> = any;

export interface AppAlert<T = any> extends AlertMessage {
  title?: string;
  body: AlertBody;
  level: AlertLevel;
  blocking?: boolean;
  actions?: AppAlertAction<T>[];
  primaryAction?: AppAlertAction<T>;
}

export interface AppAlertAction<T = any> {
  text?: string;
  value: T;
  color?: string;
  buttonType?: string;
  cdkFocusPrimary?: boolean;
}
