import { AbstractControl } from '@angular/forms';
import { TAbstractControl } from './t-abstract-control';

// tslint:disable-next-line: array-type
export type ExtractArrayType<T> = T extends Array<infer U>
  ? U
  : never;

export type ExtractControlType<T> = T extends TAbstractControl<infer U>
  ? U
  : T extends AbstractControl
      ? any
      : T;
