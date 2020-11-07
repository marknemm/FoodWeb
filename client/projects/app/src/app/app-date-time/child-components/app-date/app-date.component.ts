import { Component, EventEmitter, Input, Output, ViewChild, ViewContainerRef } from '@angular/core';
import { ModalDialogService } from '@nativescript/angular';
import { AppDateDialogComponent, AppDateDialogContext } from '~app/app-date-time/child-components/app-date-dialog/app-date-dialog.component';
import { AppFocusMaskComponent } from '~app/app-shared/child-components/app-focus-mask/app-focus-mask.component';
import { AppTextFieldComponent } from '~app/app-shared/child-components/app-text-field/app-text-field.component';
import { AppFocusService, Focusable, FocusableComponent } from '~app/app-shared/services/app-focus/app-focus.service';
import _ from '~lodash-mixins';
import { DateBaseComponent } from '~web/date-time/child-components/date/date.base.component';
import { DateTimeService } from '~web/date-time/services/date-time/date-time.service';
import { FormHelperService, formProvider } from '~web/forms';

@Component({
  selector: 'foodweb-app-date',
  templateUrl: './app-date.component.html',
  styleUrls: ['./app-date.component.scss'],
  providers: formProvider(AppDateComponent)
})
export class AppDateComponent extends DateBaseComponent implements FocusableComponent {

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

  @Output() blur = new EventEmitter();
  // tslint:disable-next-line: no-output-rename
  @Output('focus') focusOutput = new EventEmitter();

  @ViewChild('focusMask', { static: true }) focusMask: AppFocusMaskComponent;

  constructor(
    private _dateTimeService: DateTimeService,
    private _focusService: AppFocusService,
    private _modalDialogService: ModalDialogService,
    private _viewContainerRef: ViewContainerRef,
    formHelperService: FormHelperService
  ) {
    super(formHelperService);
  }

  focus(): boolean {
    throw this._focusService.focus(this, this.focusMask);
  }

  showDateDialog(dateTextField: AppTextFieldComponent): void {
    const context: AppDateDialogContext = this._genDateDialogContext();
    dateTextField.dismissSoftInput();

    this._modalDialogService
      .showModal(AppDateDialogComponent, {
        context,
        viewContainerRef: this._viewContainerRef
      })
      .then((date: Date) => {
        if (date) {
          this.formControl.setValue(date);
        }
        this._focusService.focusNext(this);
      });
  }

  private _genDateDialogContext(): AppDateDialogContext {
    const hintIsDialogTitle = _.toBoolean(this.hintIsDialogTitle);
    const title: string = (this.dialogTitle)
      ? this.dialogTitle
      : (hintIsDialogTitle) ? this.hint : this.label;

    return {
      date: this._dateTimeService.toDate(
        this.formControl.value ? this.formControl.value : this.defaultDate
      ),
      maxDate: this.maxDate,
      minDate: this.minDate,
      title,
    };
  }
}
