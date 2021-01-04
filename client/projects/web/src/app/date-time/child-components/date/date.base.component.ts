import { Component, Input } from '@angular/core';
import { ErrorStateMatcher } from '@angular/material/core';
import { FloatLabelType } from '@angular/material/form-field';
import { Convert } from '~web/component-decorators';
import { FormBaseComponent, FormHelperService, TFormControl } from '~web/forms';

@Component({ template: '' })
export class DateBaseComponent extends FormBaseComponent<Date> {

  @Convert()
  @Input() allowClear: boolean = false;
  @Convert()
  @Input() bold: boolean = false;
  @Convert()
  @Input() defaultDate: Date;
  @Input() errorStateMatcher: ErrorStateMatcher;
  @Input() floatLabels: FloatLabelType = 'auto';
  @Convert()
  @Input() maxDate: Date;
  @Convert()
  @Input() minDate: Date;
  @Input() minWidth = '';
  @Input() placeholder = '';

  constructor(
    formHelperService: FormHelperService
  ) {
    super(new TFormControl<Date>(), formHelperService);
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
