import { Component, ElementRef, EventEmitter, HostBinding, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { AutocapitalizationType, Label, ReturnKeyType, TextField } from '@nativescript/core';
import { KeyboardType } from '@nativescript/core/ui/enums';
import { TextAlignment, TextDecoration, TextTransform, WhiteSpace } from '@nativescript/core/ui/text-base';
import { AppFocusService, Focusable, FocusableComponent } from '~app/app-shared/services/app-focus/app-focus.service';
import { Convert } from '~web/component-decorators';
import { FormBaseComponent, FormHelperService, formProvider, TFormControl } from '~web/forms';

@Component({
  selector: 'foodweb-app-text-field',
  templateUrl: './app-text-field.component.html',
  styleUrls: ['./app-text-field.component.scss'],
  providers: formProvider(AppTextFieldComponent)
})
export class AppTextFieldComponent extends FormBaseComponent<string> implements OnChanges, FocusableComponent {

  static readonly DEFAULT_INLINE_COLUMN_SCHEMA = '110,*';

  @Input() autocapitalizationType: AutocapitalizationType = 'none';
  @Convert()
  @Input() autocorrect: boolean = true;
  @Convert()
  @Input() editable: boolean = true;
  @Convert()
  @Input() editableToggle: boolean = false;
  @Input() hint = '';
  @Input() inlineColumnsSchema = AppTextFieldComponent.DEFAULT_INLINE_COLUMN_SCHEMA;
  @Convert()
  @Input() isReturnKeyTypeDone: boolean = false;
  @Input() keyboardType: KeyboardType;
  @Input() label = '';
  @Convert()
  @Input() letterSpacing: number = 0;
  @Convert()
  @Input() lineHeight: number;
  @Convert()
  @Input() maxLength: number = 999999999;
  @Input() nextFocus: Focusable;
  @Input() orientation: 'horizontal' | 'vertical' = 'horizontal';
  @Convert()
  @Input() readonlyKeepEditableStyles: boolean = false;
  @Input() readonlyOrientation: 'horizontal' | 'vertical' = 'horizontal';
  @Input() requiredErrorMsg = 'Required';
  @Input() returnKeyType: ReturnKeyType = 'next';
  @Convert()
  @Input() secure: boolean = false;
  @Convert()
  @Input() secureWithoutAutofill: boolean = false;
  @Input() text = '';
  @Input() textAlignment: TextAlignment = 'left';
  @Input() textDecoration: TextDecoration = 'none';
  /**
   * When set to a non-empty string, will be shown as the value of the readonly input even if a (formControl) value is set afterwords.
   * Used as an override for the value that gets displayed in a contained readonly Label.
   */
  @Input() textOverride = '';
  @Input() textTransform: TextTransform = 'none';
  @Input() visible: VisibleInput = 'visible';
  @Input() whiteSpace: WhiteSpace = 'normal';

  @Output() blur = new EventEmitter();
  @Output() done = new EventEmitter();
  @Output() edit = new EventEmitter<boolean>();
  // tslint:disable-next-line: no-output-rename
  @Output('focus') focusOutput = new EventEmitter();
  @Output() returnPress = new EventEmitter();
  @Output() save = new EventEmitter<() => void>();
  @Output() textChange = new EventEmitter();
  @Output() textFieldTap = new EventEmitter();

  @ViewChild('labelRef', { static: true }) labelRef: ElementRef<Label>;
  @ViewChild('readonlyRef', { static: true }) readonlyRef: ElementRef<Label>;
  @ViewChild('textFieldRef', { static: true }) textFieldRef: ElementRef<TextField>;

  @HostBinding() readonly class = 'foodweb-app-text-field';

  constructor(
    private _focusService: AppFocusService,
    formHelperService: FormHelperService,
  ) {
    super(() => new TFormControl<string>(), formHelperService);
  }

  /**
   * The columns schema for the GridLayout contained within this component.
   */
  get columnsSchema(): string {
    const baseColumnsSchema = (this.orientationHorizontal ? this.inlineColumnsSchema : '*');
    return (this.editableToggle ? `${baseColumnsSchema},50` : baseColumnsSchema);
  }

  /**
   * The current orientation of the text field based off of the editable state.
   */
  get currentOrientation(): 'horizontal' | 'vertical' {
    return (this.editable || this.readonlyKeepEditableStyles)
      ? this.orientation
      : this.readonlyOrientation;
  }

  /**
   * The ngClass object for the GridLayout contained within this component.
   */
  get gridNgClass(): any {
    return {
      editable: (this.editable || this.readonlyKeepEditableStyles),
      error: this.errorsVisible,
      horizontal: this.orientationHorizontal,
      underline: this.underlineVisible,
      vertical: !this.orientationHorizontal
    };
  }

  /**
   * Whether or not text field error messages are visible.
   */
  get errorsVisible(): boolean {
    return ((this.editable || this.readonlyKeepEditableStyles) && this.formControl.touched && this.formControl.invalid);
  }

  /**
   * Whether or not the text field is focusable.
   */
  get focusable(): boolean {
    return this._focusService.isFocusable([this.editable, this.visible]);
  }

  /**
   * The focusable element contained within this text field component (e.g. the native TextField).
   */
  get focusElement(): Focusable {
    return this.textFieldRef.nativeElement;
  }

  /**
   * Whether or not the orientation of the text field is horizontal. If not, then the orientation is implied to be vertical.
   */
  get orientationHorizontal(): boolean {
    return (this.currentOrientation === 'horizontal');
  }

  /**
   * Whether or not the readonly label is visible.
   */
  get readonlyLabelVisible(): boolean {
    // Don't show label if keeping editable styles when readonly, and no readonly text is present, so we can view TextField's placeholder.
    return (!this.editable && (!this.readonlyKeepEditableStyles || !!this.readonlyText));
  }

  /**
   * The text value for the readonly label.
   * If a textOverride input value is present, then it is used. Otherwise, the contained value is used.
   */
  get readonlyText(): string {
    return (this.textOverride ? this.textOverride : this.value);
  }

  /**
   * Whether or not the required error message is visible.
   */
  get requiredErrorVisible(): boolean {
    return (this.formControl.hasError('required') && !!this.requiredErrorMsg);
  }

  /**
   * The rows schema for the GridLayout contained within this component.
   */
  get rowsSchema(): string {
    return (this.orientationHorizontal || !this.label)
      ? 'auto'
      : 'auto,auto';
  }

  /**
   * The colSpan for the TextField contained within this component.
   */
  get textFieldColSpan(): number {
    return (this.orientationHorizontal && this.label)
      ? 1
      : 2;
  }

  /**
   * The column index for the TextField contained within this component.
   */
  get textFieldColumn(): number {
    return (this.orientationHorizontal && this.label)
      ? 1
      : 0;
  }

  /**
   * The row index for the TextField contained within this component.
   */
  get textFieldRow(): number {
    return (this.orientationHorizontal || !this.label)
      ? 0
      : 1;
  }

  /**
   * Whether or not the contained TextField is visible.
   */
  get textFieldVisible(): boolean {
    // Show TextField if keeping editable styles when readonly, and no readonly text is present, so we can view its placeholder.
    return (this.editable || (this.readonlyKeepEditableStyles && !this.readonlyText));
  }

  /**
   * The column index for the editable toggle contained within this component.
   */
  get editableToggleColumn(): number {
    return (this.orientationHorizontal ? 2 : 1);
  }

  /**
   * Whether or not an underline is visible within this component.
   */
  get underlineVisible(): boolean {
    return (this.editable || this.readonlyKeepEditableStyles || this.editableToggle);
  }

  /**
   * @inheritdoc
   */
  ngOnChanges(changes: SimpleChanges): void {
    super.ngOnChanges(changes);
    // Sync returnKeyType with isReturnKeyTypeDone flag.
    if (changes.isReturnKeyTypeDone && this.isReturnKeyTypeDone != null) {
      this.returnKeyType = (this.isReturnKeyTypeDone ? 'done' : 'next');
    }
  }

  /**
   * Hides the soft input method, usually a soft keyboard.
   */
  dismissSoftInput(): void {
    this.textFieldRef.nativeElement.dismissSoftInput();
  }

  /**
   * @inheritdoc
   */
  focus(): boolean {
    // TODO: Add ability to select all text on focus.
    return this._focusService.focus(this, this.textFieldRef.nativeElement);
  }

  /**
   * Hanldes return press events, which occur on a device's soft keyboard.
   * @param event The key return press event.
   */
  onReturnPress(event: any): void {
    this.returnPress.emit(event);
    if (this.returnKeyType === 'next') {
      this._focusService.focusNext(this, true);
    } else if (this.returnKeyType === 'done') {
      this.done.emit();
    }
  }

  /**
   * Sets the editable state of the text field.
   * @param editable The editable state to set.
   */
  setEditable(editable: boolean): void {
    this.editable = editable;
    this.edit.emit(editable);
    if (editable) {
      setTimeout(() => this.focus());
    }
  }
}
