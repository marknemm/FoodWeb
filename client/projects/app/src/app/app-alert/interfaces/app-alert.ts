import { ModalDialogOptions } from '@nativescript/angular';
import { FeedbackShowOptions } from 'nativescript-feedback';
import { AlertActionBase, AlertBase } from '~web/alert/interfaces/alert-base';
export { AlertLevel, RawAlertMessage } from '~web/alert/interfaces/alert-base';

export type AppAlertConfig = FeedbackShowOptions & ModalDialogOptions;

export interface AppAlert<T = any> extends AlertBase<T> {}

export interface AppAlertAction<T = any> extends AlertActionBase<T> {}
