import { Component, Input, OnInit } from '@angular/core';
import { ErrorStateMatcher } from '@angular/material/core';
import { FloatLabelType } from '@angular/material/form-field';
import { Convert, DateConverter } from '~web/component-decorators';
import { FormBaseComponent, FormHelperService, TFormControl } from '~web/forms';

@Component({ template: '' })
export class TimeBaseComponent extends FormBaseComponent<string> implements OnInit {

  @Input() errorStateMatcher: ErrorStateMatcher;
  @Input() floatLabels: FloatLabelType = 'auto';
  @Input() placeholder = '';

  @Convert()
  @Input() allowClear: boolean = false;
  @Convert()
  @Input() bold: boolean = false;
  @Convert(DateConverter)
  @Input() defaultTime: string | Date =  '12:00 pm';
  @Convert()
  @Input() minutesGap: number = 5;
  @Convert()
  @Input() preventOverlayClick: boolean = false;

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

  ngOnInit() {}

  /**
   * Clears the time input field.
   * @param event The mouse (button) click event.
   */
  clearTime(event: MouseEvent): void {
    this.formControl.reset();
    event.stopPropagation();
  }
}
