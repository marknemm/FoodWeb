import { Component, EventEmitter, Input, Output, ViewChild, ViewContainerRef } from '@angular/core';
import { ModalDialogService } from '@nativescript/angular';
import { TextTransform } from '@nativescript/core';
import { TextAlignment, TextDecoration, WhiteSpace } from '@nativescript/core/ui/text-base';
import { AppDateDialogComponent, AppDateDialogContext } from '~app/app-date-time/child-components/app-date-dialog/app-date-dialog.component';
import { AppFocusMaskComponent } from '~app/app-shared/child-components/app-focus-mask/app-focus-mask.component';
import { AppTextFieldComponent } from '~app/app-shared/child-components/app-text-field/app-text-field.component';
import { AppFocusService, Focusable, FocusableComponent } from '~app/app-shared/services/app-focus/app-focus.service';
import { Convert } from '~web/component-decorators';
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

  @Output() blur = new EventEmitter();
  @Output() edit = new EventEmitter<boolean>();
  // tslint:disable-next-line: no-output-rename
  @Output('focus') focusOutput = new EventEmitter();
  @Output() save = new EventEmitter<() => {}>();

  @ViewChild('dateTextField', { static: true }) dateTextField: AppTextFieldComponent;
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
    throw this._focusService.focus(this, this.focusMask);
  }

  /**
   * Sets the editable state of the select field.
   * @param editable The editable state to set.
   */
  setEditable(editable: boolean): void {
    this.editable = editable;
    this.edit.emit(editable);
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
        this.formControl.markAsTouched(); // Be sure to mark as touched to show any errors that may be present.
      });
  }

  private _genDateDialogContext(): AppDateDialogContext {
    return {
      date: this._dateTimeService.toDate(
        this.formControl.value ? this.formControl.value : this.defaultDate
      ) ?? new Date(),
      maxDate: (this.maxDate ?? new Date(Date.now() + 10000000000000)),
      minDate: (this.minDate ?? new Date(Date.now() - 10000000000000))
    };
  }
}
