import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ErrorStateMatcher } from '@angular/material/core';
import { FormBaseComponent, FormHelperService, formProvider, TFormControl } from '~web/forms';

@Component({
  selector: 'foodweb-hybrid-date-time',
  templateUrl: './date-time.component.html',
  styleUrls: ['./date-time.component.scss'],
  providers: formProvider(DateTimeComponent)
})
export class DateTimeComponent extends FormBaseComponent<Date> implements OnChanges, OnInit {

  @Input() allowClear = false;
  @Input() allowUndefTime = false;
  @Input() boldDate = false;
  @Input() boldTime = false;
  @Input() defaultDate: Date;
  @Input() defaultTime = '12:00 pm';
  @Input() errorStateMatcher: ErrorStateMatcher;
  @Input() excludeDate = false;
  @Input() excludeDateDisplay = false;
  @Input() excludeTime = false;
  @Input() excludeTimeDisplay = false;
  @Input() label: string;
  @Input() labelPosition: 'fixed' | 'floating' | 'stacked' = 'fixed';
  @Input() maxDate: Date;
  @Input() minDate = new Date();
  @Input() minDateWidth = '';
  @Input() minuteValues = '0,5,10,15,20,25,30,35,40,45,50,55';

  private _displayFormat = 'MMM D YYYY, h:mm A';

  constructor(formHelperService: FormHelperService) {
    super(() => new TFormControl<Date, string>(), formHelperService);
  }

  get displayFormat(): string {
    return this._displayFormat;
  }

  ngOnInit() {
    console.log('HERE: ', this.formControl);
    this.formControl.registerValueConverter({
      convert: (str: string) => str ? new Date(str) : null,
      unconvert: (date: Date) => date ? date.toISOString() : '',
      formHelperService: this._formHelperService
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    super.ngOnChanges(changes);
    if (changes.excludeDate || changes.excludeTime) {
      this._refreshPickerFormat();
    }
  }

  /**
   * Refreshes the underlying ion-datetime field's picker format based on input bindings.
   */
  private _refreshPickerFormat(): void {
    this._displayFormat = '';
    if (!this.excludeDate) {
      this._displayFormat += 'MMM D YYYY';
    }
    if (!this.excludeDate && !this.excludeTime) {
      this._displayFormat += ', ';
    }
    if (!this.excludeTime) {
      this._displayFormat += 'h:mm A';
    }
  }

}
