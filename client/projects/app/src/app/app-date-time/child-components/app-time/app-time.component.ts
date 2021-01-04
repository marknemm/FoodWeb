import { Component, EventEmitter, Input, Output, ViewChild, ViewContainerRef } from '@angular/core';
import { ModalDialogService } from '@nativescript/angular';
import { TextTransform } from '@nativescript/core';
import { TextAlignment, TextDecoration, WhiteSpace } from '@nativescript/core/ui/text-base';
import { AppTimeDialogComponent, AppTimeDialogContext } from '~app/app-date-time/child-components/app-time-dialog/app-time-dialog.component';
import { AppFocusMaskComponent } from '~app/app-shared/child-components/app-focus-mask/app-focus-mask.component';
import { AppTextFieldComponent } from '~app/app-shared/child-components/app-text-field/app-text-field.component';
import { AppFocusService, Focusable, FocusableComponent } from '~app/app-shared/services/app-focus/app-focus.service';
import { Convert } from '~web/component-decorators';
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

  @Convert()
  @Input() editable: boolean = true;
  @Convert()
  @Input() editableToggle: boolean = false;
  @Input() inlineColumnSchema = AppTextFieldComponent.DEFAULT_INLINE_COLUMN_SCHEMA;
  @Input() label = '';
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
  @Input() visible: VisibleInput;
  @Input() whiteSpace: WhiteSpace = 'normal';

  @Input() set hint(value: string) { this.placeholder = value; }
           get hint(): string      { return this.placeholder; }

  @Input() set minuteInterval(minutes: number) { this.minutesGap = minutes; }
           get minuteInterval(): number        { return this.minutesGap; }

  @Output() blur = new EventEmitter();
  @Output() edit = new EventEmitter<boolean>();
  // tslint:disable-next-line: no-output-rename
  @Output('focus') focusOutput = new EventEmitter();
  @Output() save = new EventEmitter<() => {}>();

  @ViewChild('focusMask', { static: true }) focusMask: AppFocusMaskComponent;
  @ViewChild('timeTextField', { static: true }) timeTextField: AppTextFieldComponent;

  constructor(
    private _dateTimeService: DateTimeService,
    private _focusService: AppFocusService,
    private _modalDialogService: ModalDialogService,
    private _viewContainerRef: ViewContainerRef,
    formHelperService: FormHelperService,
  ) {
    super(formHelperService);
  }

  get currentOrientation(): 'horizontal' | 'vertical' {
    return (this.editable ? this.orientation : this.readonlyOrientation);
  }

  get focusable(): boolean {
    return this._focusService.isFocusable([this.editable, this.visible]);
  }

  get textFieldHasEditableStyles(): boolean {
    return (this.editable || this.editableToggle);
  }

  focus(): boolean {
    return this._focusService.focus(this, this.focusMask);
  }

  /**
   * Sets the editable state of the select field.
   * @param editable The editable state to set.
   */
  setEditable(editable: boolean): void {
    this.editable = editable;
    this.edit.emit(editable);
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
    return {
      minuteInterval: this.minutesGap,
      time: this._dateTimeService.timeStrToDate(
        this.value ? this.value : this.defaultTime
      )
    };
  }
}
