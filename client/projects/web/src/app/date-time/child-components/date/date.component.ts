import { Component, Input } from '@angular/core';
import { ErrorStateMatcher, FloatLabelType } from '@angular/material/core';
import { FormComponentBase, valueAccessorProvider } from '~web/data-structure/form-component-base';
import { FormHelperService } from '~web/shared/services/form-helper/form-helper.service';

@Component({
  selector: 'foodweb-date',
  templateUrl: './date.component.html',
  styleUrls: ['./date.component.scss'],
  providers: valueAccessorProvider(DateComponent)
})
export class DateComponent extends FormComponentBase<Date> {

  @Input() allowClear = false;
  @Input() bold = false;
  @Input() date: Date;
  @Input() defaultDate = '';
  @Input() editing = false;
  @Input() errorStateMatcher: ErrorStateMatcher;
  @Input() floatLabels: FloatLabelType = 'auto';
  @Input() maxDate: Date;
  @Input() minDate: Date;
  @Input() minWidth = '';
  @Input() placeholder = '';

  constructor(
    formHelperService: FormHelperService
  ) {
    super(formHelperService);
  }

  /**
   * Whether or not to show the clear button for the date input field.
   */
  get showClearButton(): boolean {
    return (this.allowClear && this.formControl?.value && this.formControl.enabled);
  }

  /**
   * The date that is to be displayed when not in editing mode.
   */
  get dateDisplay(): Date {
    return (this.date ? this.date : this.formControl.value);
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
