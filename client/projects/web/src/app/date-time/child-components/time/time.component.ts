import { Component, Input } from '@angular/core';
import { ErrorStateMatcher, FloatLabelType } from '@angular/material/core';
import { FormComponentBase, valueAccessorProvider } from '~web/data-structure/form-component-base';
import { FormHelperService } from '~web/shared/form-helper/form-helper.service';

@Component({
  selector: 'food-web-time',
  templateUrl: './time.component.html',
  styleUrls: ['./time.component.scss'],
  providers: valueAccessorProvider(TimeComponent)
})
export class TimeComponent extends FormComponentBase<string> {

  @Input() allowClear = false;
  @Input() bold = false;
  @Input() defaultTime = '';
  @Input() editing = false;
  @Input() errorStateMatcher: ErrorStateMatcher;
  @Input() floatLabels: FloatLabelType = 'auto';
  @Input() minutesGap = 5;
  @Input() placeholder = '';
  @Input() preventOverlayClick = false;
  @Input() time = '';

  constructor(
    formHelperService: FormHelperService
  ) {
    super(formHelperService);
  }

  /**
   * Whether or not to show the clear button for the time input field.
   */
  get showClearButton(): boolean {
    return (this.allowClear && this.formControl?.value && this.formControl.enabled);
  }

  /**
   * The time that is to be displayed when not in editing mode.
   */
  get timeDisplay(): string {
    return (this.time ? this.time : this.formControl.value);
  }

  /**
   * Clears the time input field.
   * @param event The mouse (button) click event.
   */
  clearTime(event: MouseEvent): void {
    this.formControl.reset();
    event.stopPropagation();
  }

  /**
   * @override
   * @param time The time value to write.
   */
  writeValue(time: string): void {
    super.writeValue(time);
    if (time) {
      this.defaultTime = time;
    }
  }

}
