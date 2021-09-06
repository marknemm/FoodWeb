import { Component, Input } from '@angular/core';
import { ErrorStateMatcher } from '@angular/material/core';
import { FloatLabelType } from '@angular/material/form-field';
import { FormBaseComponent, FormHelperService, formProvider, TFormControl } from '~web/forms';

@Component({
  selector: 'foodweb-time',
  templateUrl: './time.component.html',
  styleUrls: ['./time.component.scss'],
  providers: formProvider(TimeComponent)
})
export class TimeComponent extends FormBaseComponent<string> {

  @Input() errorStateMatcher: ErrorStateMatcher;
  @Input() floatLabels: FloatLabelType = 'auto';
  @Input() placeholder = '';

  @Input() allowClear = false;
  @Input() bold = false;
  @Input() defaultTime: string | Date =  '12:00 pm';
  @Input() minutesGap = 5;
  @Input() preventOverlayClick = false;

  constructor(formHelperService: FormHelperService) {
    super(() => new TFormControl<string>(), formHelperService);
  }

  /**
   * If the current value of this time control is empty, then uses the `defaultTime` input binding.
   * Otherwise, uses the current value.
   */
  get activeDefaultTime(): string | Date {
    return (this.value ? this.value : this.defaultTime);
  }

  /**
   * Whether or not to show the clear button for the time input field.
   */
  get showClearButton(): boolean {
    return (this.allowClear && this.formControl?.value && this.formControl.enabled);
  }

  /**
   * Clears the time input field.
   * @param event The mouse (button) click event.
   */
  clearTime(event: MouseEvent): void {
    this.formControl.reset();
    event.stopPropagation();
  }
}
