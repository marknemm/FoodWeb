import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ErrorStateMatcher } from '@angular/material/core';
import { FloatLabelType } from '@angular/material/form-field';
import { DateConverter, Convert } from '~web/component-decorators';
import { FormBaseComponent, FormHelperService, TFormControl } from '~web/forms';

@Component({ template: '' })
export class TimeBaseComponent extends FormBaseComponent<string> implements OnInit, OnChanges {

  @Input() errorStateMatcher: ErrorStateMatcher;
  @Input() floatLabels: FloatLabelType = 'auto';
  @Input() placeholder = '';

  @Convert()
  @Input() allowClear: boolean = false;
  @Convert()
  @Input() bold: boolean = false;
  @Convert(DateConverter)
  @Input() defaultTime: string | Date =  '';
  @Convert()
  @Input() minutesGap: number = 5;
  @Convert()
  @Input() preventOverlayClick: boolean = false;

  constructor(formHelperService: FormHelperService) {
    super(new TFormControl<string>(), formHelperService);
  }

  /**
   * Whether or not to show the clear button for the time input field.
   */
  get showClearButton(): boolean {
    return (this.allowClear && this.formControl?.value && this.formControl.enabled);
  }

  ngOnInit() {
    // Always sync defaultTime with currently set non-null value.
    this.onValueChanges().subscribe(() =>
      this.defaultTime = this.value ?? this.defaultTime
    );
  }

  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
    if (changes.defaultTime && this.formControl.value) {
      this.defaultTime = this.formControl.value;
    }
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
