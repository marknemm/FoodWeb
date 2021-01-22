import { Component, EventEmitter, HostBinding, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild, ViewContainerRef } from '@angular/core';
import { ModalDialogService } from '@nativescript/angular';
import { TextAlignment, TextDecoration, TextTransform, WhiteSpace } from '@nativescript/core/ui/text-base';
import { AppFocusMaskComponent } from '~app/app-shared/child-components/app-focus-mask/app-focus-mask.component';
import { AppSelectDialogComponent, AppSelectDialogContext } from '~app/app-shared/child-components/app-select-dialog/app-select-dialog.component';
import { AppTextFieldComponent } from '~app/app-shared/child-components/app-text-field/app-text-field.component';
import { RawSelectItem, SelectItem } from '~app/app-shared/interfaces/select-item';
import { AppFocusService, Focusable, FocusableComponent } from '~app/app-shared/services/app-focus/app-focus.service';
import { Convert } from '~web/component-decorators';
import { FormBaseComponent, FormHelperService, formProvider, TFormControl } from '~web/forms';
export * from '~app/app-shared/interfaces/select-item';

@Component({
  selector: 'foodweb-app-select',
  templateUrl: './app-select.component.html',
  styleUrls: ['./app-select.component.scss'],
  providers: formProvider(AppSelectComponent)
})
export class AppSelectComponent<T = any> extends FormBaseComponent<TFormControl<T>> implements OnInit, OnChanges, FocusableComponent {

  @Input() dialogTitle = ''; // Will default to label when supplied to select dialog.
  @Convert()
  @Input() editable: boolean = true;
  @Convert()
  @Input() editableToggle: boolean = false;
  @Input() hint = '';
  @Convert()
  @Input() hintIsDialogTitle: boolean = false;
  @Input() inlineColumnSchema = AppTextFieldComponent.DEFAULT_INLINE_COLUMN_SCHEMA;
  @Convert()
  @Input() isReturnKeyTypeDone: boolean = false;
  @Input() items: RawSelectItem<T>[] = [];
  @Input() label = '';
  @Convert()
  @Input() letterSpacing: number = 0;
  @Convert()
  @Input() lineHeight: number;
  @Input() nextFocus: Focusable;
  @Input() orientation: 'horizontal' | 'vertical' = 'horizontal';
  @Input() readonlyOrientation: 'horizontal' | 'vertical' = 'horizontal';
  @Input() requiredErrorMsg = 'Required';
  @Convert()
  @Input() selectedIndex: number;
  @Input() textAlignment: TextAlignment = 'left';
  @Input() textDecoration: TextDecoration = 'none';
  @Input() textTransform: TextTransform = 'none';
  @Input() visible: VisibleInput = 'visible';
  @Input() whiteSpace: WhiteSpace = 'normal';

  @Output() blur = new EventEmitter();
  @Output() edit = new EventEmitter<boolean>();
  // tslint:disable-next-line: no-output-rename
  @Output('focus') focusOutput = new EventEmitter();
  @Output() save = new EventEmitter<() => void>();
  @Output() select = new EventEmitter<SelectItem<T>>();
  @Output() selectDialogClose = new EventEmitter();
  @Output() selectDialogOpen = new EventEmitter();
  @Output() selectedIndexChange = new EventEmitter<number>();

  @ViewChild('textField', { static: true }) textField: AppTextFieldComponent;
  @ViewChild('focusMask', { static: true }) focusMask: AppFocusMaskComponent;

  @HostBinding() readonly class = 'foodweb-app-select';

  private _dialogOpened = false;
  private _itemNames: string[] = [];

  constructor(
    private _focusService: AppFocusService,
    private _modalDialogService: ModalDialogService,
    private _viewContainerRef: ViewContainerRef,
    formHelperService: FormHelperService
  ) {
    super(() => new TFormControl<T>(), formHelperService);
  }

  /**
   * The current orientation of the select field based off of the editable state.
   */
  get currentOrientation(): 'horizontal' | 'vertical' {
    return (this.editable ? this.orientation : this.readonlyOrientation);
  }

