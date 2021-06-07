import { Component, Input } from '@angular/core';
import { ErrorStateMatcher } from '@angular/material/core';
import { DateFilterFn } from '@angular/material/datepicker';
import { FloatLabelType } from '@angular/material/form-field';
import { FormBaseComponent, FormHelperService, TFormControl } from '~web/forms';

@Component({ template: '' })
export class DateBaseComponent extends FormBaseComponent<Date> {

  @Input() allowClear = false;
  @Input() bold = false;
  @Input() dateFilter: DateFilterFn<Date>;
  @Input() defaultDate: Date;
  @Input() errorStateMatcher: ErrorStateMatcher;
  @Input() floatLabels: FloatLabelType = 'auto';
  @Input() maxDate: Date;
  @Input() minDate: Date;
  @Input() minWidth = '';
  @Input() placeholder = '';

  constructor(
    formHelperService: FormHelperService
  ) {
    super(() => new TFormControl<Date>(), formHelperService);
  }

  /**
   * Whether or not to show the clear button for the date input field.
   */
  get showClearButton(): boolean {
    return (this.allowClear && this.formControl?.value && this.formControl.enabled);
  }

  /**
   * Clears the date input field.
   * @param event The mouse (button) click event.
   */
  clearDate(event: MouseEvent): void {
    this.formControl.reset();
    event.stopPropagation();
  }
}
