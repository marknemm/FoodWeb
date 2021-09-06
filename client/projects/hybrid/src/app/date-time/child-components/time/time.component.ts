import { Component, Input, OnInit } from '@angular/core';
import { DateTimeService } from '~web/date-time/services/date-time/date-time.service';
import { FormBaseComponent, FormHelperService, formProvider, TFormControl } from '~web/forms';

@Component({
  selector: 'foodweb-hybrid-time',
  templateUrl: './time.component.html',
  styleUrls: ['./time.component.scss'],
  providers: formProvider(TimeComponent)
})
export class TimeComponent extends FormBaseComponent<string> implements OnInit {

  @Input() allowClear = false;
  @Input() bold = false;
  @Input() defaultTime: string | Date =  '12:00 pm';
  @Input() label: string;
  @Input() labelPosition: 'fixed' | 'floating' | 'stacked' = 'fixed';
  @Input() minuteValues = '0,5,10,15,20,25,30,35,40,45,50,55';

  constructor(
    private _dateTimeService: DateTimeService,
    formHelperService: FormHelperService
  ) {
    super(() => new TFormControl<string, Date>(), formHelperService);
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

  ngOnInit(): void {
    this.formControl.registerValueConverter({
      formHelperService: this._formHelperService,
      convert: (date: Date) => this._dateTimeService.toTimeStr(date),
      unconvert: (timeStr: string) => this._dateTimeService.toDate(timeStr)
    })
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
