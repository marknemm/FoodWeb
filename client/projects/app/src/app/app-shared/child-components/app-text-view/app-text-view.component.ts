import { Component, ElementRef, EventEmitter, Input, HostBinding, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { AutocapitalizationType, Label, ReturnKeyType, TextTransform, TextView } from '@nativescript/core';
import { KeyboardType } from '@nativescript/core/ui/enums';
import { TextAlignment, TextDecoration, WhiteSpace } from '@nativescript/core/ui/text-base';
import { AppFocusService, Focusable, FocusableComponent } from '~app/app-shared/services/app-focus/app-focus.service';
import { Convert } from '~web/component-decorators';
import { FormBaseComponent, FormHelperService, formProvider, TFormControl } from '~web/forms';

@Component({
  selector: 'foodweb-app-text-view',
  templateUrl: './app-text-view.component.html',
  styleUrls: ['./app-text-view.component.scss'],
  providers: formProvider(AppTextViewComponent)
})
export class AppTextViewComponent extends FormBaseComponent<string> implements OnChanges, FocusableComponent {

  @Input() autocapitalizationType: AutocapitalizationType = 'none';
  @Convert()
  @Input() autocorrect: boolean = true;
  @Convert()
  @Input() editable: boolean = true;
  @Convert()
  @Input() editableToggle: boolean = false;
  @Input() hint = '';
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
  @Input() requiredErrorMsg = 'Required';
  @Input() returnKeyType: ReturnKeyType;
  @Convert()
  @Input() secure: boolean = false;
  @Input() text = '';
  @Input() textAlignment: TextAlignment = 'left';
  @Input() textDecoration: TextDecoration = 'none';
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
  @ViewChild('textViewRef', { static: true }) textViewRef: ElementRef<TextView>;

  @HostBinding() readonly class = 'foodweb-app-text-view';

  constructor(
    private _focusService: AppFocusService,
    formHelperService: FormHelperService,
  ) {
    super(new TFormControl<string>(), formHelperService);
  }

  /**
   * The ngClass object for the GridLayout contained within this component.
   */
  get gridNgClass(): any {
    return {
      editable: this.editable,
      error: this.errorsVisible
    };
  }

  /**
   * Whether or not text view error messages are visible.
   */
  get errorsVisible(): boolean {
    return (this.editable && this.formControl.touched && this.formControl.invalid);
  }

  /**
   * Whether or not the text view is focusable.
   */
  get focusable(): boolean {
    return this._focusService.isFocusable([this.editable, this.visible]);
  }

  /**
   * The focusable element contained within this text view component (e.g. the native TextView).
   */
  get focusElement(): Focusable {
    return this.textViewRef.nativeElement;
  }

  /**
   * Whether or not the required error message is visible.
   */
  get requiredErrorVisible(): boolean {
    return (this.formControl.hasError('required') && !!this.requiredErrorMsg);
  }

  /**
   * @inheritdoc
   */
  ngOnChanges(changes: SimpleChanges): void {
    super.ngOnChanges(changes);
    if (changes.isReturnKeyTypeDone && this.isReturnKeyTypeDone != null) {
      this.returnKeyType = (this.isReturnKeyTypeDone ? 'done' : 'next');
    }
  }

  /**
   * Hides the soft input method, usually a soft keyboard.
   */
  dismissSoftInput(): void {
    this.textViewRef.nativeElement.dismissSoftInput();
  }

  /**
   * @inheritdoc
   */
  focus(): boolean {
    return this._focusService.focus(this, this.textViewRef.nativeElement);
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
   * Sets the editable state of the text view.
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
