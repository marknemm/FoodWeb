import { Component, EventEmitter, Input, Output, ViewChild, ViewContainerRef } from '@angular/core';
import { ModalDialogService } from '@nativescript/angular';
import { AppTimeDialogComponent, AppTimeDialogContext } from '~app/app-date-time/child-components/app-time-dialog/app-time-dialog.component';
import { AppFocusMaskComponent } from '~app/app-shared/child-components/app-focus-mask/app-focus-mask.component';
import { AppTextFieldComponent } from '~app/app-shared/child-components/app-text-field/app-text-field.component';
import { AppFocusService, Focusable, FocusableComponent } from '~app/app-shared/services/app-focus/app-focus.service';
import _ from '~lodash-mixins';
import { TimeBaseComponent } from '~web/date-time/child-components/time/time.base.component';
import { DateTimeService } from '~web/date-time/services/date-time/date-time.service';
import { FormHelperService, formProvider } from '~web/forms';

@Component({
  selector: 'foodweb-app-time',
  templateUrl: './app-time.component.html',
  styleUrls: ['./app-time.component.scss'],
  providers: formProvider(AppTimeComponent)
})
export class AppTimeComponent extends TimeBaseComponent implements FocusableComponent {

  @Input() dialogTitle = '';
  @Input() hintIsDialogTitle: BooleanInput = false;
  @Input() label = '';
  @Input() nextFocus: Focusable;
  @Input() visible: VisibleInput;

  @Input() set hint(value: string) {
    this.placeholder = value;
  }
  get hint(): string {
    return this.placeholder;
  }

  @Input() set minuteInterval(minutes: number) {
    this.minutesGap = minutes;
  }
  get minuteInterval(): number {
    return this.minutesGap;
  }

  @Output() blur = new EventEmitter();
  // tslint:disable-next-line: no-output-rename
  @Output('focus') focusOutput = new EventEmitter();

  @ViewChild('focusMask', { static: true }) focusMask: AppFocusMaskComponent;

  constructor(
    private _dateTimeService: DateTimeService,
    private _focusService: AppFocusService,
    private _modalDialogService: ModalDialogService,
    private _viewContainerRef: ViewContainerRef,
    formHelperService: FormHelperService,
  ) {
    super(formHelperService);
  }

  focus(): boolean {
    return this._focusService.focus(this, this.focusMask);
  }

  showTimeDialog(timeTextField: AppTextFieldComponent): void {
    const context: AppTimeDialogContext = this._genTimeDialogContext();
    timeTextField.dismissSoftInput();

    this._modalDialogService
      .showModal(AppTimeDialogComponent, {
        context,
        viewContainerRef: this._viewContainerRef
      })
      .then((time: Date) => {
        if (time) {
          const timeStr: string = this._dateTimeService.toLocalTimeStr(time);
          this.formControl.setValue(timeStr);
        }
        this._focusService.focusNext(this);
      });
  }

  private _genTimeDialogContext(): AppTimeDialogContext {
    const hintIsDialogTitle = _.toBoolean(this.hintIsDialogTitle);
    const title: string = (this.dialogTitle)
      ? this.dialogTitle
      : (hintIsDialogTitle) ? this.hint : this.label;

    return {
      minuteInterval: this.minutesGap,
      time: this._dateTimeService.timeStrToDate(
        this.value ? this.value : this.defaultTime
      ),
      title
    };
  }
}
