import { AbstractControl } from '@angular/forms';
import { TAbstractControl } from '~web/forms/classes/t-abstract-control';

/**
 * A type extension that is used to extract the type of a TAbstractControl.
 */
export type ExtractControlType<T> = T extends TAbstractControl<infer U>
  ? U
  : T extends AbstractControl
      ? any
      : T;