  /**
   * Whether or not the select dialog is opened.
   */
  get dialogOpened(): boolean {
    return this._dialogOpened;
  }

  /**
   * @inheritdoc
   */
  get focusable(): boolean {
    return this._focusService.isFocusable([this.editable, this.visible]);
  }

  /**
   * The focusable element contained within this select component (e.g. the focus mask).
   */
  get focusElement(): Focusable {
    return this.focusMask;
  }

  /**
   * The name of the selected item. Will be undefined if no item has been selected.
   */
  get selectedItemName(): string {
    return this._itemNames[this.selectedIndex];
  }

  /**
   * Whether or not to keep editable styles on the contained TextField while it is in readonly mode.
   */
  get textFieldHasEditableStyles(): boolean {
    return (this.editable || this.editableToggle);
  }

  /**
   * @inheritdoc
   */
  ngOnInit() {
    if (this.selectedIndex == null) {
      // setTimeout: Fix NativeScript timing bug for initialization of TextField value...
      setTimeout(() => this.selectedIndex = this._deriveSelectedIdx());
    }
    this.onValueChanges().subscribe(() =>
      this.selectedIndex = this._deriveSelectedIdx()
    );
  }

  /**
   * @inheritdoc
   */
  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
    if (changes.items) {
      this._itemNames = this._getItemNames();
    }
  }

  /**
   * @inheritdoc
   */
  focus(): boolean {
    return this._focusService.focus(this, this.focusMask);
  }

  /**
   * Handles tap events on the contained focus mask.
   */
  onFocusTap(): void {
    this.focusOutput.emit();
    this.showSelectDialog();
  }

  /**
   * Sets the editable state of the select field.
   * @param editable The editable state to set.
   */
  setEditable(editable: boolean): void {
    this.editable = editable;
    this.edit.emit(editable);
  }

  /**
   * Shows the select modal dialog.
   */
  showSelectDialog(): void {
    if (this.dialogOpened) { return; }

    const context: AppSelectDialogContext = this._genSelectDialogContext();
    this._dialogOpened = true;
    this.selectDialogOpen.emit();

    this._modalDialogService
      .showModal(AppSelectDialogComponent, {
        context,
        viewContainerRef: this._viewContainerRef
      })
      .then((selectedIdx: number) => {
        if (selectedIdx != null) {
          const selectedValue: T = this._getItemValue(selectedIdx);
          this.formControl.setValue(selectedValue); // Triggers selectedIndex/selectedItemName update.
          this.select.emit({ name: this.selectedItemName, value: selectedValue });
        }
        this._focusService.focusNext(this);
        this._dialogOpened = false;
        this.formControl.markAsTouched(); // Be sure to mark as touched to show any errors that may be present.
        this.selectDialogClose.emit();
      });
  }

  private _genSelectDialogContext(): AppSelectDialogContext {
    const title: string = (this.dialogTitle)
      ? this.dialogTitle
      : (this.hintIsDialogTitle) ? this.hint : this.label;

    return {
      items: this._getItemNames(),
      selectedIndexChange: this.selectedIndexChange,
      selectedIndex: this.selectedIndex,
      title
    };
  }

  private _getItemNames(): string[] {
    return this.items.map((__, idx: number) =>
      this._getItemName(idx)
    );
  }

  private _getItemName(idx: number): string {
    const item: RawSelectItem<T> = this.items[idx];
    return (typeof item === 'string') ? item : item.name;
  }

  private _deriveSelectedIdx(): number {
    const value: T = this.formControl.value;

    if (value) {
      this.selectedIndex = this.items.findIndex((__, idx: number) =>
        (this._getItemValue(idx) === value)
      );
    }

    if (!this.selectedIndex) {
      this.selectedIndex = 0;
    }
    return this.selectedIndex;
  }

  private _getItemValue(idx: number): T {
    return (typeof this.items[idx] === 'string')
      ? <any>this.items[idx]
      : this.items[idx].valueOf;
  }
}
