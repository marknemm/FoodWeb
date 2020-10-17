import { Component, Input } from '@angular/core';
import { ErrorStateMatcher } from '@angular/material/core';
import { FloatLabelType } from '@angular/material/form-field';
import _ from '~lodash-mixins';
import { FormBaseComponent } from '~web/data-structure/form-base-component';
import { TFormControl } from '~web/data-structure/t-form-control';
import { FormHelperService } from '~web/shared/services/form-helper/form-helper.service';

@Component({ template: '' })
export class DateBaseComponent extends FormBaseComponent<Date> {

  @Input() allowClear: BooleanInput = false;
  @Input() bold: BooleanInput = false;
  @Input() defaultDate = '';
  @Input() editable: BooleanInput = false;
  @Input() errorStateMatcher: ErrorStateMatcher;
  @Input() floatLabels: FloatLabelType = 'auto';
  @Input() maxDate: Date;
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
    return (_.toBoolean(this.allowClear) && this.formControl?.value && this.formControl.enabled);
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
