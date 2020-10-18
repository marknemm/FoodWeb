import { HttpErrorResponse } from '@angular/common/http';

export type AlertLevel = 'info' | 'success' | 'warn' | 'danger';
export type RawAlertMessage = string | Error | HttpErrorResponse;

export interface AlertBase<T = any> {
  title?: string;
  message: string;
  level: AlertLevel;
  blocking?: boolean;
  actions?: AlertActionBase<T>[];
  primaryAction?: AlertActionBase<T>;
}

export interface AlertActionBase<T = any> {
  text?: string;
  value: T;
  color?: string;
  buttonType?: string;
  focusPrimary?: boolean;
}
