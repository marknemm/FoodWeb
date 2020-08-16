import { HttpErrorResponse } from '@angular/common/http';
import { TemplateRef } from '@angular/core';

export type AlertBody = string | TemplateRef<any>;
export type AlertLevel = 'info' | 'success' | 'warn' | 'danger';
export type RawAlertMessage = AlertBody | Error | HttpErrorResponse;

export interface AlertMessage {
  body: AlertBody;
  level: AlertLevel;
}
