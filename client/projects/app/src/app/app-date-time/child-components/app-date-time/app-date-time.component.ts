import { Component, EventEmitter, forwardRef, Input, Output, ViewChild } from '@angular/core';
import { NG_VALIDATORS } from '@angular/forms';
import { TextTransform } from '@nativescript/core';
import { TextAlignment, TextDecoration, WhiteSpace } from '@nativescript/core/ui/text-base';
import { AppDateComponent } from '~app/app-date-time/child-components/app-date/app-date.component';
import { AppTimeComponent } from '~app/app-date-time/child-components/app-time/app-time.component';
import { Focusable, FocusableComponent } from '~app/app-shared/interfaces/focusable';
import { AppFocusService } from '~app/app-shared/services/app-focus/app-focus.service';
import { Convert } from '~web/component-decorators';
import { DateTimeBaseComponent } from '~web/date-time/child-components/date-time/date-time.base.component';
import { DateTimeService } from '~web/date-time/services/date-time/date-time.service';
import { FormHelperService, formProvider } from '~web/forms';

@Component({
  selector: 'foodweb-app-date-time',
  templateUrl: './app-date-time.component.html',
  styleUrls: ['./app-date-time.component.scss'],
  providers: [
    formProvider(AppDateTimeComponent),
    { provide: NG_VALIDATORS, useExisting: forwardRef(() => AppDateTimeComponent), multi: true }
  ]
})
export class AppDateTimeComponent extends DateTimeBaseComponent implements FocusableComponent {

  @Input() dateLabel = '';
  @Convert()
  @Input() editable: boolean = true;
  @Convert()
  @Input() editableToggle: boolean = false;
  @Input() inlineColumnSchema = '60,*';
  @Convert()
  @Input() letterSpacing: number = 0;
  @Convert()
  @Input() lineHeight: number;
  @Input() nextFocus: Focusable;
  @Input() orientation: 'horizontal' | 'vertical' = 'horizontal';
  @Input() readonlyOrientation: 'horizontal' | 'vertical' = 'horizontal';
  @Input() requiredErrorMsg = 'required';
  @Input() textAlignment: TextAlignment = 'left';
  @Input() textDecoration: TextDecoration = 'none';
  @Input() textTransform: TextTransform = 'none';
  @Input() timeLabel = '';
  @Input() visible: VisibleInput;
  @Input() whiteSpace: WhiteSpace = 'normal';

  @Input() set dateHint(hint: string) { this.datePlaceholder = hint; }
           get dateHint(): string     { return this.datePlaceholder; }

  @Input() set timeHint(hint: string) { this.timePlaceholder = hint; }
           get timeHint(): string     { return this.timePlaceholder; }

  @ViewChild('dateField', { static: true }) dateField: AppDateComponent;
  @ViewChild('timeField', { static: true }) timeField: AppTimeComponent;

  @Output() blur = new EventEmitter();
  @Output() edit = new EventEmitter<boolean>();
  // tslint:disable-next-line: no-output-rename
  @Output('focus') focusOutput = new EventEmitter();
  @Output() save = new EventEmitter<() => {}>();

  constructor(
    formHelperService: FormHelperService,
    dateTimeService: DateTimeService,
    private _focusService: AppFocusService,
  ) {
    super(formHelperService, dateTimeService);
  }

  get currentOrientation(): 'horizontal' | 'vertical' {
    return (this.editable ? this.orientation : this.readonlyOrientation);
  }

  get dateTimeFieldRow(): number {
    return this.primaryLabel
      ? 1
      : 0;
  }

  get dateVisible(): boolean {
    return (this.editable || !this.excludeDateDisplay);
  }

  get focusable(): boolean {
    return this._focusService.isFocusable([this.editable, this.visible]);
  }

  get rowsSchema(): string {
    return this.primaryLabel
      ? 'auto,auto'
      : 'auto';
  }

  get timeVisible(): boolean {
    return (this.editable || !this.excludeTimeDisplay);
  }

  focus(): boolean {
    throw this._focusService.focus(this, this.dateField);
  }
}
