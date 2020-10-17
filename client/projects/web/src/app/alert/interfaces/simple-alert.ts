import { HttpErrorResponse } from '@angular/common/http';

export type AlertLevel = 'info' | 'success' | 'warn' | 'danger';
export type RawAlertMessage = string | Error | HttpErrorResponse;

export interface SimpleAlert {
  message: string;
  level: AlertLevel;
  blocking?: boolean;
}
